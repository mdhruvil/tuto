import { DocumentDrawer } from "@/components/document-drawer";
import { useKnowledgeBase } from "@/hooks/use-knowledge-base";
import { useChat } from "ai/react";
import { BotIcon, Send, UserIcon } from "lucide-react";
import { useParams } from "react-router";
import ReactMarkdown from "react-markdown";

export function KnowledgeBase() {
  const { knowledgebaseId } = useParams();
  const { data, isLoading, isError, error } = useKnowledgeBase({
    knowledgebaseId,
  });
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: isChatLoading,
  } = useChat({
    maxSteps: 3,
    api: import.meta.env.VITE_API_URL + "/api/chat",
    credentials: "include",
  });

  if (isLoading || !knowledgebaseId) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;

  return (
    <div className="flex h-screen flex-col bg-background text-foreground max-w-screen-md mx-auto">
      <div className="space-y-8">
        {messages.map(
          (m) =>
            m.content && (
              <div key={m.id} className="space-y-3">
                <div className="size-8 rounded-lg border flex items-center justify-center">
                  {m.role === "user" ? (
                    <UserIcon className="size-5" />
                  ) : (
                    <BotIcon className="size-5" />
                  )}
                </div>
                <div className="prose">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            )
        )}
      </div>

      <div className="border-t border-border p-4">
        <form onSubmit={handleSubmit} className="relative">
          <input
            className="w-full rounded-lg bg-card px-4 py-3 pr-24 text-card-foreground placeholder:text-muted-foreground"
            value={input}
            placeholder="Send a message..."
            onChange={handleInputChange}
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2">
            <DocumentDrawer
              documents={data.documents}
              knowledgeBaseId={knowledgebaseId}
            />
            <button
              type="submit"
              className="rounded-lg bg-primary p-2 hover:bg-primary/90 text-primary-foreground"
              disabled={isChatLoading}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
