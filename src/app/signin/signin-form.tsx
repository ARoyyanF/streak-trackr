"use client";

import { signIn, getProviders } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface Provider {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

export function SignInForm() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    void fetchProviders();
  }, []);

  const handleSignIn = async (providerId: string) => {
    setIsLoading(providerId);
    try {
      await signIn(providerId, { callbackUrl });
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(null);
    }
  };

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case "google":
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        );
      case "github":
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="bg-background/80 border-primary/20 w-full shadow-xl backdrop-blur-sm">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to continue your streak journey
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="text-destructive bg-destructive/10 border-destructive/20 rounded-md border p-3 text-sm">
            {error === "OAuthSignin" &&
              "Error occurred during sign in. Please try again."}
            {error === "OAuthCallback" &&
              "Error occurred during authentication. Please try again."}
            {error === "OAuthCreateAccount" &&
              "Could not create account. Please try again."}
            {error === "EmailCreateAccount" &&
              "Could not create account. Please try again."}
            {error === "Callback" && "Authentication error. Please try again."}
            {error === "OAuthAccountNotLinked" &&
              "Account already exists with different provider. Please use your original sign-in method."}
            {error === "EmailSignin" &&
              "Check your email for the sign-in link."}
            {error === "CredentialsSignin" &&
              "Invalid credentials. Please check your information."}
            {error === "SessionRequired" &&
              "Please sign in to access this page."}
            {![
              "OAuthSignin",
              "OAuthCallback",
              "OAuthCreateAccount",
              "EmailCreateAccount",
              "Callback",
              "OAuthAccountNotLinked",
              "EmailSignin",
              "CredentialsSignin",
              "SessionRequired",
            ].includes(error) && "An error occurred. Please try again."}
          </div>
        )}

        <div className="space-y-3">
          {providers &&
            Object.values(providers).map((provider) => {
              if (provider.id === "credentials") return null;

              return (
                <Button
                  key={provider.name}
                  variant="outline"
                  className="hover:bg-primary/5 hover:border-primary/30 h-12 w-full justify-start gap-3 text-left transition-all duration-200"
                  onClick={() => handleSignIn(provider.id)}
                  disabled={isLoading === provider.id}
                >
                  {isLoading === provider.id ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    getProviderIcon(provider.id)
                  )}
                  <span className="flex-1">
                    {isLoading === provider.id
                      ? `Signing in with ${provider.name}...`
                      : `Continue with ${provider.name}`}
                  </span>
                </Button>
              );
            })}
        </div>

        {!providers && (
          <div className="space-y-3">
            <div className="bg-muted/50 h-12 animate-pulse rounded-md" />
            <div className="bg-muted/50 h-12 animate-pulse rounded-md" />
          </div>
        )}

        <Separator className="my-6" />

        <div className="space-y-2 text-center">
          <p className="text-muted-foreground text-sm">
            By signing in, you agree to our terms of service and privacy policy.
          </p>
          <p className="text-muted-foreground text-xs">
            Your data is secure and we never share it with third parties.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
