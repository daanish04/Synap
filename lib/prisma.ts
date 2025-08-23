import { PrismaClient } from "./generated/prisma";

declare global {
  var prisma: PrismaClient | undefined;
}

// Create or retrieve the singleton instance
export const db = globalThis.prisma || new PrismaClient();

// Ensure the instance is not recreated in development
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

export default db;
