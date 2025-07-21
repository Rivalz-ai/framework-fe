export interface IThread {
  name: string;
  tags: string[];
  metadata: Record<string, any>;
  id: string;
  createdAt: string;
  userId: string;
  userIdentifier: string;
}
export interface IListThreadsResponse {
  data: IThread[];
  pageInfo: {
    hasNextPage: boolean;
    startCursor: string;
    endCursor: string;
  };
}
