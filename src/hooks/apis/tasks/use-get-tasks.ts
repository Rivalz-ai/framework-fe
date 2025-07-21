import { axiosClientV2Instance } from "@/lib/clients/axios-client-v2";
import { TaskStatus } from "@/types/tasks-type";
import { useQuery } from "@tanstack/react-query";

export default function useGetTasks(type: string, thread_id: string) {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["get-tasks", type, thread_id],
    queryFn: async (): Promise<TaskStatus> => {
      const projects: TaskStatus = await axiosClientV2Instance.get(
        `agent/task/${type}/stats?thread_id=${thread_id}`
      );
      //const projects: TaskStatus = await axiosClientV2Instance.get(`agent/task/${type}/stats?thread_id=6bfdaf7a-6ae3-49d3-9180-c0a2ef4d7f9e`);
      return projects;
    },
    enabled: !!thread_id,
    refetchInterval: 10000,
  });

  return {
    listTasks: data,
    isListTasksLoading: isLoading || isFetching,
    isListTasksError: isError,
    listTasksError: error,
    refetchListTasks: refetch,
  };
}
