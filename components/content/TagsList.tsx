"use client";

import React from "react";

const TagsList = ({
  tags,
}: {
  tags: { tag: { id: string; title: string } }[] | undefined;
}) => {
  if (!tags || tags.length === 0) return null;
  return (
    <>
      <div className="flex sm:gap-2 gap-1 overflow-x-auto no-scrollbar">
        {tags.map((t) => (
          <span
            key={t.tag.id}
            className="px-2 py-1 md:text-base text-sm bg-gray-100 rounded"
          >
            {t.tag.title}
          </span>
        ))}
      </div>
      <div className="my-4" />
    </>
  );
};

export default TagsList;
