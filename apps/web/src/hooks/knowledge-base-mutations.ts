import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType } from "hono";

type CreateKnowledgeBaseParams = InferRequestType<
  (typeof api)["knowledge-base"]["$post"]
>;

export function useCreateKnowledgeBase() {
  const mut = useMutation({
    mutationFn: async (params: CreateKnowledgeBaseParams) => {
      const response = await api["knowledge-base"]["$post"](params);

      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to create knowledge base");
      }

      const json = await response.json();

      return json.data;
    },
  });

  return mut;
}
