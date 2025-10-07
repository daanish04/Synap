"use server";

import { checkUser } from "@/lib/checkUser";
import db from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { formatDate } from "@/lib/utils";
import { SpacedRepetitionAlgorithm, ReviewQuality } from "@/lib/sralgo";

export async function getSRForContent(contentId: string) {
  const user = await checkUser();
  if (!user) return { success: false, error: "User not authenticated" };
  if (!contentId) return { success: false, error: "Invalid content" };

  try {
    const content = await db.content.findFirst({
      where: { id: contentId, userId: user.id },
      include: { spacedRepetition: true },
    });
    if (!content) return { success: false, error: "Content not found" };

    const sr = content.spacedRepetition;
    if (!sr)
      return {
        success: true,
        data: { enabled: false },
      };

    const nextReviewFormatted = sr.nextReview
      ? formatDate(sr.nextReview)
      : null;

    const today = new Date();
    const isDueToday = sr.nextReview
      ? sr.nextReview <=
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          23,
          59,
          59,
          999
        )
      : true;

    return {
      success: true,
      data: {
        enabled: true,
        interval: sr.interval,
        easeFactor: sr.easeFactor,
        repetitions: sr.repetitions,
        nextReview: sr.nextReview,
        nextReviewFormatted,
        isDueToday,
      },
    };
  } catch (error) {
    console.error("getSRForContent error", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function enableSRForContent(contentId: string) {
  const user = await checkUser();
  if (!user) return { success: false, error: "User not authenticated" };
  if (!contentId) return { success: false, error: "Invalid content" };

  try {
    const content = await db.content.findFirst({
      where: { id: contentId, userId: user.id },
      include: { spacedRepetition: true },
    });
    if (!content) return { success: false, error: "Content not found" };

    if (content.spacedRepetition) return { success: true };

    const init = SpacedRepetitionAlgorithm.initializeSpacedRepetition();
    await db.spacedRepetition.create({
      data: {
        contentId: contentId,
        interval: init.interval,
        easeFactor: init.easeFactor,
        nextReview: init.nextReview,
        repetitions: init.repetitions,
      },
    });

    revalidatePath(`/content/${contentId}`);
    return { success: true };
  } catch (error) {
    console.error("enableSRForContent error", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function disableSRForContent(contentId: string) {
  const user = await checkUser();
  if (!user) return { success: false, error: "User not authenticated" };
  if (!contentId) return { success: false, error: "Invalid content" };

  try {
    const content = await db.content.findFirst({
      where: { id: contentId, userId: user.id },
      include: { spacedRepetition: true },
    });
    if (!content) return { success: false, error: "Content not found" };

    if (content.spacedRepetition) {
      await db.spacedRepetition.delete({ where: { contentId } });
    }

    revalidatePath(`/content/${contentId}`);
    return { success: true };
  } catch (error) {
    console.error("disableSRForContent error", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function submitSRReview(contentId: string, quality: number) {
  const user = await checkUser();
  if (!user) return { success: false, error: "User not authenticated" };
  if (!contentId) return { success: false, error: "Invalid content" };

  try {
    const sr = await db.spacedRepetition.findUnique({ where: { contentId } });
    if (!sr) return { success: false, error: "Spaced repetition not enabled" };

    const updated = SpacedRepetitionAlgorithm.updateSpacedRepetition(
      {
        interval: sr.interval,
        easeFactor: sr.easeFactor,
        nextReview: sr.nextReview,
        repetitions: sr.repetitions || 0,
      },
      quality as ReviewQuality
    );

    const result = await db.spacedRepetition.update({
      where: { contentId },
      data: {
        interval: updated.interval,
        easeFactor: updated.easeFactor,
        nextReview: updated.nextReview,
        repetitions: updated.repetitions,
      },
    });

    const nextReviewFormatted = result.nextReview
      ? formatDate(result.nextReview)
      : null;

    revalidatePath(`/content/${contentId}`);
    return {
      success: true,
      data: {
        interval: result.interval,
        easeFactor: result.easeFactor,
        repetitions: result.repetitions,
        nextReview: result.nextReview,
        nextReviewFormatted,
      },
    };
  } catch (error) {
    console.error("submitSRReview error", error);
    return { success: false, error: (error as Error).message };
  }
}
