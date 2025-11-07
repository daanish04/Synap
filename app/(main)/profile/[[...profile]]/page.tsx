"use client";

import { Button } from "@/components/ui/button";
import {
  ClerkLoaded,
  ClerkLoading,
  SignOutButton,
  UserProfile,
} from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";
import { LoaderCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React from "react";

const ProfilePage = () => {
  const { theme } = useTheme();
  const router = useRouter();
  return (
    <>
      <ClerkLoading>
        <div className="flex w-screen h-screen justify-center items-center">
          <LoaderCircle className="animate-spin h-10 w-10 text-purple-700" />
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <div className=" min-h-screen flex items-center justify-center">
          <div className="relative z-10">
            <UserProfile
              appearance={{
                theme: theme === "dark" ? shadesOfPurple : undefined,
              }}
            />
            <div className="absolute lg:top-5 top-2 right-5 z-30">
              <SignOutButton>
                <Button
                  variant="destructive"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => router.push("/")}
                >
                  Sign Out
                </Button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </ClerkLoaded>
    </>
  );
};

export default ProfilePage;
