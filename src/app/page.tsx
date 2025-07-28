// app/page.tsx
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { StreakList } from "~/app/_components/streak-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  // If there's no session, show a sign-in prompt
  if (!session?.user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Welcome to Streak Trackr</CardTitle>
            <CardDescription>
              Sign in to start building amazing habits.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/api/auth/signin">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  // If there is a session, prefetch and render the streaks
  const initialStreaks = await api.streak.getStreaks();

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
            Life&apos;s a marathon, not a sprint! I&apos;ve built in a 3-day
            cushion, so if you miss a day, your streak is safe. It will only
            break after three consecutive days of inactivity. Stay consistent,
            but don&apos;t stress the small bumps!
          </p>
        </div>
      </footer>
    </HydrateClient>
  );
}
