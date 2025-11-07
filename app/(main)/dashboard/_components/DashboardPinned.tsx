"use client";

import { toggleFavorite } from "@/actions/contentActions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContentItem } from "@/lib/types";
import { ExternalLink, Heart } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const DashboardPinned = ({ contents }: { contents: ContentItem[] }) => {
  const [pinnedContents, setPinnedContents] = useState<ContentItem[]>([]);

  useEffect(() => {
    const pinned = contents.filter((content) => content.isPinned === true);
    setPinnedContents(pinned);
  }, [contents]);

  const handleToggleFavorite = async (itemId: string) => {
    const currentItem = contents.find((c) => c.id === itemId);
    const wasLiked = currentItem?.isFav;

    // Optimistic update
    setPinnedContents((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isFav: !item.isFav } : item
      )
    );

    const res = await toggleFavorite(itemId);
    if (!res?.success) {
      // Revert on failure
      setPinnedContents((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, isFav: !item.isFav } : item
        )
      );
      toast.error(res?.error || "Failed to toggle favorite");
      return;
    }

    toast.success(wasLiked ? "Removed from favorites" : "Added to favorites");
  };
  return (
    <div className="h-full px-2 rounded-xl">
      <h3 className="text-xl font-semibold mb-1">Pinned</h3>
      {pinnedContents.length === 0 ? (
        <p className="text-muted-foreground text-center italic">
          No pinned contents
        </p>
      ) : (
        <div className="grid sm:grid-cols-5 grid-cols-2 gap-2 px-1">
          {pinnedContents.map((content) => (
            <div key={content.id} className="col-span-1 rounded-md">
              <Card>
                <CardHeader>
                  <CardTitle className="overflow-hidden text-ellipsis h-5">
                    <Link
                      href={`/content/${content.id}`}
                      className="hover:underline"
                    >
                      {content.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="overflow-hidden text-ellipsis h-5">
                    {content.description || "There's nothing to display."}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant={content.isFav ? "secondary" : "outline"}
                      onClick={() => handleToggleFavorite(content.id)}
                    >
                      {content.isFav ? <Heart fill="red" /> : <Heart />}
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    {content.link ? (
                      <a href={content.link} target="_blank" rel="noreferrer">
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
                  </div>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPinned;
