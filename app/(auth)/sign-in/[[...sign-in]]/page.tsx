"use client";

import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";
import React from "react";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import LogoName from "@/components/LogoName";
import { useTheme } from "next-themes";

import { shadesOfPurple } from "@clerk/themes";

const SignInPage = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex w-screen h-screen justify-center items-center">
        <LoaderCircle className="animate-spin h-10 w-10 text-purple-700" />
      </div>
    );
  }

  return (
    <>
      <ClerkLoading>
        <div className="flex w-screen h-screen justify-center items-center">
          <LoaderCircle className="animate-spin h-10 w-10 text-purple-700" />
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-blue-50/50 dark:via-purple-900/40 dark:via-blue-900/30 to-violet-50/50 dark:to-indigo-900/40 dark:to-purple-800/30 p-3">
          <div className="w-full max-w-5xl border-b-2 border-border rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            {/* Left: illustration with background image */}
            <div className="hidden lg:flex flex-col items-center justify-start gap-6 p-12 relative overflow-hidden">
              <div className=" w-full flex flex-col gap-3">
                <LogoName />

                <h2 className="text-3xl font-bold text-foreground mt-10">
                  Welcome back - pick up where you left off!
                </h2>
                <Image
                  src="/Knowledge-network.png"
                  alt="Knowledge Network Illustration"
                  width={400}
                  height={300}
                  className="mt-5"
                />
                <p className="text-muted-foreground font-semibold py-5">
                  Sign in to continue reviewing your collections, save new
                  discoveries, and sync progress across devices. Your library
                  waits exactly where you left it.
                </p>
              </div>
            </div>

            {/* Right: Clerk SignIn form */}
            <div className="relative flex items-center justify-center p-2 lg:p-10">
              <div className="w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                  <div className="lg:hidden block">
                    <LogoName />
                  </div>
                </div>

                {/* <div className="bg-slate-50 border border-slate-100 rounded-xl p-6"> */}
                <SignIn
                  appearance={{
                    theme: theme === "dark" ? shadesOfPurple : undefined,
                  }}
                />
                {/* </div> */}
                <div className="mt-4 text-center">
                  <Link
                    href="/"
                    className="text-sm font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Back to home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ClerkLoaded>
    </>
  );
};

export default SignInPage;
