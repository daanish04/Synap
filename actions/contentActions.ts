"use server";

import { revalidatePath } from "next/cache";
import { checkUser } from "@/lib/checkUser";
import db from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export async function addContent(formData: FormData) {
  const user = await checkUser();
  if (!user) return { success: false, error: "User not authenticated" };

  const title = formData.get("title")?.toString().trim() || "";
  const description = formData.get("description")?.toString().trim() || "";
  const link = formData.get("link")?.toString() || null;
  const tagsRaw = formData.get("tags")?.toString() || "";

  if (title === "") return { success: false, error: "Title is required" };

  try {
    // Prepare normalized, deduplicated tags
    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    // Use a transaction: create content, create missing tags in bulk, then link via createMany
    await db.$transaction(async (tx) => {
      const content = await tx.content.create({
        data: {
          title,
          description: description || null,
          link: link || null,
          userId: user.id,
        },
      });

      if (tags.length === 0) return;

      // Find which tags already exist
      const existing = await tx.tag.findMany({
        where: { title: { in: tags } },
      });
      const existingTitles = new Set(existing.map((e) => e.title));

      // Create missing tags in bulk (skipDuplicates as a safeguard)
      const toCreate = tags.filter((t) => !existingTitles.has(t));
      if (toCreate.length > 0) {
        await tx.tag.createMany({
          data: toCreate.map((t) => ({ title: t })),
          skipDuplicates: true,
        });
      }

      // Re-fetch all tag records for the given titles to get their ids
      const allTags = await tx.tag.findMany({ where: { title: { in: tags } } });

      // Create many contentTag links; skipDuplicates avoids unique constraint failures
      const ctData = allTags.map((tag) => ({
        contentId: content.id,
        tagId: tag.id,
      }));

      if (ctData.length > 0) {
        await tx.contentTag.createMany({ data: ctData, skipDuplicates: true });
      }
    });

    revalidatePath("/content");
    return { success: true };
  } catch (error) {
    console.error("addContent error", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function toggleFavorite(id: string) {
  const user = await checkUser();
  if (!user) return { success: false, error: "User not authenticated" };
  if (!id) return { success: false, error: "Invalid Content. Failed to like." };

  try {
    // Use transaction to avoid race conditions: read -> update atomically inside tx
    await db.$transaction(async (tx) => {
      const content = await tx.content.findFirst({
        where: { id, userId: user.id },
      });
      if (!content) throw new Error("Content not found");

      await tx.content.update({
        where: { id },
        data: { isFav: !content.isFav },
      });
    });

    revalidatePath("/content");
    revalidatePath(`/content/${id}`);
    return { success: true };
  } catch (error) {
    console.error("toggleFavorite error", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function togglePin(id: string) {
  const user = await checkUser();
  if (!user) return { success: false, error: "User not authenticated" };
  if (!id) return { success: false, error: "Invalid Content. Failed to pin." };

  try {
    await db.$transaction(async (tx) => {
      const content = await tx.content.findFirst({
        where: { id, userId: user.id },
      });
      if (!content) throw new Error("Content not found");

      if (!content.isPinned) {
        const pinnedCount = await tx.content.count({
          where: { userId: user.id, isPinned: true },
        });
        if (pinnedCount >= 5) {
          throw new Error(
            "You can only pin up to 5 items. Unpin something first."
          );
        }
      }

      await tx.content.update({
        where: { id },
        data: { isPinned: !content.isPinned },
      });
    });

    revalidatePath("/content");
    revalidatePath(`/content/${id}`);
    return { success: true };
  } catch (error) {
    console.error("togglePin error", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getUserContent() {
  const user = await checkUser();
  if (!user) return { success: false, error: "User not authenticated" };

  try {
    const contents = await db.content.findMany({
      where: { userId: user.id },
      include: { tags: { include: { tag: true } } },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    });
    const tags = await db.tag.findMany({
      where: { contents: { some: { content: { userId: user.id } } } },
      distinct: ["title"],
    });

    return { success: true, data: { contents, tags } };
  } catch (error) {
    console.error("getUserContent error", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getRecentContent() {
  const user = await checkUser();
  if (!user) return { success: false, error: "User not authenticated" };
  try {
    const contents = await db.content.findMany({
      where: { userId: user.id },
      include: { tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    return { success: true, data: contents };
  } catch (error) {
    console.error("getRecentContent error", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getContentById(id: string) {
  const user = await checkUser();
  if (!user) return { success: false, error: "User not authenticated" };
  if (!id) return { success: false, error: "Content not found." };

  try {
    const content = await db.content.findFirst({
      where: { id, userId: user.id },
      include: { tags: { include: { tag: true } } },
    });
    if (!content) return { success: false, error: "Content not found" };

    const createdAtFormatted = formatDate(content.createdAt);
    const updatedAtFormatted = formatDate(content.updatedAt);

    return {
      success: true,
      data: {
        ...content,
        createdAtFormatted,
        updatedAtFormatted,
      },
    };
  } catch (error) {
    console.error("getContentById error", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getFavoriteContent() {
  const user = await checkUser();
  if (!user) return { success: false, error: "User not authenticated" };

  try {
    const contents = await db.content.findMany({
      where: { userId: user.id, isFav: true },
      include: { tags: { include: { tag: true } } },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    });

    if (contents.length === 0) throw new Error("No favorite content found");

    const tags = await db.tag.findMany({
      where: { contents: { some: { content: { userId: user.id } } } },
      distinct: ["title"],
    });

    return { success: true, data: { contents, tags } };
  } catch (error) {
    console.error("getFavoriteContent error", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getPinnedContent() {
  const user = await checkUser();
  if (!user) return { success: false, error: "User not authenticated" };
  try {
    const contents = await db.content.findMany({
      where: { userId: user.id, isPinned: true },
      include: { tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: contents };
  } catch (error) {
    console.error("getPinnedContent error", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function updateContent(formData: FormData) {
  const user = await checkUser();
  if (!user) return { success: false, error: "User not authenticated" };

  const id = formData.get("id")?.toString();
  if (!id) return { success: false, error: "Failed to update content." };

  const title = formData.get("title")?.toString().trim() || "";
  const description = formData.get("description")?.toString().trim() || "";
  const link = formData.get("link")?.toString() || null;
  const tagsRaw = formData.get("tags")?.toString() || "";

  if (title === "") return { success: false, error: "Title is required" };

  try {
    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    await db.$transaction(async (tx) => {
      const existing = await tx.content.findFirst({
        where: { id, userId: user.id },
      });
      if (!existing) throw new Error("Content not found");

      await tx.content.update({
        where: { id },
        data: { title, description: description || null, link: link || null },
      });

      await tx.contentTag.deleteMany({ where: { contentId: id } });

      if (tags.length === 0) return;

      const existingTags = await tx.tag.findMany({
        where: { title: { in: tags } },
      });
      const existingTitles = new Set(existingTags.map((e) => e.title));

      const toCreate = tags.filter((t) => !existingTitles.has(t));
      if (toCreate.length > 0) {
        await tx.tag.createMany({
          data: toCreate.map((t) => ({ title: t })),
          skipDuplicates: true,
        });
      }

      const allTags = await tx.tag.findMany({ where: { title: { in: tags } } });
      const ctData = allTags.map((tag) => ({ contentId: id, tagId: tag.id }));
      if (ctData.length > 0) {
        await tx.contentTag.createMany({ data: ctData, skipDuplicates: true });
      }
    });

    revalidatePath("/content");
    revalidatePath(`/content/${id}`);
    return { success: true };
  } catch (error) {
    console.error("updateContent error", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteContent(id: string) {
  const user = await checkUser();
  if (!user) return { success: false, error: "User not authenticated" };
  if (!id)
    return { success: false, error: "Inavlid Content. Failed to delete." };

  try {
    await db.$transaction(async (tx) => {
      await tx.content.deleteMany({ where: { id, userId: user.id } });
    });

    revalidatePath("/content");
    revalidatePath(`/content/${id}`);
    return { success: true };
  } catch (error) {
    console.error("deleteContent error", error);
    return { success: false, error: (error as Error).message };
  }
}
