import { cn } from "@/lib/utils";
import { Message } from "ai";
import { BotIcon, FileSearchIcon, UserIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { DocumentViewerDrawer } from "./document-viewer-drawer";
import { Badge } from "./ui/badge";

export function ChatMessage({ message }: { message: Message }) {
  if (message.toolInvocations && message.toolInvocations.length > 0) {
    return message.toolInvocations.map((toolInvocation) => {
      if (
        toolInvocation.state === "call" ||
        toolInvocation.state === "partial-call"
      ) {
        return <Badge variant="secondary">{toolInvocation.toolName}</Badge>;
      } else if (toolInvocation.state === "result") {
        const { result, toolCallId } = toolInvocation;
        const metadata = JSON.parse(result.metadata);
        return (
          <div key={toolCallId} className="flex gap-2 items-start">
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
                  <Badge variant="secondary">
                    {result.document.name}{" "}
                    {metadata?.loc?.pageNumber &&
                      `( Page ${metadata.loc.pageNumber} )`}
                  </Badge>
                </DocumentViewerDrawer>
              </div>
            </div>
          </div>
        );
      }
    });
  }
  return (
    <div key={message.id} className="flex gap-2 items-start">
      <div className="size-7 rounded-md border flex items-center justify-center">
        {message.role === "user" ? (
          <UserIcon className="size-4" />
        ) : (
          <BotIcon className="size-4" />
        )}
      </div>
      <div
        className={cn(
          "prose",
          message.id === "loading" && "animate-pulse italic",
          message.role === "user" && "text-foreground"
        )}
      >
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
    </div>
  );
}
