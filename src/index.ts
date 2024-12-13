import { instrument } from "@fiberplane/hono-otel";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { Hono } from "hono";
import { user } from "./db/schema";
import { contextStorage } from "hono/context-storage";
import { auth } from "./lib/auth";

type Bindings = {
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
};

export type Env = {
  Bindings: Bindings;
};

const app = new Hono<Env>({ strict: true }).basePath("/api");
app.use("*", contextStorage());

app.on(["POST", "GET"], "/auth/**", (c) => auth().handler(c.req.raw));

app.get("/", (c) => {
  return c.text("Honc! 🪿");
});

app.get("/api/users", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  return c.json({
    users: await db.select().from(user),
  });
});

export default instrument(app);
