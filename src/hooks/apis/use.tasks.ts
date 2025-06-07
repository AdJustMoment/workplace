import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTasks, queryVideo } from "../../services/task.service";
import { fetchQueryKeywords } from "@/services/video.service";

export function useTasks(params?: {
  limit?: number;
  skip?: number;
  taskTag?: string;
}) {
  return useQuery({
    queryKey: ["tasks", params],
    queryFn: () => getTasks(params),
  });
}

export function useQueryVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: queryVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useQueryKeywords(tagId: string) {
  return useQuery({
    queryKey: ["queryKeywords", tagId],
    queryFn: () => fetchQueryKeywords(Number(tagId)),
    enabled: tagId !== "",
  });
}
