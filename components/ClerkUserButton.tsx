"use client";

import { UserButton } from "@clerk/nextjs";
import { User } from "lucide-react";
import React from "react";

const ClerkUserButton = () => {
  return (
    <UserButton>
      <UserButton.MenuItems>
        <UserButton.Link
          label="Visit Profile"
          labelIcon={<User className="h-4 w-4" strokeWidth={2.5} />}
          href="/profile"
        />
      </UserButton.MenuItems>
    </UserButton>
  );
};

export default ClerkUserButton;
