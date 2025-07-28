"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Loader2, LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function SignOutForm() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ callbackUrl });
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-background/80 border-destructive/20 w-full shadow-xl backdrop-blur-sm">
      <CardHeader className="space-y-2 text-center">
        <div className="bg-destructive/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <LogOut className="text-destructive h-8 w-8" />
        </div>
        <CardTitle className="text-2xl font-bold">Sign Out</CardTitle>
        <CardDescription>
          Are you sure you want to sign out of your account?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3 text-center">
          <p className="text-muted-foreground text-xs">
            You can sign back in anytime to continue building amazing habits.
          </p>
        </div>

        <Separator />

        <div className="space-y-3">
          <Button
            onClick={handleSignOut}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground h-12 w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing out...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-5 w-5" />
                Yes, Sign Me Out
              </>
            )}
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-primary/30 hover:bg-primary/5 h-12 w-full"
            size="lg"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-5 w-5" />
              No, Keep Me Signed In
            </Link>
          </Button>
        </div>

        <Separator />

        <div className="space-y-2 text-center">
          <p className="text-muted-foreground text-xs">
            Need help? Check out our{" "}
            <Link href="/why" className="text-primary hover:underline">
              guide on building habits
            </Link>{" "}
            or{" "}
            <Link href="/history" className="text-primary hover:underline">
              review your progress
            </Link>
            .
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
