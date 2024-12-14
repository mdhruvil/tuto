import { formatDate } from "@/lib/utils";

interface KnowledgeBaseCardProps {
  title: string;
  description: string;
  documentsCount: number;
  lastUpdated: Date;
}

export function KnowledgeBaseCard({
  title,
  description,
  documentsCount,
  lastUpdated,
}: KnowledgeBaseCardProps) {
  return (
    <div className="group relative rounded-lg border border-border bg-card p-4 sm:p-6 transition-shadow hover:shadow-md flex flex-col h-full">
      <div className="flex flex-col flex-1">
        <h3 className="font-semibold text-base sm:text-lg text-card-foreground mb-1 sm:mb-2 line-clamp-1">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 min-h-[3rem] mb-auto">
          {description}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 text-xs sm:text-sm text-muted-foreground pt-3 sm:pt-4 border-t border-border mt-3 sm:mt-4">
        <span>{documentsCount} documents</span>
        <span>Updated {formatDate(lastUpdated)}</span>
      </div>
    </div>
  );
}
