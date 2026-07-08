import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
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
