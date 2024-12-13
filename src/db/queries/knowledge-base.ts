import { and, eq, isNull } from "drizzle-orm";
import { db } from "../index";
import { knowledgeBase } from "../schema";
import { KnowledgeBaseInsert, KnowledgeBaseUpdate } from "../validators";

export class DBKnowledgeBase {
  static async create({ data }: { data: KnowledgeBaseInsert }) {
    const inserted = await db().insert(knowledgeBase).values(data).returning();
    return inserted;
  }

  static async getById({ id, userId }: { id: number; userId: string }) {
    const returned = await db().query.knowledgeBase.findFirst({
      where: and(
        eq(knowledgeBase.id, id),
        eq(knowledgeBase.createdBy, userId),
        isNull(knowledgeBase.deletedAt)
      ),
    });
    return returned;
  }

  static async getAll({ userId }: { userId: string }) {
    const returned = await db().query.knowledgeBase.findMany({
      where: and(
        eq(knowledgeBase.createdBy, userId),
        isNull(knowledgeBase.deletedAt)
      ),
    });
    return returned;
  }

  static async update({
    id,
    userId,
    data,
  }: {
    id: number;
    userId: string;
    data: KnowledgeBaseUpdate;
  }) {
    const updated = await db()
      .update(knowledgeBase)
      .set(data)
      .where(
        and(
          eq(knowledgeBase.id, id),
          eq(knowledgeBase.createdBy, userId),
          isNull(knowledgeBase.deletedAt)
        )
      )
      .returning();
    return updated;
  }

  static async delete({ id, userId }: { id: number; userId: string }) {
    const deleted = await db()
      .update(knowledgeBase)
      .set({ deletedAt: new Date() })
      .where(and(eq(knowledgeBase.id, id), eq(knowledgeBase.createdBy, userId)))
      .returning();
    return deleted;
  }
}
