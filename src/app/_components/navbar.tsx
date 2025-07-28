"use client";

import { Menu } from "lucide-react";
import type { Session } from "next-auth";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import Image from "next/image";

// 1. Import necessary hooks
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export function Navbar({ session }: { session: Session | null }) {
  const navLinks = [
    { href: "/why", label: "Why?" },
    { href: "/history", label: "Streak History" },
  ];

  const title = "Streak Tracker";

  // 2. Get theme and mounted state
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  // useEffect only runs on the client, so we can safely set the mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-background/70 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex w-full items-center justify-center self-center px-4 backdrop-blur sm:px-8 md:px-20">
      <div className="container flex h-20 items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-16 w-16 items-center justify-center">
              {/* 3. Conditionally render the logo based on the resolved theme */}
              {mounted && (
                <>
                  {resolvedTheme === "dark" ? (
                    <Image
                      src="/logo-dark.webp"
                      alt="logo"
                      width={128}
                      height={128}
                    />
                  ) : (
                    <Image
                      src="/logo-light.webp"
                      alt="logo"
                      width={128}
                      height={128}
                    />
                  )}
                </>
              )}
            </div>
            <span className="font-bold max-lg:hidden">{title}</span>
          </Link>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <nav className="items-center space-x-6 text-sm font-medium max-lg:hidden">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Theme Toggle, User, and Mobile Menu */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* User Info */}
          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                <span className="hidden text-sm font-medium md:block">
                  {session.user.name}
                </span>
                <a href={session.user.image ?? ""}>
                  <img
                    src={session.user.image ?? ""}
                    alt="User avatar"
                    className="h-8 w-8 rounded-full"
                  />
                </a>
                <Link href="/api/auth/signout">
                  <Button variant="outline">Sign Out</Button>
                </Link>
              </div>
            ) : (
              <Link href="/api/auth/signin">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            {/* ... mobile menu code remains the same */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="flex flex-col gap-6 overflow-scroll p-6 text-lg font-medium"
              >
                <SheetTitle>
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-lg font-semibold"
                  >
                    <span className="font-bold">{title}</span>
                  </Link>
                </SheetTitle>
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
