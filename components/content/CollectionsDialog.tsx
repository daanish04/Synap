"use client";

import React, { useEffect, useState } from "react";
import { CollectionForContent } from "@/lib/types";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { toast } from "sonner";
import { toggleContentInCollection } from "@/actions/collectionActions";

const CollectionsDialog = ({
  contentId,
  collections,
}: {
  contentId: string;
  collections: CollectionForContent[];
}) => {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState<CollectionForContent[]>(collections || []);

  useEffect(() => {
    setList(collections || []);
  }, [collections]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add to Collection</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Collection</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          {list.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No collections yet.
            </div>
          ) : (
            list.map((c) => (
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
                    setList((l) =>
                      l.map((it) =>
                        it.id === c.id ? { ...it, included: !it.included } : it
                      )
                    );
                    const res = await toggleContentInCollection(
                      c.id,
                      contentId
                    );
                    if (!res?.success) {
                      setList((l) =>
                        l.map((it) =>
                          it.id === c.id ? { ...it, included: prev } : it
                        )
                      );
                      toast.error(res?.error || "Failed to update collection");
                    }
                  }}
                />
              </label>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionsDialog;
