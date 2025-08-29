import ContentBodyClient from "@/components/ContentBodyClient";
import { getContentById } from "@/actions/contentActions";
import React from "react";

type Props = {
  params?: Promise<{ id: string }>;
};

export default async function ContentBodyPage({ params }: Props) {
  const param = await params;
  const id = param?.id;

  if (!id) return <div className="p-6">This content doesn&apos;t exist.</div>;

  const response = await getContentById(id);

  if (!response.success || !response.data) {
    return <div className="p-6">This content doesn&apos;t exist.</div>;
  }

  const content = response.data;

  return (
    <div className="p-6">
      <ContentBodyClient content={content} />
    </div>
  );
}
