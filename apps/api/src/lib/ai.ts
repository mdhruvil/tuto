import { createAzure } from "@ai-sdk/azure";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { getContext } from "hono/context-storage";
import type { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Env } from "..";
import { embed, embedMany } from "ai";
import { and, desc, eq, gt, inArray } from "drizzle-orm";
import { cosineDistance } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { document, documentChunk } from "../db/schema";
import { db } from "../db";

/**
 * @param pdf The url of the pdf to be chunked
 * @returns The chunks of the pdf
 */
async function pdfToChunks(pdf: string) {
  const response = await fetch(pdf);
  const pdfBlob = await response.blob();

  const loader = new WebPDFLoader(pdfBlob);
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks = await splitter.splitDocuments(docs);

  return chunks;
}

export function getAzure() {
  const { env } = getContext<Env>();
  const azure = createAzure({
    apiKey: env.AZURE_OPENAI_API_KEY,
    apiVersion: env.AZURE_OPENAI_API_VERSION,
    resourceName: env.AZURE_OPENAI_API_INSTANCE_NAME,
  });

  return azure;
}

function getEmbeddingModel() {
  const { env } = getContext<Env>();
  const azure = getAzure();
  const embeddingModel = azure.textEmbeddingModel(
    env.AZURE_OPENAI_EMBEDDINGS_DEPLOYMENT,
    {
      dimensions: 1536,
    }
  );
  return embeddingModel;
}

export async function embedChunks(chunks: Document<Record<string, any>>[]) {
  const embeddingModel = getEmbeddingModel();
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks.map((chunk) => chunk.pageContent),
  });

  return embeddings.map((e, i) => ({ ...chunks[i], embedding: e }));
}

export async function embedPdf(pdf: string) {
  const chunks = await pdfToChunks(pdf);
  const embeddings = await embedChunks(chunks);
  return embeddings;
}

export async function generateEmbedding(value: string) {
  const input = value.replaceAll("\\n", " ");
  const embeddingModel = getEmbeddingModel();
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
}

export const findRelevantContent = async (
  userQuery: string,
  documentIds: number[]
) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    documentChunk.embedding,
    userQueryEmbedded
  )})`;
  const [similarGuides] = await db()
    .select({
      name: documentChunk.pageContent,
      similarity,
      metadata: documentChunk.metadata,
      documentId: documentChunk.documentId,
      document: {
        name: document.name,
        url: document.url,
        createdAt: document.createdAt,
        knowledgeBaseId: document.knowledgeBaseId,
      },
    })
    .from(documentChunk)
    .leftJoin(document, eq(documentChunk.documentId, document.id))
    .where(
      and(gt(similarity, 0.5), inArray(documentChunk.documentId, documentIds))
    )
    .orderBy((t) => desc(t.similarity))
    .limit(1);
  console.log({ similarGuides, documentIds });
  return similarGuides;
};
