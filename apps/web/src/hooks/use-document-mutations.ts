import { useMutation } from "@tanstack/react-query";
import { api, CACHE_KEYS } from "@/lib/api";
import { InferRequestType } from "hono";
import { queryClient } from "@/lib/query-client";

type CreateDocumentData = InferRequestType<
  (typeof api)["knowledge-base"][":knowledgeBaseId"]["document"]["$post"]
>;

export function useCreateDocument({
  knowledgeBaseId,
}: {
  knowledgeBaseId?: string;
}) {
  const mutation = useMutation({
    mutationFn: async (data: CreateDocumentData["json"]) => {
      if (!knowledgeBaseId) {
        throw new Error("Knowledge base ID is required");
      }

      const response = await api["knowledge-base"][":knowledgeBaseId"][
        "document"
      ].$post({
        param: {
          knowledgeBaseId,
        },
        json: data,
      });

      if (!response.ok) {
        throw new Error("Failed to create document");
      }
      const json = await response.json();

      return json.data;
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.knowledgeBase(knowledgeBaseId),
      });
    },
  });

  return mutation;
}
