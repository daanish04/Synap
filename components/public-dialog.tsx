"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PublicDialog = ({ shareLink }: { shareLink: string | null }) => {
  const [link, setLink] = useState("");

  useEffect(() => {
    if (shareLink) {
      setLink(`${window.location.origin}/brain/${shareLink}`);
    }
  }, [shareLink]);
  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <button className="text-blue-700 cursor-pointer">Public</button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Share link</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Input
              value={link || "https://ui.shadcn.com/docs/installation"}
              readOnly
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(
                link || "https://ui.shadcn.com/docs/installation"
              );
            }}
          >
            Copy link
          </Button>
          <DialogClose asChild>
            <Button
              type="button"
              className="cursor-pointer"
              variant="secondary"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PublicDialog;
