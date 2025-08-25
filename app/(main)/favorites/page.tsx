import { getFavoriteContent } from "@/actions/contentActions";
import ContentsClient from "@/components/ContentsClient";
import React from "react";

const FavoritesPage = async () => {
  const response = await getFavoriteContent();

  if (!response.success || !response.data) {
    return <div>No favorites found</div>;
  }

  const contents = response.data.contents;
  const tags = response.data.tags;

  return (
    <div className="p-6">
      <ContentsClient mode={"favorites"} contents={contents} tags={tags} />
    </div>
  );
};

export default FavoritesPage;
