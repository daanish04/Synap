import { getPublicContentById } from "@/actions/contentActions";
import ContentBodyClient from "@/components/ContentBodyClient";
import Navbar from "@/components/Navbar";
import React from "react";

type Props = {
  params?: Promise<{ id: string }>;
};

const BrainContentPage = async ({ params }: Props) => {
  const param = await params;
  const id = param?.id;

  if (!id) return <div className="p-6">Content not found.</div>;

  const response = await getPublicContentById(id);

  if (!response.success || !response.data) {
    return <div className="p-6">Content not found.</div>;
  }
  const content = response.data;

  return (
    <>
      <Navbar />
      <div className="p-6">
        <ContentBodyClient content={content} mode="share" />
      </div>
    </>
  );
};

export default BrainContentPage;
