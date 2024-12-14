import { api, CACHE_KEYS } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useKnowledgeBases() {
  const query = useQuery({
    queryKey: CACHE_KEYS.knowledgeBases(),
    queryFn: async () => {
      const response = await api["knowledge-base"].$get();
      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to fetch knowledge bases");
      }

      const json = await response.json();

      return json.data;
    },
  });

  return query;
}

export function useKnowledgeBase({
  knowledgebaseId,
}: {
  knowledgebaseId?: string;
}) {
  const query = useQuery({
    queryKey: CACHE_KEYS.knowledgeBase(knowledgebaseId),
    enabled: !!knowledgebaseId,
    queryFn: async () => {
      const response = await api["knowledge-base"][":id"].$get({
        param: {
          id: knowledgebaseId ?? "",
        },
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to fetch knowledge base");
      }

      const json = await response.json();
      return json.data;
    },
  });

  return query;
}
