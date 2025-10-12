"use client";

import { ContentItem, SR } from "@/lib/types";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ExternalLink } from "lucide-react";
import { Separator } from "./ui/separator";
import EditContentDialog from "./content/EditContentDialog";
import CollectionsDialog from "./content/CollectionsDialog";
import ContentActions from "./content/ContentActions";
import SRDrawer from "./content/SRDrawer";
import TagsList from "./content/TagsList";
import { getCollectionsForContent } from "@/actions/collectionActions";
import { getSRForContent } from "@/actions/srActions";

const ContentBodyClient = ({
  content: initialContent,
  mode,
}: {
  content: ContentItem;
  mode?: string;
}) => {
  const [content, setContent] = useState(initialContent);
  const [collections, setCollections] = useState<
    { id: string; title: string; included: boolean }[]
  >([]);
  const [srState, setSrState] = useState<SR | null>(null);

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
      const res = await getSRForContent(content.id);
      if (res?.success && res.data && res.data.enabled) {
        const d = res.data;
        setSrState({
          interval: d.interval ?? 1,
          easeFactor: d.easeFactor ?? 2.5,
          repetitions: d.repetitions ?? 0,
          nextReview: d.nextReview ?? null,
          nextReviewFormatted: d.nextReviewFormatted ?? null,
          isDueToday: !!d.isDueToday,
          enabled: true,
        });
      } else {
        setSrState(null);
      }
    })();
  }, [content.id]);

  // handlers moved to modular components (EditContentDialog, ContentActions, SRDrawer)

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
            <EditContentDialog content={content} />

            <CollectionsDialog
              contentId={content.id}
              collections={collections}
            />
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
      <TagsList tags={content.tags} />
      <Separator className="my-2" />

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
            <ContentActions content={content} setContent={setContent} />
            {/* Space Repitition and Review actions */}
            <div className="flex flex-row gap-2 items-center">
              <SRDrawer contentId={content.id} initialState={srState} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentBodyClient;
