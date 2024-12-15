import { ChatMessage } from "@/components/chat-message";
import { DocumentDrawer } from "@/components/document-drawer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useKnowledgeBase } from "@/hooks/use-knowledge-base";
import { useChat } from "ai/react";
import { FileText, FileTextIcon, MessagesSquare, Send } from "lucide-react";
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
    body: {
      documentIds: data?.documents.map((d) => d.id),
    },
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
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <MessagesSquare className="h-12 w-12 mb-4" />
              <h3 className="font-semibold text-lg mb-1">No messages yet</h3>
              <p className="text-sm text-center">
                Start a conversation by sending a message below.
              </p>
            </div>
          ) : (
            <>
              {messages.map((m) => (
                <ChatMessage key={m.id} message={m} />
              ))}
              {isChatLoading && <ChatMessage loading />}
            </>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-screen-md mx-auto p-4 pb-8 bg-background/80 backdrop-blur-lg">
        {!data.documents.length ? (
          <div className="mb-4 p-4 border rounded-lg bg-muted/50 text-muted-foreground flex items-center gap-3">
            <FileText className="h-5 w-5" />
            <p className="text-sm">
              Upload documents to get more accurate and contextual responses.
            </p>
          </div>
        ) : null}

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
          >
            <div className="relative">
              <Button variant="outline" size="icon" className="size-12">
                <FileTextIcon />
              </Button>
              {data.documents.length > 0 && (
                <div className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                  {data.documents.length}
                </div>
              )}
            </div>
          </DocumentDrawer>
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
export default KnowledgeBase;
