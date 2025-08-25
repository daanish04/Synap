"use client";

import { ContentItem } from "@/lib/types";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ExternalLink, Heart, Pin, PinOff, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import {
  deleteContent,
  toggleFavorite,
  togglePin,
  updateContent,
} from "@/actions/contentActions";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useRouter } from "next/navigation";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Switch } from "./ui/switch";

const ContentBodyClient = ({
  content: initialContent,
}: {
  content: ContentItem;
}) => {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleToggleFavorite = async () => {
    const wasLiked = content.isFav;
    setContent((prev) => ({ ...prev, isFav: !prev.isFav }));
    const res = await toggleFavorite(content.id);
    if (!res?.success) {
      setContent((prev) => ({ ...prev, isFav: wasLiked }));
      return toast.error(res?.error || "Failed");
    }
    toast.success(content.isFav ? "Removed favorite" : "Added favorite");
  };

  const handleTogglePinned = async () => {
    const wasPinned = content.isPinned;
    setContent((prev) => ({ ...prev, isPinned: !prev.isPinned }));
    const res = await togglePin(content.id);
    if (!res?.success) {
      setContent((prev) => ({ ...prev, isPinned: wasPinned }));
      return toast.error(res?.error || "Failed");
    }
    toast.success(content.isPinned ? "Unpinned" : "Pinned");
  };

  const updateContentHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const response = await updateContent(formData);
    if (!response?.success) {
      toast.error(response?.error || "Failed to add content");
      setLoading(false);
      return;
    }

    // success: reset form, close dialog and refresh
    form.reset();
    setEditOpen(false);
    toast.success("Content updated successfully");

    setLoading(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col md:flex-row md:gap-3 gap-1 items-end">
          <h1 className="text-2xl font-bold ">{content.title || "Untitled"}</h1>
          {content.updatedAtFormatted && (
            <span className="text-xs  text-gray-500">
              (Last Updated: {content.updatedAtFormatted})
            </span>
          )}
        </div>
        <div className="flex flex-col md:flex-row md:gap-3 gap-2 items-center">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer" variant="secondary">
                Edit Content
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Content</DialogTitle>
              </DialogHeader>

              <form onSubmit={updateContentHandler} className="grid gap-3">
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
                  defaultValue={content.tags.map((t) => t.tag.title).join(", ")}
                  autoSave="off"
                />

                <Button
                  className="cursor-pointer"
                  disabled={loading}
                  type="submit"
                >
                  Save
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <Button variant="default">Add to Collection</Button>
        </div>
      </div>

      <Separator className="my-4" />

      {content.tags && content.tags.length > 0 && (
        <>
          <div className="flex sm:gap-2 gap-1 overflow-x-auto no-scrollbar">
            {content.tags.map((t) => (
              <span
                key={t.tag.id}
                className="px-2 py-1 md:text-base text-sm bg-gray-100 rounded"
              >
                {t.tag.title}
              </span>
            ))}
          </div>
          <Separator className="my-4" />
        </>
      )}

      <div className="px-4 text-sm sm:text-base font-sans whitespace-pre-wrap break-words">
        {content.description || (
          <p className="text-center text-muted-foreground">
            There&apos;s nothing to display here.
          </p>
        )}
      </div>

      <div className="sticky bottom-0 bg-white pb-2">
        <Separator className="my-4" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between items-start gap-5">
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
                    This action cannot be undone. This will permanently delete
                    your content.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      const res = await deleteContent(content.id);
                      if (!res?.success)
                        return toast.error(res?.error || "Failed");
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
          {/* Space Repitition and Review actions */}
          <div className="flex flex-row gap-2 items-center">
            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-md cursor-pointer"
                >
                  Spaced Repetition
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="w-full mx-auto max-w-md">
                  <DrawerHeader>
                    <DrawerTitle>Spaced Repetition</DrawerTitle>
                    <DrawerDescription>
                      Set if you would want to keep this content in your mind-
                      Forever.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="flex flex-row px-10 gap-2 justify-between items-center">
                    <span>Want it enabled?</span>
                    <Switch />
                  </div>
                  <Separator className="my-4" />
                  <div className="flex flex-col gap-3">
                    <div className="text-center">Your review is due:</div>
                    <div className="flex flex-row">
                      <div className="flex flex-col gap-1 text-center py-1 px-3 border rounded-l-md w-xs hover:scale-105 hover:bg-gray-100 transition-all duration-300 cursor-pointer">
                        <span className="font-bold text-sm">FORGOT</span>
                        <span className="text-xs text-muted-foreground">
                          Completely forgot
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 text-center py-1 px-3 border w-xs hover:scale-105 hover:bg-gray-100 transition-all duration-300 cursor-pointer">
                        <span className="font-bold text-sm">HARD</span>
                        <span className="text-xs text-muted-foreground">
                          Remembered with difficulty
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 text-center py-1 px-3 border w-xs hover:scale-105 hover:bg-gray-100 transition-all duration-300 cursor-pointer">
                        <span className="font-bold text-sm">GOOD</span>
                        <span className="text-xs text-muted-foreground">
                          Remembered with some effort
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 text-center py-1 px-3 border w-xs hover:scale-105 hover:bg-gray-100 transition-all duration-300 cursor-pointer">
                        <span className="font-bold text-sm">EASY</span>
                        <span className="text-xs text-muted-foreground">
                          Remembered easily
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 text-center py-1 px-3 border rounded-r-md w-xs hover:scale-105 hover:bg-gray-100 transition-all duration-300 cursor-pointer">
                        <span className="font-bold text-sm">VERY EASY</span>
                        <span className="text-xs text-muted-foreground">
                          Too Easy
                        </span>
                      </div>
                    </div>
                  </div>
                  <DrawerFooter>
                    <div className="text-sm text-muted-foreground text-center">
                      Next Review Date: 12/12/2023
                    </div>
                    <DrawerClose asChild>
                      <div className="flex flex-col gap-1">
                        <Button variant="secondary" className="cursor-pointer">
                          Save
                        </Button>
                        <Button variant="outline" className="cursor-pointer">
                          Close
                        </Button>
                      </div>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
            {/* also show next review date for the content if clicked up yes */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentBodyClient;
