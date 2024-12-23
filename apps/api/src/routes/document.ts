import { documentInsertSchema, documentUpdateSchema } from "@tuto/shared";
import { Hono } from "hono";
import { z } from "zod";
import { Env } from "..";
import { DBDocument } from "../db/queries/documents";
import { zValidator } from "../middleware/zod";
import { embedChunks } from "../lib/ai";
import { DocumentChunks } from "../db/queries/document_chunks";

const app = new Hono<Env>()
  .get(
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
  )
  .get(
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
  )
  .post(
    "/",
    zValidator("param", z.object({ knowledgeBaseId: z.coerce.number() })),
    zValidator(
      "json",
      z.object({
        documents: z.array(
          documentInsertSchema
            .extend({
              embeddings: z.any().optional(),
            })
            .omit({ createdBy: true, knowledgeBaseId: true })
        ),
      })
    ),
    async (c) => {
      const user = await c.get("user");

      if (!user) {
        return c.json({ message: "Unauthorized", success: false }, 401);
      }
      const { knowledgeBaseId } = c.req.valid("param");

      const documents = await DBDocument.create({
        data: c.req.valid("json").documents.map((document) => ({
          ...document,
          createdBy: user.id,
          knowledgeBaseId: knowledgeBaseId,
        })),
      });

      const chunksPerDocument = await Promise.all(
        c.req
          .valid("json")
          .documents.map((document) => embedChunks(document.embeddings))
      );

      const chunks = chunksPerDocument
        .map((c, i) => {
          return c.map((chunk) => ({
            ...chunk,
            documentId: documents[i].id,
          }));
        })
        .flat();

      await DocumentChunks.create(chunks);

      return c.json({ data: documents, success: true, chunks }, 201);
    }
  )
  .put(
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
  )
  .delete(
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
