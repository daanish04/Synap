import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";
import React from "react";
import Link from "next/link";
import { BrainCircuit, LoaderCircle } from "lucide-react";
import Image from "next/image";

const SignInPage = () => {
  return (
    <>
      <ClerkLoading>
        <div className="flex w-screen h-screen justify-center items-center">
          <LoaderCircle className="animate-spin h-10 w-10 text-purple-700" />
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-blue-50 to-slate-100 p-3">
          <div className="w-full max-w-5xl border-b-2 border-slate-200/60 rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            {/* Left: illustration with background image */}
            <div className="hidden lg:flex flex-col items-center justify-start gap-6 p-12 relative overflow-hidden">
              <div className=" w-full flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <BrainCircuit
                    className="text-purple-700 h-10 w-10 rotate-90"
                    strokeWidth={2}
                  />
                  <div className="text-4xl font-bold">Synap</div>
                </div>

                <h2 className="text-3xl font-bold text-slate-900 mt-10">
                  Welcome back - pick up where you left off!
                </h2>
                <Image
                  src="/Knowledge-network.png"
                  alt="Knowledge Network Illustration"
                  width={400}
                  height={300}
                  className="mt-5"
                />
                <p className="text-slate-600 font-semibold py-5">
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
                  <div className="lg:hidden flex items-center gap-3">
                    <BrainCircuit
                      className="text-purple-700 h-10 w-10 rotate-90"
                      strokeWidth={2}
                    />
                    <div className="text-4xl font-bold">Synap</div>
                  </div>
                </div>

                {/* <div className="bg-slate-50 border border-slate-100 rounded-xl p-6"> */}
                {/* Clerk SignIn component keeps full functionality; Tailwind wrapper provides consistent visual styling */}
                <SignIn />
                {/* </div> */}
                <div className="mt-4 text-center">
                  <Link
                    href="/"
                    className="text-sm font-semibold text-slate-500 hover:text-slate-700"
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
