"use client";

import { toggleFavorite, togglePin } from "@/actions/contentActions";
import { Button } from "@/components/ui/button";
import { ContentItem } from "@/lib/types";
import { ChevronsRight, Heart, Pin, PinOff } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const DashboardContents = ({ contents }: { contents: ContentItem[] }) => {
  const [dashContents, setDashContents] = useState<ContentItem[]>([]);

  useEffect(() => {
    const recents = contents.slice(0, 8);
    setDashContents(recents);
  }, [contents]);

  const handleToggleFavorite = async (itemId: string) => {
    const currentItem = contents.find((c) => c.id === itemId);
    const wasLiked = currentItem?.isFav;

    // Optimistic update
    setDashContents((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isFav: !item.isFav } : item
      )
    );

    const res = await toggleFavorite(itemId);
    if (!res?.success) {
      // Revert on failure
      setDashContents((prev) =>
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
    setDashContents((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isPinned: !item.isPinned } : item
      )
    );

    const res = await togglePin(itemId);
    if (!res?.success) {
      // Revert on failure
      setDashContents((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, isPinned: !item.isPinned } : item
        )
      );
      toast.error(res?.error || "Failed to toggle pin");
      return;
    }

    toast.success(wasPinned ? "Unpinned" : "Pinned");
  };

  return (
    <div className="relative h-full w-full px-4 py-2 rounded-xl border-2 flex flex-col">
      <div className="absolute -right-3 -top-3 flex items-center rounded-xl bg-muted hover:bg-muted/80 transition-colors duration-300 cursor-pointer p-1.5 border">
        <Link href="/content">
          <ChevronsRight className="h-5 w-5" />
        </Link>
      </div>
      <h3 className="text-xl font-semibold mb-2">Recent Contents</h3>

      <div className="flex-1 grid grid-rows-8 gap-1 px-2">
        {dashContents.length === 0 ? (
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground text-center italic">
              No recent contents
            </p>
          </div>
        ) : (
          <>
            {dashContents.map((content: ContentItem) => (
              <div
                key={content.id}
                className="row-span-1 bg-muted/50 px-3 rounded-md flex items-center border-l-3 justify-between"
              >
                <Link
                  href={`/content/${content.id}`}
                  className="hover:underline overflow-clip "
                >
                  {content.title}
                </Link>
                <div className="flex gap-2">
                  <Button
                    variant={content.isFav ? "secondary" : "outline"}
                    onClick={() => handleToggleFavorite(content.id)}
                  >
                    {content.isFav ? <Heart fill="red" /> : <Heart />}
                  </Button>

                  <Button
                    variant={content.isPinned ? "secondary" : "outline"}
                    onClick={() => handleTogglePin(content.id)}
                  >
                    {content.isPinned ? (
                      <Pin className="rotate-55" />
                    ) : (
                      <PinOff className="rotate-55" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardContents;
