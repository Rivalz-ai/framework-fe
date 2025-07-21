import { axiosClientV2Instance } from "@/lib/clients/axios-client-v2";
import { useQuery } from "@tanstack/react-query";

interface ITypeOfUserResponse {
  type: "UNAUTHENTICATED" | "USER" | "SWARM_OWNER";
}
export default function useGetTypeOfUser(x_id: string) {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["get-type-of-user", x_id],
    queryFn: async (): Promise<ITypeOfUserResponse> => {
      const type: ITypeOfUserResponse = await axiosClientV2Instance.get(
        `agent/user/type?x_id=${x_id}`
      );
      return type;
    },
    enabled: !!x_id,
  });

  return {
    typeOfUser: data,
    isTypeOfUserLoading: isLoading || isFetching,
    isTypeOfUserError: isError,
    typeOfUserError: error,
    refetchTypeOfUser: refetch,
  };
}
