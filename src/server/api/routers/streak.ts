import { TRPCError } from "@trpc/server";

import { z } from "zod";
import { and, asc, desc, eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { streaks, users } from "~/server/db/schema";

// Helper function to calculate the inclusive day count between two dates
function calculateStreakLength(startDate: Date, endDate: Date): number {
  const oneDay = 24 * 60 * 60 * 1000; // ms in a day
  // Set time to the start of the day to avoid timezone/DST issues
  const start = new Date(startDate.toDateString());
  const end = new Date(endDate.toDateString());

  const diffDays = Math.round(
    Math.abs((end.getTime() - start.getTime()) / oneDay),
  );
  return diffDays + 1; // Add 1 to make the count inclusive
}

export const streakRouter = createTRPCRouter({
  /**
   * Get all streaks for the current user.
   */
  getStreaks: protectedProcedure.query(async ({ ctx }) => {
    const streakList = await ctx.db
      .select()
      .from(streaks)
      .where(eq(streaks.createdById, ctx.session.user.id))
      .orderBy(asc(streaks.position), desc(streaks.createdAt));

    //get timezone offset for the user
    const timezoneOffset = (
      await ctx.db
        .select({ timezoneOffset: users.timezoneOffset })
        .from(users)
        .where(eq(users.id, ctx.session.user.id))
    )[0]!.timezoneOffset;
    const timezoneOffsetMs = timezoneOffset * 60 * 60 * 1000; // Convert to milliseconds

    // apply timezone offset to dates
    const formattedStreakList = streakList.map((streak) => ({
      ...streak,
      currentStartDate: new Date(
        streak.currentStartDate.getTime() + timezoneOffsetMs,
      ),
      currentEndDate: new Date(
        streak.currentEndDate.getTime() + timezoneOffsetMs,
      ),
    }));
    return formattedStreakList;
  }),

  getClientDateTime: protectedProcedure.query(async ({ ctx }) => {
    let timezoneOffset = 0; // Default to UTC if no user found
    const result = (
      await ctx.db
        .select({ timezoneOffset: users.timezoneOffset })
        .from(users)
        .where(eq(users.id, ctx.session.user.id))
    )[0];
    if (result) {
      timezoneOffset = result.timezoneOffset;
    }
    return new Date(new Date().getTime() + timezoneOffset * 60 * 60 * 1000);
  }),

  /**
   * Reorder streaks.
   */
  reorder: protectedProcedure
    .input(z.array(z.object({ id: z.number(), position: z.number() })))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        for (const item of input) {
          await tx
            .update(streaks)
            .set({ position: item.position })
            .where(
              and(
                eq(streaks.id, item.id),
                eq(streaks.createdById, ctx.session.user.id),
              ),
            );
        }
      });
      return { success: true };
    }),

  /**
   * Create a new streak.
   */
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        color: z.string().length(7).default("#000000"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [maxPos] = await ctx.db
        .select({ position: streaks.position })
        .from(streaks)
        .where(eq(streaks.createdById, ctx.session.user.id))
        .orderBy(desc(streaks.position))
        .limit(1);

      const nextPosition = (maxPos?.position ?? 0) + 1;

      const [streak] = await ctx.db
        .insert(streaks)
        .values({
          title: input.title,
          description: input.description,
          color: input.color,
          createdById: ctx.session.user.id,
          currentStartDate: new Date(),
          currentEndDate: new Date(),
          position: nextPosition,
        })
        .returning();

      if (!streak) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Create: Streak not created.",
        });
      }

      return streak;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const [streak] = await ctx.db
        .select()
        .from(streaks)
        .where(
          and(
            eq(streaks.id, input.id),
            eq(streaks.createdById, ctx.session.user.id),
          ),
        );

      if (!streak) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Delete: Streak not found.",
        });
      }

      await ctx.db.delete(streaks).where(eq(streaks.id, input.id));
      return streak;
    }),

  /**
   * Update a streak's title, description, or color.
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        color: z.string().length(7).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      const [streak] = await ctx.db
        .update(streaks)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(
          and(eq(streaks.id, id), eq(streaks.createdById, ctx.session.user.id)),
        )
        .returning();
      if (!streak) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Update: Streak not found.",
        });
      }
      return streak;
    }),

  /**
   * Extend a streak by updating its current end date to now.
   * This is typically called when a user completes a daily task.
   */
  extend: protectedProcedure
    .input(z.object({ id: z.number(), timezoneOffset: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // 1. Fetch the full streak object
      const [streak] = await ctx.db
        .select()
        .from(streaks)
        .where(
          and(
            eq(streaks.id, input.id),
            eq(streaks.createdById, ctx.session.user.id),
          ),
        );

      if (!streak) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Extend: Streak not found.",
        });
      }

      // 2. Check if the streak is broken
      const today = new Date();
      const fourDaysInMs = 4 * 24 * 60 * 60 * 1000;
      const differenceInMs = today.getTime() - streak.currentEndDate.getTime();
      const isBroken = differenceInMs > fourDaysInMs;

      // 3. Perform conditional update
      if (isBroken) {
        // --- Logic for a broken streak ---

        // 1. Calculate the length of the streak that just ended
        const finishedStreakLength = calculateStreakLength(
          streak.currentStartDate,
          streak.currentEndDate,
        );

        // 2. Prepare the new entry for the pastStreaks history
        const nextStreakNumber =
          Object.keys(streak.pastStreaks as object).length + 1;
        const updatedPastStreaks = {
          ...(streak.pastStreaks as object),
          [nextStreakNumber]: {
            start: streak.currentStartDate.toISOString(),
            end: streak.currentEndDate.toISOString(),
          },
        };

        // 3. Update the database
        await ctx.db
          .update(streaks)
          .set({
            currentStartDate: today,
            currentEndDate: today,
            longestStreak: Math.max(streak.longestStreak, finishedStreakLength),
            pastStreaks: updatedPastStreaks, // Append the ended streak to history
            updatedAt: new Date(),
          })
          .where(eq(streaks.id, input.id));
      } else {
        // EXTEND streak: Only the end date needs to be updated.
        await ctx.db
          .update(streaks)
          .set({
            currentEndDate: today,
            updatedAt: new Date(),
          })
          .where(eq(streaks.id, input.id));
      }
      // 4. Update the user's timezone
      await ctx.db
        .update(users)
        .set({ timezoneOffset: input.timezoneOffset })
        .where(eq(users.id, ctx.session.user.id));

      const [updatedStreak] = await ctx.db
        .select()
        .from(streaks)
        .where(
          and(
            eq(streaks.id, input.id),
            eq(streaks.createdById, ctx.session.user.id),
          ),
        );

      if (!updatedStreak) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Extend: Failed to retrieve updated streak.",
        });
      }

      return { ...updatedStreak, wasReset: isBroken };
    }),

  /**
   * Manually end the current streak and start a new one from today.
   */
  end: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const [streak] = await ctx.db
        .select()
        .from(streaks)
        .where(
          and(
            eq(streaks.id, input.id),
            eq(streaks.createdById, ctx.session.user.id),
          ),
        );

      if (!streak) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "End: Streak not found.",
        });
      }

      const today = new Date();
      const finishedStreakLength = calculateStreakLength(
        streak.currentStartDate,
        streak.currentEndDate,
      );

      const nextStreakNumber =
        Object.keys(streak.pastStreaks as object).length + 1;
      const updatedPastStreaks = {
        ...(streak.pastStreaks as object),
        [nextStreakNumber]: {
          start: streak.currentStartDate.toISOString(),
          end: streak.currentEndDate.toISOString(),
        },
      };

      await ctx.db
        .update(streaks)
        .set({
          currentStartDate: today,
          currentEndDate: today,
          longestStreak: Math.max(streak.longestStreak, finishedStreakLength),
          pastStreaks: updatedPastStreaks,
          updatedAt: new Date(),
        })
        .where(eq(streaks.id, input.id));

      const [updatedStreak] = await ctx.db
        .select()
        .from(streaks)
        .where(
          and(
            eq(streaks.id, input.id),
            eq(streaks.createdById, ctx.session.user.id),
          ),
        );

      if (!updatedStreak) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "End: Failed to retrieve updated streak.",
        });
      }

      return { ...updatedStreak, wasEndedManually: true };
    }),
});
