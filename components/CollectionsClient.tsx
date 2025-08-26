"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CollectionSummary } from "@/lib/types";
import { Input } from "./ui/input";

const CollectionsClient = ({
  collections,
}: {
  collections: CollectionSummary[];
}) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return collections.filter((c) => {
      const matchesQuery = !q || c.title.toLowerCase().includes(q);

      return matchesQuery;
    });
  }, [collections, query]);
  return (
    <div className="space-y-4">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search collection title"
        className="w-full rounded-md border px-3 py-2"
        autoSave="off"
      />
      {collections.length === 0 ? (
        <div className="text-sm text-muted-foreground">No collections yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c: CollectionSummary) => (
            <Card key={c.id}>
              <CardHeader>
                <CardTitle>
                  <Link
                    href={`/collections/${c.id}`}
                    className="hover:underline"
                  >
                    {c.title}
                  </Link>
                </CardTitle>
                <CardDescription className="flex items-center justify-between">
                  <span>{c.contentsCount} items</span>
                  <span className="text-xs px-2 py-1 rounded border">
                    {c.isPublic ? (
                      <span className="text-blue-700">Public</span>
                    ) : (
                      <span className="text-red-700">Private</span>
                    )}
                  </span>
                </CardDescription>
                <div className="text-xs text-muted-foreground">
                  Created {c.createdAtFormatted}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionsClient;
