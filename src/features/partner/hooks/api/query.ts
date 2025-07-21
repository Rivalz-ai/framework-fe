import { axiosClientV2Instance } from "@/lib/clients/axios-client-v2";
import {
  IHistory,
  IModel,
  IPartner,
  ThreadPartner,
} from "@/types/partner-type";

import { useQuery } from "@tanstack/react-query";

interface IAgent {
  _id: string;
  active: boolean;
  name: string;
  partner_id: string;
  title: string;
  type: string;
}

interface IPartnerResponse {
  _id: string;
  active: boolean;
  agents: IAgent[];
  api_key: string;
  logo: string;
  name: string;
  username: string;
}
export function useGetPartner(x_id: string) {
  const { data, isLoading, isFetching, isError, error } = useQuery<
    IPartnerResponse[]
  >({
    enabled: !!x_id,
    staleTime: 1000 * 60 * 30, // 30 minutes
    queryKey: ["agent/partner/list", x_id],
    queryFn: () => {
      return axiosClientV2Instance.get(`/agent/partner/list?x_id=${x_id}`);
    },
  });

  return {
    partners: data,
    isLoadingPartners: isLoading || isFetching,
    isError,
    error,
  };
}
export const useGetModelQuery = (partner_id: string, x_id: string) => {
  return useQuery<IModel[]>({
    enabled: !!partner_id && !!x_id,
    queryKey: ["agent/model/list", partner_id, x_id],
    queryFn: async () => {
      return axiosClientV2Instance.get(`agent/partner/models`, {
        params: {
          partner_id,
          x_id,
        },
      });
    },
  });
};

export const useGetHistoryQuery = (thread_id: string, x_id: string) => {
  const { data, isLoading, isFetching, isError, error } = useQuery<IHistory[]>({
    enabled: !!thread_id && !!x_id,
    queryKey: ["agent/history/list", thread_id, x_id],
    queryFn: async () => {
      const page = 0;
      const page_size = 1000;
      return axiosClientV2Instance.get(`agent/partner/history`, {
        params: {
          thread_id,
          x_id,
          page,
          page_size,
        },
      });
    },
  });

  return {
    histories: data,
    isLoadingHistories: isLoading || isFetching,
    isError,
    error,
  };
};

export const useGetPartnerThreadQuery = (x_id: string, agent_name: string) => {
  return useQuery<ThreadPartner[]>({
    enabled: !!x_id && !!agent_name,
    queryKey: ["agent/thread/list", x_id, agent_name],
    queryFn: async () => {
      const page = 0;
      const page_size = Number.MAX_SAFE_INTEGER;
      return axiosClientV2Instance.get(`agent/partner/thread`, {
        params: {
          x_id,
          agent_name,
          page,
          page_size,
        },
      });
    },
  });
};
