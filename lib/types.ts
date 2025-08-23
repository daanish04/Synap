export type Tag = { id: string; title: string };

export type ContentItem = {
  id: string;
  title: string;
  description: string | null;
  link: string | null;
  isFav: boolean;
  isPinned: boolean;
  tags: { tag: Tag }[];
};
