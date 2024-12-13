import { Hono } from "hono";
import { Env } from "..";
import { DBKnowledgeBase } from "../db/queries/knowledge-base";
import { zValidator } from "../middleware/zod";
import { z } from "zod";
import {
  knowledgeBaseInsertSchema,
  knowledgeBaseUpdateSchema,
} from "@tuto/shared";

const app = new Hono<Env>()
  .get("/", async (c) => {
    const user = await c.get("user");

    if (!user) {
      return c.json({ message: "Unauthorized", success: false }, 401);
    }

    const knowledgeBases = await DBKnowledgeBase.getAll({
      userId: user.id,
    });

    return c.json({ data: knowledgeBases, success: true });
  })
  .post(
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
  )
  .get(
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
  )
  .put(
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
  )
  .delete(
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
