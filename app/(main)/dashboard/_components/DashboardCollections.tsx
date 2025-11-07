"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CollectionSummary } from "@/lib/types";
import { ChevronsRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const DashboardCollections = ({
  collections,
}: {
  collections: CollectionSummary[];
}) => {
  const [collectionsData, setCollectionsData] = useState<CollectionSummary[]>(
    []
  );
  const [totalCollections, setTotalCollections] = useState(0);
  const [publicCollections, setPublicCollections] = useState(0);

  useEffect(() => {
    const filtered = collections.slice(0, 3);
    setCollectionsData(filtered);
    setPublicCollections(collections.filter((c) => c.isPublic).length);
    setTotalCollections(collections.length);
  }, [collections]);

  return (
    <div className="relative h-full px-4 py-2 rounded-xl border">
      <div className="absolute -right-3 -top-3 flex items-center rounded-xl bg-muted hover:bg-muted/80 transition-colors duration-300 cursor-pointer p-1.5 border">
        <Link href="/collections">
          <ChevronsRight className="h-5 w-5" />
        </Link>
      </div>
      <h3 className="text-xl font-semibold mb-2">Your Collections</h3>
      <div className="flex-1 grid md:grid-cols-12 grid-cols-3 gap-2 px-2">
        {collectionsData.length === 0 ? (
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground text-center italic">
              No Collections created
            </p>
          </div>
        ) : (
          <>
            {collectionsData.map((c: CollectionSummary) => (
              <Card key={c.id} className="col-span-3">
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
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
            <div className="flex flex-col justify-center items-center py-2 px-4 border rounded-xl bg-blue-700 col-span-3">
              <div className="flex flex-col items-center">
                <span className="text-white font-bold text-xl">
                  {totalCollections}
                </span>
                <span className="text-white">Total</span>
              </div>
              <div className="w-full px-2">
                <Separator className="my-2" />
              </div>
              <div>
                <div className="flex flex-col items-center">
                  <span className="text-blue-200 font-bold text-xl">
                    {publicCollections}
                  </span>
                  <span className="text-blue-200">Public</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardCollections;
