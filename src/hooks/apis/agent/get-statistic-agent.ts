import { axiosClientV2Instance } from "@/lib/clients/axios-client-v2";
import { useQuery } from "@tanstack/react-query";

interface IStatisticAgent {
  available: number;
  total: number;
}
export default function useGetStatisticAgent(type: string, project_id: string) {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["get-statistic-agent", type, project_id],
    queryFn: async (): Promise<IStatisticAgent> => {
      const projects: IStatisticAgent = await axiosClientV2Instance.get(
        `agent/${type}/count/${project_id}`
      );
      return projects;
    },
    enabled: !!project_id,
    refetchInterval: 10000,
  });

  return {
    statisticAgent: data,
    isStatisticAgentLoading: isLoading || isFetching,
    isStatisticAgentError: isError,
    statisticAgentError: error,
    refetchStatisticAgent: refetch,
  };
}
