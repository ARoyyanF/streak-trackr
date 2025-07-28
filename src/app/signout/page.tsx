import { type Metadata } from "next";
import { Suspense } from "react";
import { SignOutForm } from "./signout-form";
import Link from "next/link";
import { ArrowLeft, Heart, Trophy, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign Out - Streak Trackr",
  description: "Sign out of your Streak Trackr account safely.",
};

export default function SignOutPage() {
  return (
    <main className="from-background via-background to-destructive/5 bg-gradient-to-br">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-destructive/10 absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />
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
              <SignOutForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
