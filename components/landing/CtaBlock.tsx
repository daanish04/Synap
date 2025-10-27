import React from "react";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

const CtaBlock = () => {
  return (
    <section className="py-10 mt-12 bg-blue-50">
      <div className="container mx-auto flex flex-col items-center px-5">
        <h2 className="text-3xl font-bold text-center text-slate-700 mb-5">
          Ready to Build Your Brain?
        </h2>
        <p className="mb-3 md:mb-4 text-gray-600 max-w-2xl text-center leading-relaxed">
          Start saving what matters. Turn scattered tabs and notes into a
          searchable knowledge system.
        </p>
        <div className="flex flex-col items-center justify-center gap-6">
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="default" size="lg">
                Start Free
              </Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in">
              <Button variant="default" size="lg">
                Start Free
              </Button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </section>
  );
};

export default CtaBlock;
