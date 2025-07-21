import { axiosClientChatbotInstance } from "@/lib/clients/axios-client-chatbot";
import { useQuery } from "@tanstack/react-query";
interface ISteps {
  name: string;
  type: "USER_MESSAGE" | "AI_RESPONSE";
  input: string | null;
  output: string | null;
  parentId: string | null;
  metadata: {
    source_agent_name?: string;
  };
  tags: string[];
  language: string | null;
  streaming: boolean;
  id: string;
  threadId: string;
  createdAt: string;
  start: string | null;
  end: string | null;
  isError: boolean;
  like: boolean;
  dislike: boolean;
}
export default function useGetSteps(
  threadId: string,
  skip: number = 0,
  limit: number = 100
) {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    enabled: !!threadId,
    queryKey: ["get-steps", threadId, skip, limit],
    queryFn: async (): Promise<ISteps[]> => {
      const threads: ISteps[] = await axiosClientChatbotInstance.get(
        `threads/${threadId}/steps?skip=${skip}&limit=${limit}`
      );
      return threads;
    },
  });

  return {
    listSteps: data,
    isListStepsLoading: isLoading || isFetching,
    isListStepsError: isError,
    listStepsError: error,
    refetchListSteps: refetch,
  };
}
