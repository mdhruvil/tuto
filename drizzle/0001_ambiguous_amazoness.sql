DROP INDEX IF EXISTS "knowledgeBaseIdIdx";--> statement-breakpoint
DROP INDEX IF EXISTS "createdByIdx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowledgeBaseIdIdx" ON "document" USING btree ("knowledgeBaseId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "createdByIdx" ON "knowledge_base" USING btree ("createdBy");