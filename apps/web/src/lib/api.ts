import { getSession } from "@/auth/auth-client";
import type { AppType } from "@tuto/api";
import { hc } from "hono/client";

export const { api } = hc<AppType>(import.meta.env.VITE_API_URL, {
  //@ts-expect-error Typing issue
  async fetch(input, requestInit) {
    const session = await getSession();

    if (session) {
      // set cookie
      requestInit.credentials = "include";
    }

    return fetch(input, requestInit);
  },
});

export const CACHE_KEYS = {
  knowledgeBases: () => ["knowledge-bases"],
  knowledgeBase: (knowledgebaseId?: string) => [
    "knowledge-base",
    knowledgebaseId,
  ],
  documents: (knowledgebaseId?: string) => ["documents", knowledgebaseId],
};
