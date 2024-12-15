import { streamText, tool, generateText } from "ai";
import { Hono } from "hono";
import { z } from "zod";
import { Env } from "..";
import { findRelevantContent, getAzure } from "../lib/ai";
import { stream } from "hono/streaming";

const app = new Hono<Env>().post("/", async (c) => {
  const { messages, documentIds } = await c.req.json();

  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!documentIds) {
    return c.json({ error: "No document ids provided" }, 400);
  }

  const azure = getAzure();
  const result = streamText({
    model: azure(c.env.AZURE_OPENAI_DEPLOYMENT),
    messages,
    system: `You are a helpful assistant. Always answer the question briefly in full detail. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls. 
    If you get "NO_DATA" as result from tool, you can answer the question your self.
    Don't say For more details, you can refer to the document.`,
    tools: {
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        parameters: z.object({
          question: z.string().describe("the users question"),
        }),
        execute: async ({ question }) => {
          const data = await findRelevantContent(question, documentIds);
          if (!data) {
            return "NO_DATA";
          }
          return data;
        },
      }),
    },
    maxSteps: 5,
  });

  c.header("X-Vercel-AI-Data-Stream", "v1");
  c.header("Content-Type", "text/plain; charset=utf-8");

  return stream(c, (stream) => stream.pipe(result.toDataStream()));
});

export { app as chatRouter };
