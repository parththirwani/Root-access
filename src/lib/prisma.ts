import { PrismaClient } from "@/prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const pool = globalForPrisma.pool ?? new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 1, 
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 10000, 
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.pool = pool;
}

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}