import { Hono } from "hono";
import { Env } from "..";
import { DBDocument } from "../db/queries/documents";
import { zValidator } from "../middleware/zod";
import { z } from "zod";
import { documentInsertSchema, documentUpdateSchema } from "@tuto/shared";

const app = new Hono<Env>();

app.get(
  "/",
  zValidator("param", z.object({ knowledgeBaseId: z.coerce.number() })),
  async (c) => {
    const user = await c.get("user");

    if (!user) {
      return c.json({ message: "Unauthorized", success: false }, 401);
    }

    const documents = await DBDocument.getAll({
      knowledgeBaseId: c.req.valid("param").knowledgeBaseId,
      userId: user.id,
    });

    return c.json({ data: documents, success: true });
  }
);

app.get(
  "/:id",
  zValidator(
    "param",
    z.object({ id: z.coerce.number(), knowledgeBaseId: z.coerce.number() })
  ),
  async (c) => {
    const user = await c.get("user");
    console.log(c.req.valid("param"));
    if (!user) {
      return c.json({ message: "Unauthorized", success: false }, 401);
    }

    const document = await DBDocument.getById({
      id: c.req.valid("param").id,
      knowledgeBaseId: c.req.valid("param").knowledgeBaseId,
      userId: user.id,
    });

    if (!document) {
      return c.json({ message: "Document not found", success: false }, 404);
    }

    return c.json({ data: document, success: true });
  }
);

app.post(
  "/",
  zValidator("param", z.object({ knowledgeBaseId: z.coerce.number() })),
  zValidator("json", documentInsertSchema.omit({ createdBy: true })),
  async (c) => {
    const user = await c.get("user");

    if (!user) {
      return c.json({ message: "Unauthorized", success: false }, 401);
    }

    const document = await DBDocument.create({
      data: {
        ...c.req.valid("json"),
        createdBy: user.id,
      },
    });

    return c.json({ data: document, success: true }, 201);
  }
);

app.put(
  "/:id",
  zValidator(
    "param",
    z.object({ id: z.coerce.number(), knowledgeBaseId: z.coerce.number() })
  ),
  zValidator("json", documentUpdateSchema),
  async (c) => {
    const user = await c.get("user");

    if (!user) {
      return c.json({ message: "Unauthorized", success: false }, 401);
    }

    const document = await DBDocument.update({
      id: c.req.valid("param").id,
      userId: user.id,
      knowledgeBaseId: c.req.valid("param").knowledgeBaseId,
      data: c.req.valid("json"),
    });

    if (!document) {
      return c.json({ message: "Document not found", success: false }, 404);
    }

    return c.json({ data: document, success: true });
  }
);

app.delete(
  "/:id",
  zValidator(
    "param",
    z.object({ id: z.coerce.number(), knowledgeBaseId: z.coerce.number() })
  ),
  async (c) => {
    const user = await c.get("user");

    if (!user) {
      return c.json({ message: "Unauthorized", success: false }, 401);
    }

    const document = await DBDocument.delete({
      id: c.req.valid("param").id,
      userId: user.id,
      knowledgeBaseId: c.req.valid("param").knowledgeBaseId,
    });

    if (!document) {
      return c.json({ message: "Document not found", success: false }, 404);
    }

    return c.json({ data: document, success: true });
  }
);

export { app as documentRouter };
