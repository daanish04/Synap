"use client";

import React, { useState } from "react";
import { ContentItem } from "@/lib/types";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { updateContent } from "@/actions/contentActions";

const EditContentDialog = ({ content }: { content: ContentItem }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const response = await updateContent(formData);
    setLoading(false);
    if (!response?.success)
      return toast.error(response?.error || "Failed to update");
    form.reset();
    setOpen(false);
    toast.success("Content updated successfully");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer" variant="secondary">
          Edit Content
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Content</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="grid gap-3">
          <input type="hidden" name="id" value={content.id} />
          <Input
            name="title"
            placeholder="Title"
            defaultValue={content.title}
            required
            autoSave="off"
          />
          <Textarea
            name="description"
            placeholder="Description"
            defaultValue={content.description || ""}
            className="max-h-60"
          />
          <Input
            name="link"
            placeholder="Link (optional)"
            defaultValue={content.link || ""}
            autoSave="off"
          />
          <Input
            name="tags"
            placeholder="Tags (comma separated)"
            defaultValue={
              content.tags?.map((t) => t.tag.title).join(", ") || ""
            }
            autoSave="off"
          />

          <Button className="cursor-pointer" disabled={loading} type="submit">
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditContentDialog;
