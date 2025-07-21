import { useMutation } from "@tanstack/react-query";
import { axiosClientChatbotInstance } from "@/lib/clients/axios-client-chatbot";

interface RequestSendFeedbacks {
  forId: string; //Step id
  value: 1 | -1; //(example: 1 = thumbs up, -1 = thumbs down).
  comment: string;
}
interface ISendFeedbacksResponse {
  forId: string;
  value: number;
  comment: string;
  id: string;
  threadId: string;
  createdAt: string;
}

export default function useSendFeedbacks() {
  const {
    mutateAsync: sendFeedbacksAsync,
    isPending: isSendingFeedbacks,
    isError: isSendFeedbacksError,
    error: errorSendFeedbacks,
  } = useMutation({
    mutationFn: async (model: RequestSendFeedbacks) => {
      const result: ISendFeedbacksResponse =
        await axiosClientChatbotInstance.post(`feedbacks`, model);
      return result;
    },
  });

  return {
    sendFeedbacksAsync,
    isSendingFeedbacks,
    isSendFeedbacksError,
    errorSendFeedbacks,
  };
}
