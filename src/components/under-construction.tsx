// app/page.tsx

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export default async function UnderConstruction() {
  // If there's no session, show a sign-in prompt

  return (
    <main className="flex h-[calc(100vh-5rem)] items-center justify-center">
      <Card className="flex w-[350px]">
        <CardHeader>
          <CardTitle>Under Construction</CardTitle>
          <CardDescription>
            This page is currently under construction. Please check back later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/">Home</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
