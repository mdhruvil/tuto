import { DocumentDrawer } from "@/components/document-drawer";
import { useKnowledgeBase } from "@/hooks/use-knowledge-base";
import { useParams } from "react-router";

export function KnowledgeBase() {
  const { knowledgebaseId } = useParams();

  const { data, isLoading, isError, error } = useKnowledgeBase({
    knowledgebaseId,
  });

  if (isLoading || !knowledgebaseId) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;

  console.log(data);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Documents</h1>
        <DocumentDrawer
          documents={data.documents}
          knowledgeBaseId={knowledgebaseId}
        />
      </div>
    </div>
  );
}
