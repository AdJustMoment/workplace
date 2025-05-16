import { useQuery } from "@tanstack/react-query";
import { fetchVideos } from "../services/video.service";

export function useVideos(params?: { limit?: number; skip?: number }) {
  return useQuery({
    queryKey: ["videos", params],
    queryFn: () => fetchVideos(params),
  });
}
