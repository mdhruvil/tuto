import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useKnowledgeBases() {
  const query = useQuery({
    queryKey: ["knowledge-bases"],
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
