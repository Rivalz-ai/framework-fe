import { useMutation } from "@tanstack/react-query";
import { axiosClientChatbotInstance } from "@/lib/clients/axios-client-chatbot";

interface RequestCreateNewThread {
  name: string;
  tags: string[];
  metadata: Record<string, unknown>;
}
interface IThreadResponse {
  name: string;
  tags: string[];
  metadata: Record<string, unknown>;
  id: string;
  createdAt: string;
  userId: string;
  userIdentifier: string;
}

export default function useCreateThread() {
  const {
    mutateAsync: createThreadAsync,
    isPending: isCreatingThread,
    isError: isCreateThreadError,
    error: errorCreateThread,
  } = useMutation({
    mutationFn: async (model: RequestCreateNewThread) => {
      const result: IThreadResponse = await axiosClientChatbotInstance.post(
        `threads`,
        model
      );
      return result;
    },
    // onError: (error, variables) => {
    //   sendLogToServer(
    //     LogActionType.SWARM_PROJECT_CREATE_API_PROJECT_FAILED,
    //     error.message,
    //     variables
    //   );
    // },
    // onSuccess: (data, variables) => {
    //   sendLogToServer(
    //     LogActionType.SWARM_PROJECT_CREATE_API_PROJECT_SUCCESS,
    //     LogActionType.SWARM_PROJECT_CREATE_API_PROJECT_SUCCESS,
    //     { input: variables, output: data }
    //   );
    // },
  });

  return {
    createThreadAsync,
    isCreatingThread,
    isCreateThreadError,
    errorCreateThread,
  };
}
