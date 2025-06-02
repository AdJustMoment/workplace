import { apiClientWithAuth } from "@/utils/api";

export enum TaskStatus {
  NOT_STARTED = "not_started",
  PROCESSING = "processing",
  DONE = "done",
}

export type Task = {
  id: number;
  taskTag: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};

export type TaskResponse = {
  tasks: Task[];
  total: number;
};

export async function getTasks(params?: {
  limit?: number;
  skip?: number;
  taskTag?: string;
}) {
  const response = await apiClientWithAuth.get<TaskResponse>("/worker/tasks", {
    params: {
      limit: params?.limit,
      skip: params?.skip,
      task_tag: params?.taskTag,
    },
  });

  return response.data;
}

export async function queryVideo(params: {
  tagId: number;
  queryKeywordId: string;
}) {
  const response = await apiClientWithAuth.post<{ taskId: string }>(
    "/worker/video/query",
    {
      tag_id: params.tagId,
      keyword_id: params.queryKeywordId,
    }
  );
  return response.data;
}
