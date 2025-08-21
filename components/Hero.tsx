import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <div className="pt-10 flex flex-col items-center justify-center text-center h-[calc(100vh-4rem)]">
      <div className="flex flex-col items-center text-center gap-4">
        <h2 className="md:text-5xl text-3xl font-bold text-blue-700">
          Capture. Organize. Share.
        </h2>
        <h2 className="md:text-5xl text-3xl font-semibold text-blue-700">
          Turn Your Knowledge Into a Living Brain.
        </h2>
        <p className="md:text-xl text-base text-gray-500 font-light">
          Save articles, notes, and ideas as smart cards. Organize them into
          collections, tag them, and share your knowledge with the world.
        </p>
      </div>
      <div className="flex flex-row items-center justify-center gap-6 mt-8">
        <SignedIn>
          <Link href="/dashboard">
            <Button variant="default" size="lg">
              Get Started
            </Button>
          </Link>
        </SignedIn>
        <SignedOut>
          <Link href="/sign-in">
            <Button variant="default" size="lg">
              Get Started
            </Button>
          </Link>
        </SignedOut>
        <a
          href="https://youtu.be/xvFZjo5PgG0?si=WBHQp8lgMCCPNhTI"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="secondary" size="lg">
            Learn More
          </Button>
        </a>
      </div>
    </div>
  );
};

export default Hero;
