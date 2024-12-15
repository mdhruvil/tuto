import { ChatMessage } from "@/components/chat-message";
import { DocumentDrawer } from "@/components/document-drawer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useKnowledgeBase } from "@/hooks/use-knowledge-base";
import { useChat } from "ai/react";
import { Send } from "lucide-react";
import { useEffect, useRef } from "react";
import { useParams } from "react-router";

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

  console.log(messages);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    };

    textarea.addEventListener("input", adjustHeight);
    return () => textarea.removeEventListener("input", adjustHeight);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (isLoading || !knowledgebaseId) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;

  return (
    <div className="flex flex-col bg-background text-foreground max-w-screen-md mx-auto relative">
      <div className="flex-1 p-4 pb-32">
        <div className="space-y-4">
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}
          {isChatLoading && (
            <ChatMessage
              message={{
                id: "loading",
                role: "assistant",
                content: "Thinking...",
              }}
            />
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-screen-md mx-auto p-4 pb-8 bg-background/80 backdrop-blur-lg">
        <form onSubmit={handleSubmit} className="flex items-end gap-2 relative">
          <Textarea
            ref={textareaRef}
            className="resize-none min-h-12 max-h-[200px]"
            value={input}
            placeholder="Send a message..."
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <DocumentDrawer
            documents={data.documents}
            knowledgeBaseId={knowledgebaseId}
          />
          <Button
            type="submit"
            disabled={isChatLoading}
            size="icon"
            className="aspect-square size-12"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
