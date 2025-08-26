"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type Props = {
  create: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
};

const CollectionCreateDialog = ({ create }: Props) => {
  const [open, setOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">Create Collection</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Collection</DialogTitle>
        </DialogHeader>
        <form
          action={(formData: FormData) => {
            formData.set("isPublic", isPublic ? "true" : "false");
            startTransition(async () => {
              const res = await create(formData);
              if (res?.error) {
                toast(res.error);
                return;
              }
              setOpen(false);
            });
          }}
          className="grid gap-3"
        >
          <Input
            name="title"
            placeholder="Collection name"
            required
            autoSave="off"
          />
          <div className="flex items-center justify-between">
            <span>Public</span>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>
          <Button disabled={isPending} type="submit" className="cursor-pointer">
            {isPending ? "Creating..." : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionCreateDialog;
