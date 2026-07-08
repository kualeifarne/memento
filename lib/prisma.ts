import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});

function createPrismaClient() {
  return new PrismaClient({ adapter });
}

const cachedPrisma = globalForPrisma.prisma;
const prisma =
  cachedPrisma && "reviewLog" in cachedPrisma && "learnState" in cachedPrisma
    ? cachedPrisma
    : createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export { prisma };
