"use client";

import { ContentItem, SR } from "@/lib/types";
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
import {
  getCollectionsForContent,
  toggleContentInCollection,
} from "@/actions/collectionActions";
import {
  enableSRForContent,
  disableSRForContent,
  getSRForContent,
  submitSRReview,
} from "@/actions/srActions";

const ContentBodyClient = ({
  content: initialContent,
  mode,
}: {
  content: ContentItem;
  mode?: string;
}) => {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [collections, setCollections] = useState<
    { id: string; title: string; included: boolean }[]
  >([]);
  const [srLoading, setSrLoading] = useState(false);
  const [srEnabled, setSrEnabled] = useState<boolean>(false);
  const [srInitialEnabled, setSrInitialEnabled] = useState<boolean>(false);
  const [srState, setSrState] = useState<SR | null>(null);
  const router = useRouter();

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  useEffect(() => {
    (async () => {
      const res = await getCollectionsForContent(content.id);
      if (res?.success && res.data) setCollections(res.data);
    })();
  }, [content.id]);

  useEffect(() => {
    (async () => {
      setSrLoading(true);
      const res = await getSRForContent(content.id);
      if (res?.success && res.data) {
        if (res.data.enabled === false) {
          setSrEnabled(false);
          setSrInitialEnabled(false);
          setSrState(null);
        } else if (res.data.enabled) {
          const d = res.data;
          setSrEnabled(true);
          setSrInitialEnabled(true);
          setSrState({
            interval: d.interval ?? 1,
            easeFactor: d.easeFactor ?? 2.5,
            repetitions: d.repetitions ?? 0,
            nextReview: d.nextReview ?? null,
            nextReviewFormatted: d.nextReviewFormatted ?? null,
            isDueToday: !!d.isDueToday,
            enabled: true,
          });
        }
      }
      setSrLoading(false);
    })();
  }, [content.id]);

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
        {mode != "share" && (
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
                    defaultValue={content.tags
                      .map((t) => t.tag.title)
                      .join(", ")}
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

            <Dialog open={collectionsOpen} onOpenChange={setCollectionsOpen}>
              <DialogTrigger asChild>
                <Button variant="default">Add to Collection</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add to Collection</DialogTitle>
                </DialogHeader>
                <div className="grid gap-2">
                  {collections.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No collections yet.
                    </div>
                  ) : (
                    collections.map((c) => (
                      <label
                        key={c.id}
                        className="flex items-center justify-between border rounded p-2"
                      >
                        <span>{c.title}</span>
                        <input
                          type="checkbox"
                          checked={c.included}
                          onChange={async () => {
                            const prev = c.included;
                            setCollections((list) =>
                              list.map((it) =>
                                it.id === c.id
                                  ? { ...it, included: !it.included }
                                  : it
                              )
                            );
                            const res = await toggleContentInCollection(
                              c.id,
                              content.id
                            );
                            if (!res?.success) {
                              setCollections((list) =>
                                list.map((it) =>
                                  it.id === c.id
                                    ? { ...it, included: prev }
                                    : it
                                )
                              );
                              toast.error(
                                res?.error || "Failed to update collection"
                              );
                            }
                          }}
                        />
                      </label>
                    ))
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
        {mode === "share" &&
          (content.link ? (
            <a href={content.link} target="_blank" rel="noreferrer">
              <Button className="cursor-pointer" variant="ghost" size="lg">
                <ExternalLink />
              </Button>
            </a>
          ) : (
            <Button className="cursor-pointer" variant="ghost" disabled>
              <ExternalLink />
            </Button>
          ))}
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

      {mode != "share" && (
        <div className="sticky bottom-0 bg-white sm:pb-4 pb-14">
          <Separator className="my-4" />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-5">
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
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
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
                      <Switch
                        checked={srEnabled}
                        onCheckedChange={(v) => setSrEnabled(!!v)}
                        disabled={srLoading}
                      />
                    </div>
                    <Separator className="my-4" />
                    {srState?.enabled ? (
                      <div className="flex flex-col gap-3">
                        <div
                          className={`text-center ${
                            srState?.isDueToday
                              ? "text-red-600 font-semibold"
                              : ""
                          }`}
                        >
                          Next Review Date:{" "}
                          {srState?.nextReviewFormatted || "Not scheduled"}
                        </div>
                        {srState?.isDueToday && (
                          <>
                            <div className="text-center">
                              Your review is due:
                            </div>
                            <div className="grid sm:grid-cols-5 grid-cols-6">
                              <button
                                className="sm:col-span-1 col-span-3 flex flex-col gap-1 text-center py-1 px-3 border rounded-l-md hover:scale-105 hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                                onClick={async () => {
                                  setSrLoading(true);
                                  const res = await submitSRReview(
                                    content.id,
                                    0
                                  );
                                  setSrLoading(false);
                                  if (!res?.success)
                                    return toast.error(res?.error || "Failed");
                                  toast.success("Review submitted");
                                  if (res.data) {
                                    setSrState({
                                      interval: res.data.interval ?? 1,
                                      easeFactor: res.data.easeFactor ?? 2.5,
                                      repetitions: res.data.repetitions ?? 0,
                                      nextReview: res.data.nextReview ?? null,
                                      nextReviewFormatted:
                                        res.data.nextReviewFormatted ?? null,
                                      isDueToday: false,
                                      enabled: true,
                                    });
                                  }
                                }}
                              >
                                <span className="font-bold text-sm">
                                  FORGOT
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  Completely forgot
                                </span>
                              </button>
                              <button
                                className="sm:col-span-1 col-span-3 flex flex-col gap-1 text-center py-1 px-3 border  hover:scale-105 hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                                onClick={async () => {
                                  setSrLoading(true);
                                  const res = await submitSRReview(
                                    content.id,
                                    1
                                  );
                                  setSrLoading(false);
                                  if (!res?.success)
                                    return toast.error(res?.error || "Failed");
                                  toast.success("Review submitted");
                                  if (res.data) {
                                    setSrState({
                                      interval: res.data.interval ?? 1,
                                      easeFactor: res.data.easeFactor ?? 2.5,
                                      repetitions: res.data.repetitions ?? 0,
                                      nextReview: res.data.nextReview ?? null,
                                      nextReviewFormatted:
                                        res.data.nextReviewFormatted ?? null,
                                      isDueToday: false,
                                      enabled: true,
                                    });
                                  }
                                }}
                              >
                                <span className="font-bold text-sm">HARD</span>
                                <span className="text-xs text-muted-foreground">
                                  Remembered with difficulty
                                </span>
                              </button>
                              <button
                                className="sm:col-span-1 col-span-2 flex flex-col gap-1 text-center py-1 px-3 border hover:scale-105 hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                                onClick={async () => {
                                  setSrLoading(true);
                                  const res = await submitSRReview(
                                    content.id,
                                    2
                                  );
                                  setSrLoading(false);
                                  if (!res?.success)
                                    return toast.error(res?.error || "Failed");
                                  toast.success("Review submitted");
                                  if (res.data) {
                                    setSrState({
                                      interval: res.data.interval ?? 1,
                                      easeFactor: res.data.easeFactor ?? 2.5,
                                      repetitions: res.data.repetitions ?? 0,
                                      nextReview: res.data.nextReview ?? null,
                                      nextReviewFormatted:
                                        res.data.nextReviewFormatted ?? null,
                                      isDueToday: false,
                                      enabled: true,
                                    });
                                  }
                                }}
                              >
                                <span className="font-bold text-sm">GOOD</span>
                                <span className="text-xs text-muted-foreground">
                                  Remembered with some effort
                                </span>
                              </button>
                              <button
                                className="col-span-2 sm:col-span-1 flex flex-col gap-1 text-center py-1 px-3 border hover:scale-105 hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                                onClick={async () => {
                                  setSrLoading(true);
                                  const res = await submitSRReview(
                                    content.id,
                                    3
                                  );
                                  setSrLoading(false);
                                  if (!res?.success)
                                    return toast.error(res?.error || "Failed");
                                  toast.success("Review submitted");
                                  if (res.data) {
                                    setSrState({
                                      interval: res.data.interval ?? 1,
                                      easeFactor: res.data.easeFactor ?? 2.5,
                                      repetitions: res.data.repetitions ?? 0,
                                      nextReview: res.data.nextReview ?? null,
                                      nextReviewFormatted:
                                        res.data.nextReviewFormatted ?? null,
                                      isDueToday: false,
                                      enabled: true,
                                    });
                                  }
                                }}
                              >
                                <span className="font-bold text-sm">EASY</span>
                                <span className="text-xs text-muted-foreground">
                                  Remembered easily
                                </span>
                              </button>
                              <button
                                className="col-span-2 sm:col-span-1 flex flex-col gap-1 text-center py-1 px-3 border rounded-r-md hover:scale-105 hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                                onClick={async () => {
                                  setSrLoading(true);
                                  const res = await submitSRReview(
                                    content.id,
                                    4
                                  );
                                  setSrLoading(false);
                                  if (!res?.success)
                                    return toast.error(res?.error || "Failed");
                                  toast.success("Review submitted");
                                  if (res.data) {
                                    setSrState({
                                      interval: res.data.interval ?? 1,
                                      easeFactor: res.data.easeFactor ?? 2.5,
                                      repetitions: res.data.repetitions ?? 0,
                                      nextReview: res.data.nextReview ?? null,
                                      nextReviewFormatted:
                                        res.data.nextReviewFormatted ?? null,
                                      isDueToday: false,
                                      enabled: true,
                                    });
                                  }
                                }}
                              >
                                <span className="font-bold text-sm">
                                  VERY EASY
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  Too Easy
                                </span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 px-10">
                        <div className="text-sm text-muted-foreground text-center">
                          Spaced Repetition is disabled for this content.
                        </div>
                      </div>
                    )}
                    <DrawerFooter>
                      <DrawerClose asChild>
                        <div className="flex flex-col gap-1">
                          <Button
                            disabled={
                              srLoading || srEnabled === srInitialEnabled
                            }
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={async () => {
                              setSrLoading(true);
                              try {
                                if (srEnabled && !srInitialEnabled) {
                                  const res = await enableSRForContent(
                                    content.id
                                  );
                                  if (!res?.success)
                                    throw new Error(
                                      res?.error || "Failed to enable"
                                    );
                                  const refreshed = await getSRForContent(
                                    content.id
                                  );
                                  if (
                                    refreshed?.success &&
                                    refreshed.data &&
                                    refreshed.data.enabled
                                  ) {
                                    const d = refreshed.data;
                                    setSrInitialEnabled(true);
                                    setSrState({
                                      interval: d.interval ?? 1,
                                      easeFactor: d.easeFactor ?? 2.5,
                                      repetitions: d.repetitions ?? 0,
                                      nextReview: d.nextReview ?? null,
                                      nextReviewFormatted:
                                        d.nextReviewFormatted ?? null,
                                      isDueToday: !!d.isDueToday,
                                      enabled: true,
                                    });
                                  }
                                  toast.success("Enabled spaced repetition");
                                } else if (!srEnabled && srInitialEnabled) {
                                  const res = await disableSRForContent(
                                    content.id
                                  );
                                  if (!res?.success)
                                    throw new Error(
                                      res?.error || "Failed to disable"
                                    );
                                  setSrInitialEnabled(false);
                                  setSrState(null);
                                  toast.success("Disabled spaced repetition");
                                } else {
                                  toast.success("Saved");
                                }
                              } catch (e) {
                                toast.error((e as Error).message);
                                setSrEnabled(srInitialEnabled);
                              } finally {
                                setSrLoading(false);
                              }
                            }}
                          >
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentBodyClient;
