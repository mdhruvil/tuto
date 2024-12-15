import { cn } from "@/lib/utils";
import { Message } from "ai";
import { BotIcon, FileSearchIcon, UserIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { DocumentViewerDrawer } from "./document-viewer-drawer";
import { Badge, badgeVariants } from "./ui/badge";

export function ChatMessage({
  message,
  loading = false,
}: {
  message?: Message;
  loading?: boolean;
}) {
  if (loading || !message) {
    return (
      <div className="flex gap-2 items-start">
        <div className="size-7 rounded-md border flex items-center justify-center">
          <BotIcon className="size-4 animate-pulse" />
        </div>
        <div className="prose animate-pulse">Thinking...</div>
      </div>
    );
  }
  let toolInvocations = message.toolInvocations;
  if (toolInvocations && toolInvocations.length > 1) {
    toolInvocations = toolInvocations.slice(-1);
  }
  if (toolInvocations && toolInvocations?.length > 0) {
    return toolInvocations.map((toolInvocation) => {
      if (
        toolInvocation.state === "call" ||
        toolInvocation.state === "partial-call"
      ) {
        return (
          <div
            className="flex gap-2 items-start"
            key={toolInvocation.toolCallId}
          >
            <div className="size-7 rounded-md border flex items-center justify-center">
              <FileSearchIcon className="size-4" />
            </div>
            <div className="space-y-2">
              <Badge variant="secondary">{toolInvocation.toolName}</Badge>
            </div>
          </div>
        );
      } else if (toolInvocation.state === "result") {
        const { result } = toolInvocation;
        if (result === "NO_DATA") {
          return (
            <div
              className="flex gap-2 items-start"
              key={toolInvocation.toolCallId}
            >
              <div className="size-7 rounded-md border flex items-center justify-center">
                <FileSearchIcon className="size-4" />
              </div>
              <div className="space-y-2">
                <Badge variant="secondary">
                  No data found in knowledge base about this question
                </Badge>
              </div>
            </div>
          );
        }

        const metadata = JSON.parse(result.metadata);
        return (
          <div
            className="flex gap-2 items-start"
            key={toolInvocation.toolCallId}
          >
            <div className="size-7 rounded-md border flex items-center justify-center">
              <FileSearchIcon className="size-4" />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Used these sources
              </p>
              <div className="flex gap-2 flex-wrap">
                <DocumentViewerDrawer
                  document={{
                    url: result.document.url,
                    name: result.document.name,
                  }}
                  page={metadata?.loc?.pageNumber}
                >
                  <button className={badgeVariants({ variant: "secondary" })}>
                    {result.document.name}{" "}
                    {metadata?.loc?.pageNumber &&
                      `( Page ${metadata.loc.pageNumber} )`}
                  </button>
                </DocumentViewerDrawer>
              </div>
            </div>
          </div>
        );
      }
    });
  }
  return (
    <div className="flex gap-2 items-start">
      <div className="size-7 rounded-md border flex items-center justify-center">
        {message.role === "user" ? (
          <UserIcon className="size-4" />
        ) : (
          <BotIcon className="size-4" />
        )}
      </div>
      <div
        className={cn("prose", message.role === "user" && "text-foreground")}
      >
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
    </div>
  );
}
