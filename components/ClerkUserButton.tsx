"use client";

import { UserButton } from "@clerk/nextjs";
// import { User } from "lucide-react";
import React from "react";
import { shadesOfPurple } from "@clerk/themes";
import { useTheme } from "next-themes";

const ClerkUserButton = () => {
  const { theme } = useTheme();
  return (
    <UserButton
      appearance={{
        theme: theme === "dark" ? shadesOfPurple : undefined,
      }}
      userProfileMode="navigation"
      userProfileUrl="/profile"
    >
      {/* <UserButton.MenuItems>
        <UserButton.Link
          label="Visit Profile"
          labelIcon={<User className="h-4 w-4" strokeWidth={2.5} />}
          href="/profile"
        />
      </UserButton.MenuItems> */}
    </UserButton>
  );
};

export default ClerkUserButton;
