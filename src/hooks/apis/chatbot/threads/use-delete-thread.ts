import { useMutation } from "@tanstack/react-query";
import { axiosClientChatbotInstance } from "@/lib/clients/axios-client-chatbot";

export default function useDeleteThread() {
  const {
    mutateAsync: deleteThreadAsync,
    isPending: isDeletingThread,
    isError: isDeletingThreadError,
    error: errorDeleteThread,
  } = useMutation({
    mutationFn: async (thread_id: string) => {
      const result = await axiosClientChatbotInstance.delete(`threads`, {
        data: {
          threadId: thread_id,
        },
      });
      return result;
    },
  });

  return {
    deleteThreadAsync,
    isDeletingThread,
    isDeletingThreadError,
    errorDeleteThread,
  };
}
