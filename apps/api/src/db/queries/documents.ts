import { and, isNull, eq } from "drizzle-orm";
import { db } from "..";
import { document } from "../schema";
import { DocumentInsert, DocumentUpdate } from "../validators";

export class DBDocument {
  static async create({ data }: { data: DocumentInsert }) {
    const inserted = await db().insert(document).values(data).returning();
    return inserted;
  }

  static async getById({
    id,
    knowledgeBaseId,
    userId,
  }: {
    id: number;
    knowledgeBaseId: number;
    userId: string;
  }) {
    const returned = await db().query.document.findFirst({
      where: and(
        eq(document.id, id),
        eq(document.knowledgeBaseId, knowledgeBaseId),
        eq(document.createdBy, userId),
        isNull(document.deletedAt)
      ),
    });
    return returned;
  }

  static async getAll({
    knowledgeBaseId,
    userId,
  }: {
    knowledgeBaseId: number;
    userId: string;
  }) {
    const returned = await db().query.document.findMany({
      where: and(
        eq(document.knowledgeBaseId, knowledgeBaseId),
        eq(document.createdBy, userId),
        isNull(document.deletedAt)
      ),
    });
    return returned;
  }

  static async update({
    id,
    userId,
    data,
    knowledgeBaseId,
  }: {
    id: number;
    userId: string;
    data: DocumentUpdate;
    knowledgeBaseId: number;
  }) {
    const updated = await db()
      .update(document)
      .set(data)
      .where(
        and(
          eq(document.id, id),
          eq(document.createdBy, userId),
          eq(document.knowledgeBaseId, knowledgeBaseId),
          isNull(document.deletedAt)
        )
      )
      .returning();
    return updated;
  }

  static async delete({
    id,
    userId,
    knowledgeBaseId,
  }: {
    id: number;
    userId: string;
    knowledgeBaseId: number;
  }) {
    const deleted = await db()
      .update(document)
      .set({ deletedAt: new Date() })
      .where(
        and(
          eq(document.id, id),
          eq(document.createdBy, userId),
          eq(document.knowledgeBaseId, knowledgeBaseId)
        )
      );
    return deleted;
  }
}
