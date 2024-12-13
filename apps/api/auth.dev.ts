import { neon } from "@neondatabase/serverless";
import { getAuth } from "./src/lib/auth";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

config({ path: ".dev.vars" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export const auth = getAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  db,
});
