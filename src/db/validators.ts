import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { document, knowledgeBase } from "./schema";
import { z } from "zod";

// Knowledge Base
export const knowledgeBaseInsertSchema = createInsertSchema(knowledgeBase);
export const knowledgeBaseUpdateSchema = createUpdateSchema(knowledgeBase);

export type KnowledgeBaseInsert = z.infer<typeof knowledgeBaseInsertSchema>;
export type KnowledgeBaseUpdate = z.infer<typeof knowledgeBaseUpdateSchema>;

// Document
export const documentInsertSchema = createInsertSchema(document);
export const documentUpdateSchema = createUpdateSchema(document);

export type DocumentInsert = z.infer<typeof documentInsertSchema>;
export type DocumentUpdate = z.infer<typeof documentUpdateSchema>;
