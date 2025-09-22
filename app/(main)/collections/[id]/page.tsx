import React from "react";
import {
  getCollectionById,
  updateCollection,
} from "@/actions/collectionActions";
import ContentsClient from "@/components/ContentsClient";
import CollectionCreateDialog from "@/components/CollectionCreateDialog";

type Props = {
  params?: Promise<{ id: string }>;
};

const CollectionDetailPage = async ({ params }: Props) => {
  const param = await params;
  const id = param?.id;

  if (!id) return <div className="p-6">Collection not found.</div>;

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
          <span className="text-xs px-2 py-1 rounded border">
            {collection.isPublic ? (
              <span className="text-blue-700">Public</span>
            ) : (
              <span className="text-red-700">Private</span>
            )}
          </span>
        </div>
        <div>
          <CollectionCreateDialog
            create={updateCollection}
            id={id}
            data={collection}
          />
        </div>
      </div>

      <ContentsClient contents={contents} tags={tags} mode="collection" />
    </div>
  );
};

export default CollectionDetailPage;
