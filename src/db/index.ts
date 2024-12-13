import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { getContext } from "hono/context-storage";
import { Env } from "..";

import * as schema from "./schema";

export const db = () => {
  const { DATABASE_URL } = getContext<Env>().env;
  const sql = neon(DATABASE_URL);
  return drizzle(sql, { schema });
};
