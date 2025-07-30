// app/page.tsx
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { StreakList } from "~/app/_components/streak-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Sparkles, Target, TrendingUp } from "lucide-react";

export default async function Home() {
  const session = await auth();

  // If there's no session, show the new sign-in prompt
  if (!session?.user) {
    return (
      <main className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center p-4 lg:flex-row lg:gap-12">
        {/* Left side content - visible on large screens */}
        <div className="hidden lg:block lg:w-1/2 lg:max-w-lg">
          <div className="space-y-8">
            <div>
              <h1 className="mb-4 text-4xl font-bold">
                Welcome to <span className="text-primary">Streak Trackr</span>
              </h1>
              <p className="text-muted-foreground text-xl">
                Transform your life through the power of consistent habits
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                  <Target className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Build Momentum</h3>
                  <p className="text-muted-foreground">
                    Every day you maintain your streak builds psychological
                    momentum, making it easier to continue tomorrow.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                  <TrendingUp className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Compound Growth</h3>
                  <p className="text-muted-foreground">
                    Small daily improvements compound over time into
                    extraordinary results. See the magic of 1% better every day.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                  <Sparkles className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Visual Progress</h3>
                  <p className="text-muted-foreground">
                    Track your journey with beautiful visualizations that
                    celebrate your consistency and motivate continued growth.
                  </p>
                </div>
              </div>
            </div>

            <div className="from-primary/10 to-secondary/10 border-primary/20 rounded-lg border bg-gradient-to-r p-6">
              <p className="text-muted-foreground text-sm">
                &ldquo;The secret to getting ahead is getting started. The
                secret to getting started is breaking your complex overwhelming
                tasks into small manageable tasks, and starting on the first
                one.&rdquo;
              </p>
              <p className="mt-2 text-sm font-medium">— Mark Twain</p>
            </div>
          </div>
        </div>

        {/* Right side content - Sign-in card */}
        <Card className="w-full max-w-md lg:w-1/2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              Understanding the Engine of Personal Growth
            </CardTitle>
            <CardDescription>
              Sign in to put these powerful ideas into practice.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6 text-center">
              Lasting change begins with understanding the hidden engine that
              drives our behavior: our habits.{" "}
              <Link href="/why" className="hover:text-primary underline">
                Here
              </Link>
              , we explore the foundational ideas that explain how consistency
              transforms us over time. Discover the principles, this free tool
              is made to help you see them work.
            </p>
            <Button asChild className="w-full">
              <Link href="/api/auth/signin">Sign In to Start Your Journey</Link>
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center text-sm">
            <p className="text-muted-foreground">
              Curious about the science?{" "}
              <Link href="/why" className="hover:text-primary underline">
                Learn why it works.
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    );
  }

  // get the initial streaks for the user
  // This will be used to render the streak list on the client side
  const initialStreaks = await api.streak.getStreaks();

  // Prefetch the client date/time for the user
  // This ensures the server has the client's date/time ready for rendering
  void api.streak.getClientDateTime.prefetch();

  return (
    <HydrateClient>
      <main>
        <StreakList initialStreaks={initialStreaks} />
      </main>
      <footer className="bg-background border-t py-8">
        <div className="text-muted-foreground container mx-auto max-w-5xl px-4 text-center text-sm">
          <p className="font-semibold">
            A quick note on keeping your streaks alive:
          </p>
          <p className="mt-2">
            Life's a marathon, not a sprint! We've built in a 3-day cushion, so
            if you miss a day, your streak is safe. It will only break after
            three consecutive days of inactivity. Stay consistent, but don't
            stress the small bumps!
          </p>
          <div className="mt-6 flex justify-center">
            <a
              href="https://github.com/ARoyyanF/streak-trackr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="sr-only">GitHub</span>
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 fill-current"
              >
                <title>GitHub</title>
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </HydrateClient>
  );
}
