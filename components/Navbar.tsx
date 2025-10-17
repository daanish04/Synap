import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { checkUser } from "@/lib/checkUser";
import ClerkUserButton from "./ClerkUserButton";
import LogoName from "./LogoName";

const Navbar = async () => {
  await checkUser();
  return (
    <nav className="bg-white/40 shadow-md shadow-gray-200 flex items-center justify-between px-10 py-2 sticky top-0 z-50 backdrop-blur-md">
      <LogoName />
      <div className="flex flex-row items-center gap-4">
        <SignedOut>
          <Link href="/sign-in">
            <Button variant="default">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="secondary">Sign Up</Button>
          </Link>
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
