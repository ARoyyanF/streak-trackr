import { type Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import {
  CheckCircle,
  Target,
  TrendingUp,
  Calendar,
  Zap,
  Users,
  BrainCircuit,
  Award,
} from "lucide-react";

export const metadata: Metadata = {
  title: "The Science of Consistency: How Small Habits Create Big Change",
  description:
    "An exploration of the science-backed principles from 'Atomic Habits', 'The Power of Habit', and 'The Compound Effect' that explain how tracking streaks leads to lasting personal growth. A free tool to help you apply these ideas.",
};

// A small component for citing sources, adding a touch of academic credibility.
const Citation = ({ children }: { children: React.ReactNode }) => (
  <p className="text-muted-foreground mt-3 text-xs italic">{children}</p>
);

export default function WhyPage() {
  return (
    <main className="container mx-auto max-w-5xl px-4 py-12">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="gradient-text mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Why Your Smallest Actions Matter Most
        </h1>
        <p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-lg md:text-xl">
          As Darren Hardy explains in "The Compound Effect," your life is the
          sum of your choices. Small, seemingly insignificant actions, when
          performed consistently, create a ripple effect that leads to massive
          change. I've built a simple, free tool to help you apply these ideas
          in your own life.
        </p>
      </section>

      {/* The Core Principles Section */}
      <section className="mb-20">
        <h2 className="mb-10 text-center text-3xl font-bold">
          The Science of Consistent Action
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: The Habit Loop */}
          <Card className="flex flex-col">
            <CardHeader>
              <BrainCircuit className="text-primary mb-3 h-10 w-10" />
              <CardTitle>The Habit Loop</CardTitle>
              <CardDescription>Cue, Routine, Reward</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">
                Charles Duhigg's "The Power of Habit" reveals that over 40% of
                our daily actions are habits. Tracking a streak creates a
                powerful "Cue" (seeing the tracker), which initiates the
                "Routine" (your desired action), and delivers a "Reward" (the
                satisfaction of marking it complete).
              </p>
              <Citation>
                Source: Duhigg, C. (2012). The Power of Habit.
              </Citation>
            </CardContent>
          </Card>

          {/* Card 2: The 1% Rule */}
          <Card className="flex flex-col">
            <CardHeader>
              <TrendingUp className="text-primary mb-3 h-10 w-10" />
              <CardTitle>The 1% Rule</CardTitle>
              <CardDescription>Small Gains, Giant Leaps</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">
                James Clear's "Atomic Habits" popularizes the idea that getting
                1% better each day leads to being 37 times better in a year. A
                streak visualizes this compounding growth, turning tiny efforts
                into remarkable achievements.
              </p>
              <Citation>Source: Clear, J. (2018). Atomic Habits.</Citation>
            </CardContent>
          </Card>

          {/* Card 3: Identity-Based Habits */}
          <Card className="flex flex-col">
            <CardHeader>
              <Users className="text-primary mb-3 h-10 w-10" />
              <CardTitle>Identity-Based Habits</CardTitle>
              <CardDescription>
                Become the Person You Want to Be
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">
                True behavior change is identity change. Each time you complete
                your streak, you cast a vote for your new identity. You're not
                just reading a book; you're becoming a reader. This is the core
                of sustainable change.
              </p>
              <Citation>
                "Every action you take is a vote for the type of person you wish
                to become." - James Clear
              </Citation>
            </CardContent>
          </Card>

          {/* Card 4: Eat That Frog */}
          <Card className="flex flex-col">
            <CardHeader>
              <Target className="text-primary mb-3 h-10 w-10" />
              <CardTitle>Eat That Frog</CardTitle>
              <CardDescription>Tackle Your Most Important Task</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">
                Brian Tracy's "Eat That Frog!" urges you to tackle your most
                challenging task first. Use a streak to build consistency on
                that one habit that will have the greatest positive impact on
                your life and create massive momentum.
              </p>
              <Citation>Source: Tracy, B. (2001). Eat That Frog!</Citation>
            </CardContent>
          </Card>

          {/* Card 5: The Science of Automaticity */}
          <Card className="flex flex-col">
            <CardHeader>
              <Zap className="text-primary mb-3 h-10 w-10" />
              <CardTitle>Achieving Automaticity</CardTitle>
              <CardDescription>From Effort to Instinct</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">
                A study in the European Journal of Social Psychology found it
                takes an average of 66 days for a new behavior to become
                automatic. A visual streak provides the feedback and motivation
                needed to bridge this critical gap.
              </p>
              <Citation>
                Source: Lally, P., et al. (2010). How are habits formed.
              </Citation>
            </CardContent>
          </Card>

          {/* Card 6: Visual Progress and Dopamine */}
          <Card className="flex flex-col">
            <CardHeader>
              <Calendar className="text-primary mb-3 h-10 w-10" />
              <CardTitle>Visual Progress & Motivation</CardTitle>
              <CardDescription>The Brain's Reward System</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">
                Seeing an unbroken chain of successes provides immediate,
                tangible feedback. This visual proof of progress can trigger a
                dopamine release, creating a positive feedback loop that makes
                you want to continue the behavior.
              </p>
              <Citation>
                This aligns with the principle of making habits "satisfying"
                from "Atomic Habits".
              </Citation>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Streak Trackr Section -> Reframed as "Putting Knowledge into Action" */}
      <section className="mb-20">
        <Card className="border-primary/20 bg-slate-50 dark:bg-slate-900">
          <CardHeader className="text-center">
            <Award className="mx-auto h-12 w-12 text-amber-500" />
            <CardTitle className="mt-4 text-3xl font-bold">
              From Theory to Practice
            </CardTitle>
            <CardDescription className="text-md mx-auto max-w-2xl">
              Understanding these ideas is the first step. A simple tool can
              help you put them into practice.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="flex items-center gap-2 font-semibold">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Making It Obvious & Easy
              </h4>
              <p className="text-muted-foreground text-sm">
                A core tenet of "Atomic Habits" is to reduce friction. A
                minimalist tracker serves as a clear 'cue' without being a
                distraction, making it easy to record your progress.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="flex items-center gap-2 font-semibold">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Making It Satisfying
              </h4>
              <p className="text-muted-foreground text-sm">
                Marking a task as 'done' provides immediate satisfaction. This
                reinforces the habit loop and builds the momentum described in
                "The Compound Effect."
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="flex items-center gap-2 font-semibold">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Casting Votes For Your Identity
              </h4>
              <p className="text-muted-foreground text-sm">
                A streak tracker is a visual record of the votes you're casting
                for your desired identity. It's tangible proof that you are
                becoming the person you aim to be.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="flex items-center gap-2 font-semibold">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Providing Honest Feedback
              </h4>
              <p className="text-muted-foreground text-sm">
                The data doesn't have an opinion. It provides a clear, honest
                mirror of your consistency, which is the foundation of
                self-awareness and growth. You can't improve what you don't
                measure.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <Card className="from-primary/10 to-secondary/10 border-primary/20 bg-gradient-to-r p-8">
          <CardHeader className="p-0">
            <CardTitle className="text-3xl font-bold">
              Your Future Self is Forged in Your Daily Habits
            </CardTitle>
            <CardDescription className="mt-2 text-lg">
              The best time to plant a tree was 20 years ago. The second best
              time is now.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-6 p-0">
            <p className="text-muted-foreground mb-6">
              Start building the small, consistent habits that will lead to an
              extraordinary life. This tool is free and here to help.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" className="shadow-lg">
                <Link href="/">Start Your First Streak</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
