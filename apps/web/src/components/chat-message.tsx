import { cn } from "@/lib/utils";
import { Message } from "ai";
import { BotIcon, FileSearchIcon, UserIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
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
        const { result } = toolInvocation;
        if (Array.isArray(result) && result.length > 0) {
          return (
            <div className="flex gap-2 items-start">
              <div className="size-7 rounded-md border flex items-center justify-center">
                <FileSearchIcon className="size-4" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Used this sources
                </p>
                <div className="flex gap-2 flex-wrap">
                  {result.map((r, i) => {
                    const metadata = JSON.parse(r.metadata);
                    return (
                      <Badge variant="secondary" key={i}>
                        {r.document.name}{" "}
                        {metadata?.loc?.pageNumber &&
                          `( Page ${metadata.loc.pageNumber} )`}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        }
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
          message.id === "loading" && "animate-pulse italic"
        )}
      >
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
    </div>
  );
}
