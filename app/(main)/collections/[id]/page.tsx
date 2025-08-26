import React from "react";
import { getCollectionById } from "@/actions/collectionActions";
import ContentsClient from "@/components/ContentsClient";

const CollectionDetailPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const response = await getCollectionById(id);

  if (!response.success || !response.data) {
    return <div className="p-6">Collection not found.</div>;
  }

  const { collection, contents, tags } = response.data;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between  space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">{collection.title}</h2>
          <div className="text-sm text-muted-foreground">
            Created {collection.createdAtFormatted}
          </div>
        </div>
        <span className="text-xs px-2 py-1 rounded border">
          {collection.isPublic ? "Public" : "Private"}
        </span>
      </div>

      <ContentsClient contents={contents} tags={tags} mode="collection" />
    </div>
  );
};

export default CollectionDetailPage;
