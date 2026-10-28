import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl =
  process.env.DATABASE_URL ||
  (process.env.NODE_ENV === "production" ? undefined : "postgresql://postgres:postgres@127.0.0.1:5432/app_db");

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required in production. Configure a PostgreSQL connection string in your hosting environment.");
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
