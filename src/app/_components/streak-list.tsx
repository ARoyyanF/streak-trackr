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
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">Your Streaks</h1>
        <Button onClick={handleAddNewClick}>
          <Plus className="mr-2 h-4 w-4" /> Create Streak
        </Button>
      </header>

      <div className="grid gap-6">
        {streaks?.map((streak) => {
          const currentLength = calculateStreakLength(
            streak.currentStartDate,
            streak.currentEndDate,
          );
          // 6 months is ~182 days
          const progress = Math.min((currentLength / 182) * 100, 100);

          return (
            <Card key={streak.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle
                      className="flex items-center gap-2"
                      style={{ color: streak.color }}
                    >
                      <Flame /> {streak.title}
                    </CardTitle>
                    <CardDescription>{streak.description}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleEditClick(streak)}>
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
              <CardContent>
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Current Streak
                    </p>
                    <p className="text-3xl font-bold">{currentLength} days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-sm">
                      Longest Streak
                    </p>
                    <p className="font-semibold">
                      {currentLength > streak.longestStreak
                        ? currentLength
                        : streak.longestStreak}{" "}
                      days
                    </p>
                  </div>
                </div>
                <Progress value={progress} className="w-full" />
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => extendMutation.mutate({ id: streak.id })}
                >
                  <Calendar className="mr-2 h-4 w-4" /> Extend Streak for Today
                </Button>
              </CardFooter>
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
