import { useMutation } from "@tanstack/react-query";
import { axiosClientV2Instance } from "@/lib/clients/axios-client-v2";
import {
  TaskModel,
  TaskResponse,
  ThreadItem,
  ThreadModel,
} from "@/types/partner-type";

export function useCreateThreadMutation() {
  return useMutation<ThreadItem, Error, ThreadModel>({
    mutationFn: (model) => {
      return axiosClientV2Instance.post("/agent/partner/thread", model);
    },
  });
}

export const useCreateTaskMutation = () => {
  return useMutation<TaskResponse, Error, TaskModel>({
    mutationFn: (model) => {
      return axiosClientV2Instance.post("/agent/partner/task", model);
    },
  });
};
