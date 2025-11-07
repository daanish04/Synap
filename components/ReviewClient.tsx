"use client";

import { ContentItem, SR } from "@/lib/types";
import { useRouter } from "next/navigation";
import React from "react";
import { Separator } from "./ui/separator";

type ServerContent = Partial<ContentItem>;
type ReviseItem = SR & { content: ServerContent };
type ReviseContents = Record<"due" | "week" | "later", ReviseItem[]>;

const ReviewClientPage = ({ contents }: { contents: ReviseContents }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      {/* Due */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-red-500">Due</h2>
        {contents.due.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center">
            No items to review.
          </div>
        ) : (
          <ul className="list-none flex flex-col gap-2">
            {contents.due.map((item) => (
              <li
                key={item.content.id}
                className="flex-1 p-3 border rounded-md grid grid-cols-3"
              >
                <h3
                  className="font-medium hover:cursor-pointer hover:underline"
                  onClick={() => router.push(`/content/${item.content.id}`)}
                >
                  {item.content.title || "Untitled"}
                </h3>
                <p className="text-sm text-muted-foreground text-end">
                  Next Review: {item.nextReviewFormatted || "N/A"}
                </p>
                <p className="text-sm text-end">
                  {item.repetitions || "0"} reviews
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Separator />
      {/* Week */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-foreground">Week</h2>
        {contents.week.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center">
            No items to review.
          </div>
        ) : (
          <ul className="list-none flex flex-col gap-2">
            {contents.week.map((item) => (
              <li
                key={item.content.id}
                className="flex-1 p-3 border rounded-md grid grid-cols-3"
              >
                <h3
                  className="font-medium hover:cursor-pointer hover:underline"
                  onClick={() => router.push(`/content/${item.content.id}`)}
                >
                  {item.content.title || "Untitled"}
                </h3>
                <p className="text-sm text-muted-foreground text-end">
                  Next Review: {item.nextReviewFormatted || "N/A"}
                </p>
                <p className="text-sm text-end">
                  {item.repetitions || "0"} reviews
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Separator />
      {/* Later */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-foreground">Later</h2>
        {contents.later.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center">
            No items to review.
          </div>
        ) : (
          <ul className="list-none flex flex-col gap-2">
            {contents.later.map((item) => (
              <li
                key={item.content.id}
                className="flex-1 p-3 border rounded-md grid grid-cols-3"
              >
                <h3
                  className="font-medium hover:cursor-pointer hover:underline"
                  onClick={() => router.push(`/content/${item.content.id}`)}
                >
                  {item.content.title || "Untitled"}
                </h3>
                <p className="text-sm text-muted-foreground text-end">
                  Next Review: {item.nextReviewFormatted || "N/A"}
                </p>
                <p className="text-sm text-end">
                  {item.repetitions || "0"} reviews
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ReviewClientPage;
