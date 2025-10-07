import React from "react";
import DashboardCollections from "./_components/DashboardCollections";
import DashboardContents from "./_components/DashboardContents";
import DashboardPinned from "./_components/DashboardPinned";
import DashboardReview from "./_components/DashboardReview";
import { getPinnedContent, getRecentContent } from "@/actions/contentActions";
import { getCollectionsList } from "@/actions/collectionActions";
import { getDueContents } from "@/actions/reviseActions";

const DashboardPage = async () => {
  const pinnedContents = await getPinnedContent();
  const recentContents = await getRecentContent();
  const collectionsList = await getCollectionsList();
  const dueContents = await getDueContents();
  if (
    !pinnedContents.success ||
    !recentContents.success ||
    !collectionsList.success ||
    !dueContents.success
  ) {
    return <div>Error loading content</div>;
  }

  const pinned = pinnedContents.data || [];
  const recents = recentContents.data || [];
  const collections = collectionsList.data || [];
  const items = dueContents.data || [];

  return (
    <div className="p-6 space-y-4 h-[calc(100vh-3rem)] md:overflow-y-hidden overflow-auto">
      <h2 className="text-2xl font-semibold">Dashboard</h2>

      <div className="grid grid-cols-10 sm:grid-rows-12 grid-rows-4 gap-3 md:h-[calc(100vh-9rem)] ">
        <div className="col-span-10 sm:row-span-4 row-span-1">
          <DashboardPinned contents={pinned} />
        </div>
        <div className="sm:col-span-5 sm:row-span-4 col-span-10 row-span-1">
          <DashboardCollections collections={collections} />
        </div>
        <div className="sm:col-span-5 sm:row-span-8 col-span-10 row-span-1">
          <DashboardContents contents={recents} />
        </div>
        <div className="sm:col-span-5 sm:row-span-4 col-span-10 row-span-1">
          <DashboardReview items={items} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
