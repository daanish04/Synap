import ContentBodyClient from "@/components/ContentBodyClient";
import { getContentById } from "@/actions/contentActions";
import React from "react";

type Props = {
  params: { id: string };
};

export default async function ContentBodyPage({ params }: Props) {
  const { id } = await params;
  const content = await getContentById(id);

  if (!content) {
    return <div className="p-6">This content doesn&apos;t exist.</div>;
  }

  return (
    <div className="p-6">
      <ContentBodyClient content={content} />
    </div>
  );
}
