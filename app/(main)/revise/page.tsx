import { getReviseContents } from "@/actions/reviseActions";
import ReviewClientPage from "@/components/ReviewClient";
import React from "react";

const RevisePage = async () => {
  const response = await getReviseContents();
  if (!response.success || !response.data) {
    return <div>No items to revise</div>;
  }

  const contents = response.data;
  console.log(contents);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">To Review</h2>
      <ReviewClientPage contents={contents} />
    </div>
  );
};

export default RevisePage;
