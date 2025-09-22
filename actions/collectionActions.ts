"use server";

import { checkUser } from "@/lib/checkUser";
import db from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { formatDate } from "@/lib/utils";

export async function getCollectionsList() {
  const user = await checkUser();
  if (!user) return { success: false, error: "User not authenticated" };

  try {
    const collections = await db.collection.findMany({
      where: { userId: user.id },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      include: { _count: { select: { contents: true } } },
    });

    const data = collections.map((c) => ({
      ...c,
      createdAtFormatted: formatDate(c.createdAt),
      contentsCount: c._count.contents,
    }));

    return { success: true, data };
  } catch (error) {
    console.error("getCollections error", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getCollectionsForContent(contentId: string) {
  const user = await checkUser();
  if (!user) return { success: false, error: "User not authenticated" };
  if (!contentId) return { success: false, error: "Invalid content" };

  try {
    const collections = await db.collection.findMany({
      where: { userId: user.id },
      include: { contents: { where: { contentId } } },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    });

    const data = collections.map((c) => ({
      id: c.id,
      title: c.title,
      included: c.contents.length > 0,
    }));

    return { success: true, data };
  } catch (error) {
    console.error("getCollectionsForContent error", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function toggleContentInCollection(
  collectionId: string,
  contentId: string
) {
  const user = await checkUser();
  if (!user) return { success: false, error: "User not authenticated" };
  if (!collectionId || !contentId)
    return { success: false, error: "Select a valid collection" };

  try {
    await db.$transaction(async (tx) => {
      const owned = await tx.content.findFirst({
        where: { id: contentId, userId: user.id },
      });
      if (!owned) throw new Error("Content not found");

      const existing = await tx.contentCollection.findUnique({
        where: { contentId_collectionId: { contentId, collectionId } },
      });

      if (existing) {
        await tx.contentCollection.delete({
          where: { contentId_collectionId: { contentId, collectionId } },
        });
      } else {
        await tx.contentCollection.create({
          data: { contentId, collectionId },
        });
      }
    });

    revalidatePath("/collections");
    revalidatePath(`/collections/${collectionId}`);
    revalidatePath(`/content/${contentId}`);
    return { success: true };
  } catch (error) {
    console.error("toggleContentInCollection error", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getCollectionById(id: string) {
  const user = await checkUser();
  if (!user) return { success: false, error: "User not authenticated" };
  if (!id) return { success: false, error: "Collection not found" };

  try {
    const collection = await db.collection.findFirst({
      where: { id, userId: user.id },
    });
    if (!collection) return { success: false, error: "Collection not found" };

    const contents = await db.content.findMany({
      where: { userId: user.id, collections: { some: { collectionId: id } } },
      include: { tags: { include: { tag: true } } },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    });

    const tags = await db.tag.findMany({
      where: {
        contents: {
          some: {
            content: {
              userId: user.id,
              collections: { some: { collectionId: id } },
            },
          },
        },
      },
      distinct: ["title"],
    });

    return {
      success: true,
      data: {
        collection: {
          ...collection,
          createdAtFormatted: formatDate(collection.createdAt),
        },
        contents,
        tags,
      },
    };
  } catch (error) {
    console.error("getCollectionById error", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function createCollection(formData: FormData) {
  const user = await checkUser();
  if (!user) return { success: false, error: "User not authenticated" };

  const title = formData.get("title")?.toString().trim() || "";
  const isPublic =
    (formData.get("isPublic")?.toString() || "false").toLowerCase() === "true";

  if (title === "") return { success: false, error: "Title is required" };

  try {
    await db.collection.create({
      data: {
        title,
        isPublic,
        userId: user.id,
      },
    });

    revalidatePath("/collections");
    return { success: true };
  } catch (error) {
    console.error("createCollection error", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteCollection(id: string) {
  const user = await checkUser();
  if (!user) return { success: false, error: "User not authenticated" };
  if (!id) return { success: false, error: "Collection not found" };

  try {
    const collection = await db.collection.findFirst({
      where: { userId: user.id, id },
    });
    if (!collection) return { success: false, error: "Collection not found" };

    await db.$transaction(async (tx) => {
      await tx.contentCollection.deleteMany({ where: { collectionId: id } });
      await tx.collection.deleteMany({ where: { id } });
    });

    revalidatePath("/collections");
    return { success: true };
  } catch (error) {
    console.error("deleteCollection error", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function updateCollection(formData: FormData) {
  const user = await checkUser();
  if (!user) return { success: false, error: "User not authenticated" };

  const id = formData.get("id")?.toString();
  if (!id) return { success: false, error: "Collection not found" };

  const title = formData.get("title")?.toString().trim() || "";
  const isPublic =
    (formData.get("isPublic")?.toString() || "false").toLowerCase() === "true";

  if (title === "") return { success: false, error: "Title is required" };

  try {
    const collection = await db.collection.findFirst({
      where: { userId: user.id, id },
    });
    if (!collection) return { success: false, error: "Collection not found" };

    await db.collection.update({
      where: { id, userId: user.id },
      data: { title, isPublic },
    });

    revalidatePath("/collections");
    revalidatePath(`/collections/${id}`);
    return { success: true };
  } catch (error) {
    console.error("updateCollection error", error);
    return { success: false, error: (error as Error).message };
  }
}
