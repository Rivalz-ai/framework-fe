import { useMutation } from "@tanstack/react-query";
import { axiosClientChatbotInstance } from "@/lib/clients/axios-client-chatbot";

interface RequestUpdateThreadInfo {
  thread_id: string;
  name: string;
  tags: string[];
  metadata: {};
}
interface IUpdateThreadInfoResponse {
  forId: string;
  value: number;
  comment: string;
  id: string;
  threadId: string;
  createdAt: string;
}

export default function useUpdateThreadInfo() {
  const {
    mutateAsync: updateThreadInfoAsync,
    isPending: isUpdatingThreadInfo,
    isError: isUpdatingThreadInfoError,
    error: errorUpdateThreadInfo,
  } = useMutation({
    mutationFn: async (model: RequestUpdateThreadInfo) => {
      const result: IUpdateThreadInfoResponse =
        await axiosClientChatbotInstance.patch(`threads/${model.thread_id}`, {
          name: model.name,
          tags: model.tags,
          metadata: model.metadata,
        });
      return result;
    },
  });

  return {
    updateThreadInfoAsync,
    isUpdatingThreadInfo,
    isUpdatingThreadInfoError,
    errorUpdateThreadInfo,
  };
}
