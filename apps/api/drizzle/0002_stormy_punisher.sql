CREATE TABLE IF NOT EXISTS "document_chunk" (
	"id" serial PRIMARY KEY NOT NULL,
	"documentId" integer NOT NULL,
	"pageContent" text NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"metadata" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "document_chunk" ADD CONSTRAINT "document_chunk_documentId_document_id_fk" FOREIGN KEY ("documentId") REFERENCES "public"."document"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "documentIdIdx" ON "document_chunk" USING btree ("documentId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "embeddingIdx" ON "document_chunk" USING hnsw ("embedding" vector_cosine_ops);