import { useQuery } from "@tanstack/react-query";
import { fetchVideoTags } from "@/services/video.service";

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: fetchVideoTags,
  });
}
