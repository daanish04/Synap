// Spaced Repetition Algorithm based on SuperMemo SM-2
// Simple and effective implementation for your knowledge management app

import { PrismaClient } from "@prisma/client";

export enum ReviewQuality {
  FORGOT = 0, // Completely forgot
  HARD = 1, // Remembered with difficulty
  GOOD = 2, // Remembered with some effort
  EASY = 3, // Remembered easily
  VERY_EASY = 4, // Too easy
}

export interface SpacedRepetitionData {
  interval: number; // Days until next review
  easeFactor: number; // How easy/hard this content is (1.3 - 2.5+)
  nextReview: Date | null;
  repetitions: number; // How many times reviewed
}

export class SpacedRepetitionAlgorithm {
  /**
   * Initialize spaced repetition for new content
   */
  static initializeSpacedRepetition(): SpacedRepetitionData {
    return {
      interval: 1, // Review tomorrow
      easeFactor: 2.5, // Default ease
      nextReview: this.addDays(new Date(), 1),
      repetitions: 0,
    };
  }

  /**
   * Update spaced repetition based on user's review quality
   */
  static updateSpacedRepetition(
    current: SpacedRepetitionData,
    quality: ReviewQuality
  ): SpacedRepetitionData {
    let { interval, easeFactor, repetitions } = current;

    // Update ease factor based on quality (how well user remembered)
    easeFactor = this.calculateNewEaseFactor(easeFactor, quality);

    // If quality is too low (forgot or very hard), reset
    if (quality < ReviewQuality.GOOD) {
      repetitions = 0;
      interval = 1; // Review again tomorrow
    } else {
      repetitions += 1;

      // Calculate new interval based on repetition number
      if (repetitions === 1) {
        interval = 6; // Review in 6 days
      } else if (repetitions === 2) {
        interval = 6; // Review in 6 days again
      } else {
        // Use ease factor for subsequent reviews
        interval = Math.round(interval * easeFactor);
      }
    }

    // Cap the maximum interval (optional - prevents reviews from being too far apart)
    interval = Math.min(interval, 365); // Max 1 year

    return {
      interval,
      easeFactor,
      nextReview: this.addDays(new Date(), interval),
      repetitions,
    };
  }

  /**
   * Calculate new ease factor based on review quality
   */
  private static calculateNewEaseFactor(
    currentEase: number,
    quality: ReviewQuality
  ): number {
    // SM-2 formula: EF' = EF + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))
    const newEase =
      currentEase + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

    // Ensure ease factor stays within reasonable bounds
    return Math.max(1.3, newEase); // Minimum ease factor of 1.3
  }

  /**
   * Check if content is due for review
   */
  static isDueForReview(spacedRepetition: SpacedRepetitionData): boolean {
    if (!spacedRepetition.nextReview) return true;
    return new Date() >= spacedRepetition.nextReview;
  }

  /**
   * Get all content due for review today
   */
  static async getDueContent(userId: string, prisma: PrismaClient) {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of day

    return await prisma.content.findMany({
      where: {
        userId: userId,
        spacedRepetition: {
          OR: [
            { nextReview: null }, // Never reviewed
            { nextReview: { lte: today } }, // Due today or overdue
          ],
        },
      },
      include: {
        spacedRepetition: true,
        tags: { include: { tag: true } },
      },
      orderBy: {
        spacedRepetition: {
          nextReview: "asc", // Most overdue first
        },
      },
    });
  }

  /**
   * Get review statistics for user
   */
  static async getReviewStats(userId: string, prisma: PrismaClient) {
    const today = new Date();
    const tomorrow = this.addDays(today, 1);
    const nextWeek = this.addDays(today, 7);

    const [dueToday, dueTomorrow, dueThisWeek, total] = await Promise.all([
      // Due today
      prisma.spacedRepetition.count({
        where: {
          content: { userId },
          OR: [{ nextReview: null }, { nextReview: { lte: today } }],
        },
      }),

      // Due tomorrow
      prisma.spacedRepetition.count({
        where: {
          content: { userId },
          nextReview: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),

      // Due this week
      prisma.spacedRepetition.count({
        where: {
          content: { userId },
          nextReview: {
            gte: today,
            lt: nextWeek,
          },
        },
      }),

      // Total items in spaced repetition
      prisma.spacedRepetition.count({
        where: {
          content: { userId },
        },
      }),
    ]);

    return {
      dueToday,
      dueTomorrow,
      dueThisWeek,
      total,
    };
  }

  /**
   * Utility function to add days to a date
   */
  private static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Get human-readable time until next review
   */
  static getTimeUntilNextReview(nextReview: Date | null): string {
    if (!nextReview) return "Not scheduled";

    const now = new Date();
    const diff = nextReview.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0)
      return `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} overdue`;
    if (days === 0) return "Due today";
    if (days === 1) return "Due tomorrow";
    return `Due in ${days} day${days === 1 ? "" : "s"}`;
  }
}

// Example API route usage:
/*
// Enable spaced repetition for content
export async function enableSpacedRepetition(contentId: string) {
  const srData = SpacedRepetitionAlgorithm.initializeSpacedRepetition();
  
  return await prisma.spacedRepetition.create({
    data: {
      contentId,
      interval: srData.interval,
      easeFactor: srData.easeFactor,
      nextReview: srData.nextReview
    }
  });
}

// Review content
export async function reviewContent(contentId: string, quality: ReviewQuality) {
  const current = await prisma.spacedRepetition.findUnique({
    where: { contentId }
  });
  
  if (!current) throw new Error("Content not in spaced repetition");
  
  const updated = SpacedRepetitionAlgorithm.updateSpacedRepetition({
    interval: current.interval,
    easeFactor: current.easeFactor,
    nextReview: current.nextReview,
    repetitions: current.repetitions || 0
  }, quality);
  
  return await prisma.spacedRepetition.update({
    where: { contentId },
    data: {
      interval: updated.interval,
      easeFactor: updated.easeFactor,
      nextReview: updated.nextReview,
      repetitions: updated.repetitions
    }
  });
}
*/
