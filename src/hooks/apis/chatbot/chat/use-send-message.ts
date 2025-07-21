import { useMutation } from "@tanstack/react-query";
import { axiosClientChatbotInstance } from "@/lib/clients/axios-client-chatbot";

interface RequestSendMessage {
  thread_id: string;
  message: string;
  agent_type: string;
}

interface ISendMessageResponse {
  thread_id: string;
  ai_response: string[];
  user_step: {
    name: string;
    type: string;
    input: string;
    output: string;
    parentId: string;
    metadata: Record<string, any>;
    tags: string[];
    language: string;
    streaming: boolean;
    id: string;
    threadId: string;
    createdAt: string;
    start: string;
    end: string;
    isError: boolean;
    like: boolean;
    dislike: boolean;
  };
  ai_steps: {
    name: string;
    type: string;
    input: string;
    output: string;
    parentId: string;
    metadata: Record<string, any>;
    tags: string[];
    language: string;
    streaming: boolean;
    id: string;
    threadId: string;
    createdAt: string;
    start: string;
    end: string;
    isError: boolean;
    like: boolean;
    dislike: boolean;
  }[];
}

export default function useSendMessage() {
  const {
    mutateAsync: sendMessageAsync,
    isPending: isSendingMessage,
    isError: isSendMessageError,
    error: errorSendMessage,
  } = useMutation({
    mutationFn: async (model: RequestSendMessage) => {
      const result: ISendMessageResponse =
        await axiosClientChatbotInstance.post(`chat`, model);
      return result;
    },
  });

  return {
    sendMessageAsync,
    isSendingMessage,
    isSendMessageError,
    errorSendMessage,
  };
}
