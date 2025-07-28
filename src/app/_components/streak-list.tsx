// app/_components/streak-list.tsx
"use client";

import { useState } from "react";
import { type RouterOutputs, api } from "~/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  MoreHorizontal,
  Plus,
  Trash2,
  Edit,
  Flame,
  Calendar,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

// Place these helper functions at the top of your file, after the imports.

/**
 * Calculates the contrasting text color (black or white) for a given hex color.
 * @param hex - The hex color string (e.g., "#RRGGBB").
 * @returns "#000000" for light backgrounds, "#FFFFFF" for dark backgrounds.
 */
function getContrastingTextColor(hex: string): string {
  if (!hex) return "#000000";
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

/**
 * Lightens or darkens a color by a given amount.
 * @param hex - The hex color string.
 * @param amount - The amount to lighten (positive) or darken (negative).
 * @returns The new hex color string.
 */
function adjustColor(hex: string, amount: number): string {
  const color = hex.startsWith("#") ? hex.substring(1, 7) : hex;
  const f = parseInt(color, 16);
  const t = amount < 0 ? 0 : 255;
  const p = amount < 0 ? amount * -1 : amount;
  const R = f >> 16;
  const G = (f >> 8) & 0x00ff;
  const B = f & 0x0000ff;
  return (
    "#" +
    (
      0x1000000 +
      (Math.round((t - R) * (p / 100)) + R) * 0x10000 +
      (Math.round((t - G) * (p / 100)) + G) * 0x100 +
      (Math.round((t - B) * (p / 100)) + B)
    )
      .toString(16)
      .slice(1)
  );
}

type Streak = RouterOutputs["streak"]["getStreaks"][number];

// Helper to calculate streak length
function calculateStreakLength(startDate: Date, endDate: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  const start = new Date(startDate.toDateString());
  const end = new Date(endDate.toDateString());
  const diffDays = Math.round(
    Math.abs((end.getTime() - start.getTime()) / oneDay),
  );
  return diffDays + 1;
}

// Form validation schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color."),
});

export function StreakList({ initialStreaks }: { initialStreaks: Streak[] }) {
  const utils = api.useUtils();

  const { data: streaks } = api.streak.getStreaks.useQuery(undefined, {
    initialData: initialStreaks,
    refetchOnWindowFocus: false,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStreak, setEditingStreak] = useState<Streak | null>(null);

  const createMutation = api.streak.create.useMutation({
    onSuccess: () => utils.streak.getStreaks.invalidate(),
  });
  const deleteMutation = api.streak.delete.useMutation({
    onSuccess: () => utils.streak.getStreaks.invalidate(),
  });
  const updateMutation = api.streak.update.useMutation({
    onSuccess: () => utils.streak.getStreaks.invalidate(),
  });
  const extendMutation = api.streak.extend.useMutation({
    onSuccess: () => utils.streak.getStreaks.invalidate(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      color: "#ffffff",
    },
  });

  const handleEditClick = (streak: Streak) => {
    setEditingStreak(streak);
    form.reset({
      title: streak.title ?? "",
      description: streak.description ?? "",
      color: streak.color,
    });
    setIsDialogOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingStreak(null);
    form.reset({ title: "", description: "", color: "#ffffff" });
    setIsDialogOpen(true);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingStreak) {
      updateMutation.mutate({ id: editingStreak.id, ...values });
    } else {
      createMutation.mutate(values);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-6 md:p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">Your Streaks</h1>
        <Button onClick={handleAddNewClick}>
          <Plus className="mr-2 h-4 w-4" /> Create Streak
        </Button>
      </header>

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {streaks?.map((streak) => {
          const currentLength = calculateStreakLength(
            streak.currentStartDate,
            streak.currentEndDate,
          );
          // 6 months is ~182 days
          const progress = Math.min((currentLength / 182) * 100, 100);

          // --- Dynamic Style Calculation ---
          const baseColor = streak.color;
          const textColor = getContrastingTextColor(baseColor);
          const layer1Color = adjustColor(baseColor, -10); // Darker shade for bottom layer
          const layer2Color = adjustColor(baseColor, 10); // Lighter shade for middle layer
          const subtleTextColor =
            textColor === "#FFFFFF"
              ? "rgba(255,255,255,0.7)"
              : "rgba(0,0,0,0.6)";
          const flameColor =
            textColor === "#FFFFFF"
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.05)";

          return (
            <Card
              key={streak.id}
              className="relative flex transform-gpu flex-col overflow-hidden rounded-2xl border-none shadow-lg transition-transform hover:scale-[1.02]"
              style={{
                backgroundColor: layer1Color,
                backgroundImage: `
                  radial-gradient(circle at 100% 0%, ${layer2Color} 0%, transparent 40%),
                  radial-gradient(circle at 0% 100%, ${baseColor} 0%, transparent 40%)
                `,
                color: textColor,
              }}
            >
              <Flame
                size={200}
                className="absolute -right-12 -bottom-12 z-0"
                style={{ color: flameColor }}
              />

              <div className="relative z-10 flex h-full flex-col p-6">
                <CardHeader className="p-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold">
                        {streak.title}
                      </CardTitle>
                      {streak.description && (
                        <CardDescription
                          className="mt-1"
                          style={{ color: subtleTextColor }}
                        >
                          {streak.description}
                        </CardDescription>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="options-button h-8 w-8 shrink-0 rounded-full"
                          style={{
                            color: textColor,
                            // @ts-expect-error custom property
                            "--hover-bg": subtleTextColor,
                          }}
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => handleEditClick(streak)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your streak.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  deleteMutation.mutate({ id: streak.id })
                                }
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="flex-grow p-0 pt-6">
                  <div className="mb-4 flex items-end justify-between">
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: subtleTextColor }}
                      >
                        Current
                      </p>
                      <p className="text-5xl leading-none font-bold">
                        {currentLength}
                        <span className="text-3xl font-medium">d</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-sm font-medium"
                        style={{ color: subtleTextColor }}
                      >
                        Longest
                      </p>
                      <p className="text-xl font-semibold">
                        {Math.max(currentLength, streak.longestStreak)}d
                      </p>
                    </div>
                  </div>
                  <Progress
                    value={progress}
                    className="progress-bar h-2 w-full"
                    style={
                      // @ts-expect-error custom property
                      {
                        "--progress-bg": subtleTextColor,
                        "--progress-indicator": textColor,
                      }
                    }
                  />
                  <p
                    className="mt-3 text-center text-xs"
                    style={{ color: subtleTextColor }}
                  >
                    On a streak since{" "}
                    {new Date(streak.currentStartDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </CardContent>

                <CardFooter className="mt-auto p-0 pt-6">
                  <Button
                    className="w-full rounded-lg py-6 text-base font-semibold"
                    onClick={() => extendMutation.mutate({ id: streak.id })}
                    style={{
                      backgroundColor: textColor,
                      color: baseColor,
                    }}
                  >
                    <Calendar className="mr-2 h-5 w-5" /> Extend Streak
                  </Button>
                </CardFooter>
              </div>
            </Card>
          );
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingStreak ? "Edit Streak" : "Create New Streak"}
            </DialogTitle>
            <DialogDescription>
              {editingStreak
                ? "Update the details of your streak."
                : "Start a new habit by creating a streak."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Daily Workout" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 30 minutes of cardio"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input
                          type="color"
                          className="h-10 w-14 p-1"
                          {...field}
                        />
                      </FormControl>
                      <Input
                        value={field.value}
                        onChange={field.onChange}
                        className="w-auto"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
