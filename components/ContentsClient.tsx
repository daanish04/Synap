"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  addContent,
  deleteContent,
  toggleFavorite,
  togglePin,
  updateContent,
} from "@/actions/contentActions";
import { ContentItem, Tag } from "@/lib/types";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  ExternalLink,
  Heart,
  PenLine,
  Pin,
  PinOff,
  Trash2,
} from "lucide-react";
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
import { toast } from "sonner";
import Link from "next/link";

export default function ContentsClient({
  contents: initialContents,
  tags,
  mode,
}: {
  contents: ContentItem[];
  tags: Tag[];
  mode?: string;
}) {
  // Use state for optimistic updates
  const [contents, setContents] = useState(initialContents);
  const [query, setQuery] = useState("");
  const [tagQuery, setTagQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const comboRef = useRef<HTMLDivElement | null>(null);

  // Update contents when initialContents changes (after mutations)
  useEffect(() => {
    setContents(initialContents);
  }, [initialContents]);

  const tagSuggestions = useMemo(() => {
    const q = tagQuery.trim().toLowerCase();
    if (!q) return tags.slice(0, 50);
    return tags.filter((t) => t.title.toLowerCase().includes(q)).slice(0, 50);
  }, [tags, tagQuery]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contents.filter((c) => {
      const matchesQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        (c.description || "").toLowerCase().includes(q);

      const hasTags =
        selectedTags.length === 0 ||
        selectedTags.every((st) => c.tags.some((t) => t.tag.title === st));

      return matchesQuery && hasTags;
    });
  }, [contents, query, selectedTags]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!comboRef.current) return;
      if (!comboRef.current.contains(e.target as Node)) setTagQuery("");
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const addTag = (t: string) => {
    if (!t) return;
    if (selectedTags.includes(t)) return;
    setSelectedTags((s) => [...s, t]);
    setTagQuery("");
  };

  const removeTag = (t: string) => {
    setSelectedTags((s) => s.filter((x) => x !== t));
  };

  const handleToggleFavorite = async (itemId: string) => {
    const currentItem = contents.find((c) => c.id === itemId);
    const wasLiked = currentItem?.isFav;

    // Optimistic update
    setContents((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isFav: !item.isFav } : item
      )
    );

    const res = await toggleFavorite(itemId);
    if (!res?.success) {
      // Revert on failure
      setContents((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, isFav: !item.isFav } : item
        )
      );
      toast.error(res?.error || "Failed to toggle favorite");
      return;
    }

    toast.success(wasLiked ? "Removed from favorites" : "Added to favorites");
  };

  const handleTogglePin = async (itemId: string) => {
    const currentItem = contents.find((c) => c.id === itemId);
    if (!currentItem) return;

    const wasPinned = currentItem.isPinned;

    // Check pin limit before update
    if (!wasPinned) {
      const currentPinnedCount = contents.filter((c) => c.isPinned).length;
      if (currentPinnedCount >= 5) {
        toast.error("You can only pin up to 5 items. Unpin something first.");
        return;
      }
    }

    // Optimistic update
    setContents((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isPinned: !item.isPinned } : item
      )
    );

    const res = await togglePin(itemId);
    if (!res?.success) {
      // Revert on failure
      setContents((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, isPinned: !item.isPinned } : item
        )
      );
      toast.error(res?.error || "Failed to toggle pin");
      return;
    }

    toast.success(wasPinned ? "Unpinned" : "Pinned");
  };

  const handleDelete = async (itemId: string) => {
    const itemToDelete = contents.find((c) => c.id === itemId);

    // Optimistic update - remove immediately
    setContents((prev) => prev.filter((item) => item.id !== itemId));

    const res = await deleteContent(itemId);
    if (!res?.success) {
      // add back the item on failure
      if (itemToDelete) {
        setContents((prev) => [...prev, itemToDelete]);
      }
      toast.error(res?.error || "Failed to delete");
      return;
    }

    toast.success("Content deleted");
  };

  const updateContentHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const res = await updateContent(formData);
    if (!res?.success) {
      toast.error(res?.error || "Failed to update content");
      setLoading(false);
      return;
    }

    // success: reset form, close dialog
    form.reset();
    setEditingId(null);
    toast.success("Content updated");
    setLoading(false);
  };

  const createContentHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const res = await addContent(formData);
    if (!res?.success) {
      toast.error(res?.error || "Failed to add content");
      setLoading(false);
      return;
    }

    // success: reset form, close dialog
    form.reset();
    setAddOpen(false);
    toast.success("Content added");
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {mode != "collection" && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            {mode === "favorites" ? "Favorites" : "Contents"}
          </h2>
          <div className="flex items-center gap-3">
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button className="cursor-pointer">Add Content</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Content</DialogTitle>
                  <DialogDescription>
                    Save an article, note, or link to your library.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={createContentHandler} className="grid gap-3">
                  <Input
                    name="title"
                    placeholder="Title"
                    required
                    autoSave="off"
                  />
                  <Textarea
                    name="description"
                    placeholder="Description"
                    className="max-h-60"
                  />
                  <Input
                    name="link"
                    placeholder="Link (optional)"
                    autoSave="off"
                  />
                  <Input
                    name="tags"
                    placeholder="Tags (comma separated)"
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
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center justify-between gap-3 w-full sm:max-w-md">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or description"
            className="w-full rounded-md border px-3 py-2"
            autoSave="off"
          />
        </div>

        <div className="w-full sm:w-1/2" ref={comboRef}>
          <div className="relative">
            <Input
              value={tagQuery}
              onChange={(e) => setTagQuery(e.target.value)}
              placeholder="Add tags to filter (type to search)"
            />
            {tagQuery !== "" && (
              <div className="absolute z-20 mt-1 w-full max-h-56 overflow-auto rounded border bg-background p-2">
                {tagSuggestions.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    No tags
                  </div>
                ) : (
                  tagSuggestions.map((s) => (
                    <div
                      key={s.id}
                      className="p-2 hover:bg-accent/50 rounded cursor-pointer"
                      onClick={() => addTag(s.title)}
                    >
                      {s.title}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {selectedTags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-2 bg-muted px-2 py-1 rounded"
              >
                <span className="text-sm">{t}</span>
                <button
                  onClick={() => removeTag(t)}
                  className="text-xs opacity-70"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground col-span-full">
            No content found!
          </div>
        ) : (
          <>
            {filtered.map((item) => (
              <Card key={item.id} className="relative">
                <CardHeader>
                  <CardTitle>
                    <Link
                      href={`/content/${item.id}`}
                      className="hover:underline"
                    >
                      {item.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="overflow-hidden text-ellipsis max-h-40">
                    {item.description || "There's nothing to display."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((t) => (
                      <span
                        key={t.tag.id}
                        className="text-sm bg-muted px-2 py-1 rounded"
                      >
                        {t.tag.title}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant={item.isFav ? "secondary" : "outline"}
                      onClick={() => handleToggleFavorite(item.id)}
                    >
                      {item.isFav ? <Heart fill="red" /> : <Heart />}
                    </Button>

                    <Button
                      variant={item.isPinned ? "secondary" : "outline"}
                      onClick={() => handleTogglePin(item.id)}
                    >
                      {item.isPinned ? (
                        <Pin className="rotate-55" />
                      ) : (
                        <PinOff className="rotate-55" />
                      )}
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Dialog
                      open={editingId === item.id}
                      onOpenChange={(open) =>
                        setEditingId(open ? item.id : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button className="cursor-pointer" variant="ghost">
                          <PenLine />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Content</DialogTitle>
                        </DialogHeader>

                        <form
                          onSubmit={updateContentHandler}
                          className="grid gap-3"
                        >
                          <input type="hidden" name="id" value={item.id} />
                          <Input
                            name="title"
                            placeholder="Title"
                            defaultValue={item.title}
                            required
                            autoSave="off"
                          />
                          <Textarea
                            name="description"
                            placeholder="Description"
                            defaultValue={item.description || ""}
                            className="max-h-60"
                          />
                          <Input
                            name="link"
                            placeholder="Link (optional)"
                            defaultValue={item.link || ""}
                            autoSave="off"
                          />
                          <Input
                            name="tags"
                            placeholder="Tags (comma separated)"
                            defaultValue={item.tags
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
                    {item.link ? (
                      <a href={item.link} target="_blank" rel="noreferrer">
                        <Button className="cursor-pointer" variant="ghost">
                          <ExternalLink />
                        </Button>
                      </a>
                    ) : (
                      <Button
                        className="cursor-pointer"
                        variant="ghost"
                        disabled
                      >
                        <ExternalLink />
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          className="cursor-pointer"
                          variant="destructive"
                        >
                          <Trash2 />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your content.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(item.id)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
