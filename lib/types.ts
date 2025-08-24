export type Tag = { id: string; title: string };

export type ContentItem = {
  id: string;
  title: string;
  description: string | null;
  link: string | null;
  isFav: boolean;
  isPinned: boolean;
  tags: { tag: Tag }[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
  // formatted date strings to avoid hydration errors
  createdAtFormatted?: string;
  updatedAtFormatted?: string;
};
