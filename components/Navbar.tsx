import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { checkUser } from "@/lib/checkUser";
import ClerkUserButton from "./ClerkUserButton";
import LogoName from "./LogoName";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = async () => {
  await checkUser();
  return (
    <nav className="bg-background/40 dark:bg-background/80 shadow-md shadow-gray-200 dark:shadow-gray-900/50 flex items-center justify-between sm:px-10 px-5 py-2 sticky top-0 z-50 backdrop-blur-md border-b border-border/40">
      <LogoName />
      <div className="flex flex-row items-center gap-4">
        <ThemeToggle />
        <SignedOut>
          <Link href="/sign-in">
            <Button variant="default">Sign In</Button>
          </Link>
          <div className="hidden sm:block">
            <Link href="/sign-up">
              <Button variant="secondary">Sign Up</Button>
            </Link>
          </div>
        </SignedOut>

        <SignedIn>
          <Link href="/dashboard">
            <Button variant="default">Dashboard</Button>
          </Link>
          <ClerkUserButton />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;
