"use client";

import React from "react";
import { ContentItem } from "@/lib/types";
import { Button } from "../ui/button";
import { ExternalLink, Heart, Pin, PinOff, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";
import { toast } from "sonner";
import {
  deleteContent,
  toggleFavorite,
  togglePin,
} from "@/actions/contentActions";
import { useRouter } from "next/navigation";

const ContentActions = ({ content }: { content: ContentItem }) => {
  const router = useRouter();

  const handleToggleFavorite = async () => {
    const wasLiked = content.isFav;
    content.isFav = !content.isFav;
    const res = await toggleFavorite(content.id);
    if (!res?.success) {
      content.isFav = wasLiked;
      return toast.error(res?.error || "Failed");
    }
    toast.success(content.isFav ? "Removed favorite" : "Added favorite");
  };

  const handleTogglePinned = async () => {
    const wasPinned = content.isPinned;
    content.isPinned = !content.isPinned;
    const res = await togglePin(content.id);
    if (!res?.success) {
      content.isPinned = wasPinned;
      return toast.error(res?.error || "Failed");
    }
    toast.success(content.isPinned ? "Unpinned" : "Pinned");
  };

  return (
    <div className="flex flex-row gap-2">
      <Button
        variant={content.isFav ? "secondary" : "outline"}
        onClick={handleToggleFavorite}
      >
        {content.isFav ? <Heart fill="red" /> : <Heart />}
      </Button>

      <Button
        variant={content.isPinned ? "secondary" : "outline"}
        onClick={handleTogglePinned}
      >
        {content.isPinned ? (
          <Pin className="rotate-55" />
        ) : (
          <PinOff className="rotate-55" />
        )}
      </Button>

      {content.link ? (
        <a href={content.link} target="_blank" rel="noreferrer">
          <Button className="cursor-pointer" variant="ghost" size="lg">
            <ExternalLink />
          </Button>
        </a>
      ) : (
        <Button className="cursor-pointer" variant="ghost" disabled>
          <ExternalLink />
        </Button>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="cursor-pointer" variant="destructive">
            <Trash2 />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                const res = await deleteContent(content.id);
                if (!res?.success) return toast.error(res?.error || "Failed");
                router.push("/content");
                toast.success("Content deleted");
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContentActions;
