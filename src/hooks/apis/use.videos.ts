import { useQuery } from "@tanstack/react-query";
import { fetchVideos } from "../../services/video.service";

export function useVideos(params?: {
  limit?: number;
  skip?: number;
  valid?: boolean | null;
  tagId?: number | null;
  lengthSecFrom?: number | null;
  lengthSecTo?: number | null;
}) {
  return useQuery({
    queryKey: ["videos", params],
    queryFn: () => fetchVideos(params),
  });
}
