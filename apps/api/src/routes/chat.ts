import { streamText, tool } from "ai";
import { Hono } from "hono";
import { z } from "zod";
import { Env } from "..";
import { findRelevantContent, getAzure } from "../lib/ai";
import { stream } from "hono/streaming";

const app = new Hono<Env>().post("/", async (c) => {
  const { messages } = await c.req.json();

  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const azure = getAzure();
  const result = streamText({
    model: azure(c.env.AZURE_OPENAI_DEPLOYMENT),
    messages,
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls.
    `,
    tools: {
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        parameters: z.object({
          question: z.string().describe("the users question"),
        }),
        execute: async ({ question }) => findRelevantContent(question),
      }),
    },
  });

  c.header("X-Vercel-AI-Data-Stream", "v1");
  c.header("Content-Type", "text/plain; charset=utf-8");

  return stream(c, (stream) => stream.pipe(result.toDataStream()));
});

export { app as chatRouter };
