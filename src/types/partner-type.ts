export interface IAgent {
  _id: string;
  active: boolean;
  name: string;
  partner_id: string;
  title: string;
}

export interface IPartner {
  _id: string;
  active: boolean;
  agents: IAgent[];
  api_key: string;
  name: string;
  logo?: string;
}

export interface IModel {
  _id: string;
  title: string;
  name: string;
  active: boolean;
}

export interface IHistory {
  _id: string;
  agent_name: string;
  created_at: string;
  partner_id: string;
  result: string;
  text: string;
  thread_id: string;
  x_id: string;
}

export interface TaskResponse {
  result: string;
  model: string;
}

export type ThreadResponse = {
  _id: string;
  agent_name: string;
  created_at: string;
  title: string;
  x_id: string;
};

export type ThreadItem = {
  thread_id: string;
};

export type TaskArgs = {
  model: string;
};

export type TaskModel = {
  thread_id: string;
  text: string;
  x_id: string;
  args: TaskArgs;
};

export type ThreadModel = {
  agent_name: string;
  x_id: string;
};

export type ThreadPartner = {
  _id: string;
  x_id: string;
  agent_name: string;
  title: string;
  created_at: string;
};
