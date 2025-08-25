import React from "react";
import { getUserContent } from "@/actions/contentActions";
import ContentsClient from "@/components/ContentsClient";

const ContentPage = async () => {
  const response = await getUserContent();

  if (!response.success || !response.data) {
    return <div>Something went wrong. {response.error}</div>;
  }
  const contents = response.data.contents;
  const tags = response.data.tags;

  return (
    <div className="p-6">
      <ContentsClient mode={"contents"} contents={contents} tags={tags} />
    </div>
  );
};

export default ContentPage;
