import { getCollectionByHash } from "@/actions/collectionActions";
import ContentsClient from "@/components/ContentsClient";
import Navbar from "@/components/Navbar";
import React from "react";

type Props = {
  params?: Promise<{ id: string }>;
};

const BrainPage = async ({ params }: Props) => {
  const param = await params;
  const id = param?.id;

  if (!id) return <div className="p-6">Collection not found.</div>;

  const response = await getCollectionByHash(id);

  if (!response.success || !response.data) {
    return <div className="p-6">Collection not found.</div>;
  }

  const { collection, contents, tags } = response.data;

  return (
    <>
      <Navbar />
      <div className="p-6">
        <div className="flex items-center justify-between  space-y-6">
          <div className="flex flex-1 gap-4 items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">{collection.title}</h2>
            <div className="flex flex-col justify-between items-center">
              <div className="text-sm font-semibold">
                Created by {collection.user.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {collection.createdAtFormatted}
              </div>
            </div>
          </div>
        </div>

        <ContentsClient contents={contents} tags={tags} mode="share" />
      </div>
    </>
  );
};

export default BrainPage;
