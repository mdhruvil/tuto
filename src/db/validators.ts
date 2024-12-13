import { document, knowledgeBase } from "./schema";
import { z } from "zod";

// Knowledge Base
export const knowledgeBaseInsertSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  createdBy: z.string().min(1),
});
export const knowledgeBaseUpdateSchema = knowledgeBaseInsertSchema.omit({
  createdBy: true,
});

export type KnowledgeBaseInsert = z.infer<typeof knowledgeBaseInsertSchema>;
export type KnowledgeBaseUpdate = z.infer<typeof knowledgeBaseUpdateSchema>;

// Document
export const documentInsertSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  createdBy: z.string().min(1),
});
export const documentUpdateSchema = documentInsertSchema.omit({
  createdBy: true,
});

export type DocumentInsert = z.infer<typeof documentInsertSchema>;
export type DocumentUpdate = z.infer<typeof documentUpdateSchema>;
