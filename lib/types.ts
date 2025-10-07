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

export type CollectionSummary = {
  id: string;
  title: string;
  isPublic: boolean;
  createdAtFormatted: string;
  contentsCount: number;
};

export type CollectionForContent = {
  id: string;
  title: string;
  included: boolean;
};

export type SR = {
  interval: number;
  easeFactor: number;
  repetitions: number;
  nextReview: Date | string | null;
  nextReviewFormatted?: string | null;
  isDueToday?: boolean;
  enabled: boolean;
};
