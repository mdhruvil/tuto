import { db } from "..";
import { documentChunk } from "../schema";

export class DocumentChunks {
  static async create(
    data: {
      pageContent: string;
      embedding: any;
      metadata?: any;
      documentId: number;
    }[]
  ) {
    const inserted = await db().insert(documentChunk).values(data).returning();
    return inserted;
  }
}
