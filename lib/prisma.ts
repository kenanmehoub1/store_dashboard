import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// ✅ مهم: تأخير الإنشاء (Lazy safe)
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// ❗ مهم جداً: حماية من build بدون env
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

export default prisma;