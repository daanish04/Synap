"use server";

import { checkUser } from "@/lib/checkUser";
import db from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export async function getReviseContents() {
  const user = await checkUser();
  if (!user) return { success: false, error: "User not authenticated" };

  try {
    const allReps = await db.spacedRepetition.findMany({
      where: {
        content: { userId: user.id },
      },
      include: { content: true },
      orderBy: { nextReview: "asc" },
    });

    type WithFormattedDate = (typeof allReps)[number] & {
      nextReviewFormatted: string | null;
    };

    // get todayEnd, weekEnd and later dates
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() + 7);
    weekEnd.setHours(23, 59, 59, 999);

    const grouped = {
      due: [] as WithFormattedDate[],
      week: [] as WithFormattedDate[],
      later: [] as WithFormattedDate[],
    };

    for (const rep of allReps) {
      const next = rep.nextReview ? new Date(rep.nextReview) : null;
      if (!next) continue;

      const nextReviewFormatted = rep.nextReview
        ? formatDate(rep.nextReview)
        : null;

      if (next <= todayEnd) grouped.due.push({ ...rep, nextReviewFormatted });
      else if (next <= weekEnd)
        grouped.week.push({ ...rep, nextReviewFormatted });
      else grouped.later.push({ ...rep, nextReviewFormatted });
    }

    return { success: true, data: grouped };
  } catch (error) {
    console.error("getReviseContents error", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getDueContents() {
  const user = await checkUser();
  if (!user) return { success: false, error: "User not authenticated" };

  try {
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const dueReps = await db.spacedRepetition.findMany({
      where: {
        content: { userId: user.id },
        nextReview: { lte: todayEnd },
      },
      include: { content: true },
      orderBy: { nextReview: "asc" },
    });

    return { success: true, data: dueReps };
  } catch (error) {
    console.error("getDueContents error", error);
    return { success: false, error: (error as Error).message };
  }
}
