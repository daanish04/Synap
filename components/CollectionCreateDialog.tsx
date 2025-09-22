"use client";

import React, { useEffect, useState, useTransition } from "react";
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
  id?: string;
  data?: { title: string; isPublic: boolean };
};

const CollectionCreateDialog = ({ create, id, data }: Props) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setIsPublic(data.isPublic);
    }
  }, [data]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          {id ? "Edit" : "Create"} Collection
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? "Edit" : "Create"} Collection</DialogTitle>
        </DialogHeader>
        <form
          action={(formData: FormData) => {
            formData.set("isPublic", isPublic ? "true" : "false");
            if (id) formData.set("id", id);
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <span>Public</span>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>
          <Button disabled={isPending} type="submit" className="cursor-pointer">
            {isPending ? (id ? "Updating..." : "Creating...") : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionCreateDialog;
