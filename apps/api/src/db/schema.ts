import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  uniqueIndex,
  serial,
  index,
  vector,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  knowledgeBases: many(knowledgeBase),
}));

export const knowledgeBase = pgTable(
  "knowledge_base",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    createdBy: text("createdBy")
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt")
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
    deletedAt: timestamp("deletedAt"),
  },
  (table) => ({
    createdByIdx: index("createdByIdx").on(table.createdBy),
  })
);

export const knowledgeBaseRelations = relations(
  knowledgeBase,
  ({ one, many }) => ({
    createdBy: one(user, {
      fields: [knowledgeBase.createdBy],
      references: [user.id],
    }),
    documents: many(document),
  })
);

export const document = pgTable(
  "document",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    knowledgeBaseId: integer("knowledgeBaseId")
      .notNull()
      .references(() => knowledgeBase.id),
    createdBy: text("createdBy")
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt")
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
    deletedAt: timestamp("deletedAt"),
  },
  (table) => ({
    knowledgeBaseIdIdx: index("knowledgeBaseIdIdx").on(table.knowledgeBaseId),
  })
);

export const documentRelations = relations(document, ({ one }) => ({
  knowledgeBase: one(knowledgeBase, {
    fields: [document.knowledgeBaseId],
    references: [knowledgeBase.id],
  }),
}));

export const documentChunk = pgTable(
  "document_chunk",
  {
    id: serial("id").primaryKey(),
    documentId: integer("documentId")
      .notNull()
      .references(() => document.id),
    pageContent: text("pageContent").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
    metadata: text("metadata"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt")
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => ({
    documentIdIdx: index("documentIdIdx").on(table.documentId),
    embeddingIdx: index("embeddingIdx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  })
);

export const documentChunkRelations = relations(documentChunk, ({ one }) => ({
  document: one(document, {
    fields: [documentChunk.documentId],
    references: [document.id],
  }),
}));

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});
