import { CreateKnowledgeBaseButton } from "@/components/create-knowledge-base-button";
import { KnowledgeBaseCard } from "@/components/knowledge-base-card";
import { useKnowledgeBases } from "@/hooks/use-knowledge-base";

// // Temporary mock data - replace with real data later
// const mockKnowledgeBases = [
//   {
//     id: 1,
//     title:
//       "Product DocumentationProduct DocumentationProduct DocumentationProduct Documentation",
//     description:
//       "All documentation related to our product features, APIs, and integrations.",
//     documentsCount: 24,
//     lastUpdated: new Date("2024-03-15"),
//   },
//   {
//     id: 2,
//     title: "Internal Processes",
//     description: "Company policies, procedures, and best practices.",
//     documentsCount: 15,
//     lastUpdated: new Date("2024-03-10"),
//   },
//   {
//     id: 3,
//     title: "Engineering Wiki",
//     description:
//       "Technical documentation, architecture decisions, and coding standards.",
//     documentsCount: 42,
//     lastUpdated: new Date("2024-03-14"),
//   },
//   {
//     id: 4,
//     title: "Customer Support",
//     description:
//       "Troubleshooting guides, FAQs, and customer service protocols.",
//     documentsCount: 31,
//     lastUpdated: new Date("2024-03-13"),
//   },
//   {
//     id: 5,
//     title: "Marketing Resources",
//     description:
//       "Brand guidelines, campaign materials, and content strategy documents.",
//     documentsCount: 18,
//     lastUpdated: new Date("2024-03-12"),
//   },
// ];

export function KnowledgeBases() {
  const { data, isLoading, error, isError } = useKnowledgeBases();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;
  if (!data) return <div>No data</div>;

  return (
    <div className="space-y-6">
      {data.length > 0 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            Knowledge Bases
          </h2>
          <CreateKnowledgeBaseButton />
        </div>
      )}

      {/* Grid of knowledge bases */}
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

      {/* Empty state */}
      {data.length === 0 && (
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
      )}
    </div>
  );
}
