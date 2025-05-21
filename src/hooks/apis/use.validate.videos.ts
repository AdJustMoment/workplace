import { useMutation } from "@tanstack/react-query";
import { validateVideos } from "@/services/video.service";
import { Video } from "@/services/video.service";

export function useValidateVideos() {
  return useMutation({
    mutationFn: ({ videos, valid }: { videos: Video[]; valid: boolean }) =>
      validateVideos(
        videos.map((video) => video.ytId),
        valid
      ),
  });
}
