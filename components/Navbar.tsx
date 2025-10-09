import { SignedIn, SignedOut } from "@clerk/nextjs";
import { BrainCircuit } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { checkUser } from "@/lib/checkUser";
import ClerkUserButton from "./ClerkUserButton";

const Navbar = async () => {
  await checkUser();
  return (
    <nav className="bg-white/40 shadow-md shadow-gray-200 flex items-center justify-between px-10 py-2 sticky top-0 z-50 backdrop-blur-md">
      <div className="flex flex-row items-center gap-3">
        <BrainCircuit
          className="text-purple-700 h-8 w-8 rotate-90"
          strokeWidth={2}
        />
        <h1 className="text-2xl font-bold text-blue-500">Synap</h1>
      </div>
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
