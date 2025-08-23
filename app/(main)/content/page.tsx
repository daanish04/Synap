import React from "react";
import { getUserContent } from "@/actions/contentActions";
import ContentsClient from "@/components/ContentsClient";

const ContentPage = async () => {
  const userContents = await getUserContent();
  if (!userContents || Array.isArray(userContents)) {
    return <div>Loading...</div>;
  }

  const { contents, tags } = userContents;
  return (
    <div className="p-6">
      <ContentsClient contents={contents} tags={tags} />
    </div>
  );
};

export default ContentPage;
