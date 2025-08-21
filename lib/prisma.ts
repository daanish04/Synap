import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// Create or retrieve the singleton instance
export const prisma = globalThis.prisma || new PrismaClient();

// Ensure the instance is not recreated in development
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export default prisma;
