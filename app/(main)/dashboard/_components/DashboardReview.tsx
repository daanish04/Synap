"use client";

import { ContentItem, SR } from "@/lib/types";
import { ChevronsRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

type ServerContent = Partial<ContentItem>;
type ReviseItem = SR & { content: ServerContent };
const DashboardReview = ({ items }: { items: ReviseItem[] }) => {
  const router = useRouter();

  return (
    <div className="h-full px-4 py-2 border rounded-xl relative">
      <div className="absolute -right-3 -top-3 flex items-center rounded-xl bg-muted hover:bg-muted/80 transition-colors duration-300 cursor-pointer p-1.5 border">
        <Link href="/revise">
          <ChevronsRight className="h-5 w-5" />
        </Link>
      </div>
      <h3 className="text-xl font-semibold mb-2">
        <span className="text-red-700 relative">
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent to-blue-600 rounded"></div>{" "}
          Due
        </span>{" "}
        To Review
      </h3>
      <div className="w-full h-full flex flex-col gap-2">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-center italic">
              No items due
            </p>
          </div>
        ) : (
          <ul className="list-none flex flex-col gap-2">
            {items.map((item) => (
              <li
                key={item.content.id}
                className="flex-1 p-2 border rounded-md flex justify-between items-center"
              >
                <h3
                  className="font-medium hover:cursor-pointer hover:underline"
                  onClick={() => router.push(`/content/${item.content.id}`)}
                >
                  {item.content.title || "Untitled"}
                </h3>
                <p className="text-sm">{item.repetitions || "0"} reviews</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardReview;
