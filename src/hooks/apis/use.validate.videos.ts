import { useMutation, useQueryClient } from "@tanstack/react-query";
import { validateVideos } from "@/services/video.service";
import { Video } from "@/services/video.service";

export function useUpdateVideosStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      videos,
      valid,
    }: {
      videos: Video[];
      valid: boolean | "null";
    }) =>
      validateVideos(
        videos.map((video) => video.ytId),
        valid
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}
