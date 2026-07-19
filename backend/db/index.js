import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

const isLocalhost = databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1");

export const pool = mysql.createPool({
  uri: databaseUrl,
  ssl: isLocalhost ? undefined : {
    rejectUnauthorized: false
  }
});

export const db = drizzle(pool);
