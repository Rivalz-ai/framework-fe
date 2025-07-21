import { axiosClientChatbotInstance } from "@/lib/clients/axios-client-chatbot";
import { IListThreadsResponse } from "@/types/thread-type";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function useGetThreads() {
  const {
    mutateAsync: getThreadsAsync,
    isPending: isGettingThreads,
    isError: isGettingThreadsError,
    error: errorGettingThreads,
  } = useMutation({
    mutationFn: async (model: {
      first: number;
      cursor?: string;
      search?: string;
    }) => {
      const { first, cursor, search } = model;
      const result: IListThreadsResponse =
        await axiosClientChatbotInstance.post(`threads/search`, {
          pagination: {
            first,
            cursor,
          },
          filter: {
            search,
          },
        });
      return result;
    },
  });

  return {
    getThreadsAsync,
    isGettingThreads,
    isGettingThreadsError,
    errorGettingThreads,
  };
}

// export default function useGetThreads(limit: number = 100, search?: string) {
//   const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
//     queryKey: ["get-threads", limit, search],
//     queryFn: async (): Promise<IListThreadsResponse> => {
//       const threads: IListThreadsResponse =
//         await axiosClientChatbotInstance.post(`threads/search`, {
//           pagination: {
//             first: limit,
//           },
//           filter: {
//             search: search,
//           },
//         });
//       return threads;
//     },
//   });

//   return {
//     listThreads: data,
//     isListThreadsLoading: isLoading || isFetching,
//     isListThreadsError: isError,
//     listThreadsError: error,
//     refetchListThreads: refetch,
//   };
// }
