import { Skeleton } from "@/components/ui/skeleton";
import { CreateKnowledgeBaseButton } from "@/components/create-knowledge-base-button";
import { KnowledgeBaseCard } from "@/components/knowledge-base-card";
import { useKnowledgeBases } from "@/hooks/use-knowledge-base";
import { AlertCircleIcon } from "lucide-react";

export function KnowledgeBases() {
  const { data, isLoading, error, isError } = useKnowledgeBases();

  if (isLoading) return <KnowledgeBasesSkeleton />;
  if (isError) return <KnowledgeBasesError message={error?.message || ""} />;

  if (!data || data.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 text-center px-4">
        <h3 className="text-2xl font-bold text-foreground">
          No knowledge bases yet
        </h3>
        <p className="text-muted-foreground max-w-md">
          Create your first knowledge base to get started chatting with your
          documents
        </p>
        <CreateKnowledgeBaseButton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-foreground">Knowledge Bases</h2>
        <CreateKnowledgeBaseButton />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((kb) => (
          <KnowledgeBaseCard
            key={kb.id}
            title={kb.name}
            description={kb.description ?? ""}
            documentsCount={kb.documentsCount}
            lastUpdated={new Date(kb.updatedAt)}
          />
        ))}
      </div>
    </div>
  );
}

function KnowledgeBasesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-8 w-48" /> {/* For "Knowledge Bases" title */}
        <Skeleton className="h-10 w-40" /> {/* For Create button */}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Generate 6 skeleton cards */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-lg border p-6 space-y-4">
            <Skeleton className="h-6 w-3/4" /> {/* For title */}
            <Skeleton className="h-4 w-full" /> {/* For description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" /> {/* For documents count */}
              <Skeleton className="h-4 w-1/2" /> {/* For last updated */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KnowledgeBasesError({ message }: { message: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 text-center px-4">
      <div className="rounded-full bg-destructive/10 p-3 text-destructive">
        <AlertCircleIcon className="h-6 w-6" />
      </div>
      <h3 className="text-2xl font-bold text-foreground">
        Unable to load knowledge bases
      </h3>
      <p className="text-muted-foreground max-w-md">
        {message ||
          "An error occurred while loading your knowledge bases. Please try again."}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  );
}
