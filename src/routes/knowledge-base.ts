import { Hono } from "hono";
import { Env } from "..";
import { DBKnowledgeBase } from "../db/queries/knowledge-base";
import { zValidator } from "../middleware/zod";
import {
  knowledgeBaseInsertSchema,
  knowledgeBaseUpdateSchema,
} from "../db/validators";
import { z } from "zod";

const app = new Hono<Env>();

app.get("/", async (c) => {
  const session = await c.get("session");
  const user = await c.get("user");

  if (!user) {
    return c.json({ message: "Unauthorized", success: false }, 401);
  }

  const knowledgeBases = await DBKnowledgeBase.getAll({
    userId: user.id,
  });

  return c.json({ data: knowledgeBases, success: true });
});

app.post(
  "/",
  zValidator("json", knowledgeBaseInsertSchema.omit({ createdBy: true })),
  async (c) => {
    const user = await c.get("user");

    if (!user) {
      return c.json({ message: "Unauthorized", success: false }, 401);
    }

    const knowledgeBase = await DBKnowledgeBase.create({
      data: {
        ...c.req.valid("json"),
        createdBy: user.id,
      },
    });

    return c.json({ data: knowledgeBase, success: true }, 201);
  }
);

app.get(
  "/:id",
  zValidator("param", z.object({ id: z.coerce.number() })),
  async (c) => {
    const user = await c.get("user");

    if (!user) {
      return c.json({ message: "Unauthorized", success: false }, 401);
    }

    const knowledgeBase = await DBKnowledgeBase.getById({
      id: c.req.valid("param").id,
      userId: user.id,
    });

    if (!knowledgeBase) {
      return c.json(
        { message: "Knowledge base not found", success: false },
        404
      );
    }

    return c.json({ data: knowledgeBase, success: true });
  }
);

app.put(
  "/:id",
  zValidator("param", z.object({ id: z.coerce.number() })),
  zValidator("json", knowledgeBaseUpdateSchema),
  async (c) => {
    const user = await c.get("user");

    if (!user) {
      return c.json({ message: "Unauthorized", success: false }, 401);
    }

    const knowledgeBase = await DBKnowledgeBase.update({
      id: c.req.valid("param").id,
      data: c.req.valid("json"),
      userId: user.id,
    });

    if (!knowledgeBase) {
      return c.json(
        { message: "Knowledge base not found", success: false },
        404
      );
    }

    return c.json({ data: knowledgeBase, success: true });
  }
);

app.delete(
  "/:id",
  zValidator("param", z.object({ id: z.coerce.number() })),
  async (c) => {
    const user = await c.get("user");

    if (!user) {
      return c.json({ message: "Unauthorized", success: false }, 401);
    }

    const knowledgeBase = await DBKnowledgeBase.delete({
      id: c.req.valid("param").id,
      userId: user.id,
    });

    if (!knowledgeBase) {
      return c.json(
        { message: "Knowledge base not found", success: false },
        404
      );
    }

    return c.json({ data: knowledgeBase, success: true });
  }
);

export { app as knowledgeBaseRouter };
