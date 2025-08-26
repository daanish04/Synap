import React from "react";

import {
  createCollection,
  getCollectionsList,
} from "@/actions/collectionActions";

import CollectionCreateDialog from "@/components/CollectionCreateDialog";
import CollectionsClient from "@/components/CollectionsClient";

const CollectionsPage = async () => {
  const response = await getCollectionsList();

  if (!response.success || !response.data) {
    return <div className="p-6">Something went wrong. {response.error}</div>;
  }

  const collections = response.data;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Collections</h2>
        <CollectionCreateDialog create={createCollection} />
      </div>

      <CollectionsClient collections={collections} />
    </div>
  );
};

export default CollectionsPage;
