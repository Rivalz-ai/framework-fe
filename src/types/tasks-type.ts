
export interface TaskResultDone {
  agent_type: string;
  data: string;
  id: string;
  name: string;
  num_loop: number;
  task_id: string;
}

export interface TaskFailedItem {
  agent_type: string;
  error: string;
  id: string;
  name: string;
  num_loop: number;
  task_id: string;
}

export interface TaskStatus {
  completion_percentage: number;
  done: number;
  failed: number;
  list_failed: TaskFailedItem[];
  list_result_done: TaskResultDone[];
  pending: number;
  queue_size: number;
  total_tasks: number;
}
