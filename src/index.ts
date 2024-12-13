import { instrument } from "@fiberplane/hono-otel";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { Hono } from "hono";
import { users } from "./db/schema";
import { contextStorage } from "hono/context-storage";

type Bindings = {
  DATABASE_URL: string;
};

type Env = {
  Bindings: Bindings;
};

const app = new Hono<Env>();
app.use("*", contextStorage());

app.get("/", (c) => {
  return c.text("Honc! 🪿");
});

app.get("/api/users", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  return c.json({
    users: await db.select().from(users),
  });
});

export default instrument(app);
