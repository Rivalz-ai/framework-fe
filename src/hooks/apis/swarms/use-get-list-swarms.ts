import { useShowToast } from "@/hooks/commons/use-toast";
import { axiosClientV2Instance } from "@/lib/clients/axios-client-v2";
import { ISwarm } from "@/types/swarms-type";
import { useMutation } from "@tanstack/react-query";

export default function useGetListSwarms() {
  const { onToastError } = useShowToast();
  const { mutate, isPending, mutateAsync } = useMutation({
    mutationFn: async (x_id: string) => {
      const rp: ISwarm[] = await axiosClientV2Instance.get(
        `agent/swarm/list?x_id=${x_id}`
      );
      // const rp: ISwarm[] = await axiosClientV2Instance.get(
      //   `agent/swarm/list?x_id=1393129183065231364`
      // );
      // const rp: ISwarm[] = await axiosClientV2Instance.get(
      //   `agent/swarm/list?x_id=1086560921709760512`
      // );
      return rp;
    },
    onError: (error) => {
      onToastError(error.message);
    },
  });

  return { mutate, isPending, mutateAsync };
}
