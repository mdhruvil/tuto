import { instrument } from "@fiberplane/hono-otel";
import { Hono } from "hono";
import { contextStorage } from "hono/context-storage";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { auth } from "./lib/auth";
import { documentRouter } from "./routes/document";
import { knowledgeBaseRouter } from "./routes/knowledge-base";

type Bindings = {
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
};

type Variables = {
  user: ReturnType<typeof auth>["$Infer"]["Session"]["user"] | null;
  session: ReturnType<typeof auth>["$Infer"]["Session"]["session"] | null;
};

export type Env = {
  Bindings: Bindings;
  Variables: Variables;
};

const app = new Hono<Env>({ strict: true })
  .basePath("/api")
  .use("*", contextStorage())
  .use("*", async (c, next) => {
    const session = await auth().api.getSession({ headers: c.req.raw.headers });
    if (!session) {
      c.set("user", null);
      c.set("session", null);
      return next();
    }

    c.set("user", session.user);
    c.set("session", session.session);
    return next();
  })
  .on(["POST", "GET"], "/auth/**", (c) => auth().handler(c.req.raw))
  .get("/", (c) => {
    return c.text("Honc! 🪿");
  })
  .route("/knowledge-base", knowledgeBaseRouter)
  .route("/knowledge-base/:knowledgeBaseId/document", documentRouter)
  .onError((err, c) => {
    console.error(err);
    if (err instanceof ZodError) {
      return c.json(
        {
          message: "Validation failed",
          errors: err.flatten(),
          success: false,
        },
        400
      );
    }
    if (err instanceof HTTPException) {
      return c.json({ message: err.message, success: false }, err.status);
    }
    return c.json({ message: "Internal server error", success: false }, 500);
  });

export default instrument(app);
