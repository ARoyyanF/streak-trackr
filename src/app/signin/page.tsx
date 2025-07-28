import { type Metadata } from "next";
import { SignInForm } from "./signin-form";
import Link from "next/link";
import { ArrowLeft, Sparkles, Target, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In - Streak Trackr",
  description:
    "Sign in to your Streak Trackr account and continue building amazing habits.",
};

export default function SignInPage() {
  return (
    <main className="from-background via-background to-primary/5 bg-gradient-to-br">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/10 absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl" />
        <div className="bg-secondary/10 absolute -bottom-40 -left-40 h-80 w-80 rounded-full blur-3xl" />
      </div>

      <div className="relative flex h-[calc(100vh-5rem)] items-center justify-center p-4">
        {/* Back to home link */}
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground absolute top-6 left-6 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <SignInForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
