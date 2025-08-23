import { currentUser } from "@clerk/nextjs/server";
import db from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    const newUser = await db.user.create({
      data: {
        clerkId: user.id,
        name: name,
        username: user.emailAddresses[0].emailAddress,
      },
    });
    return newUser;
  } catch (error) {
    console.log(error);
    return null;
  }
};
