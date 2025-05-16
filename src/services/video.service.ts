import { apiClient } from "../utils/api";

export type Video = {
  ytId: string;
  title: string;
  description: string | null;
  viewCount: number | null;
  likeCount: number | null;
  publishedAt: string;
  lengthSec: number;
  channelId: string;
  tagId: number;
};

export async function fetchVideos(params?: { limit?: number; skip?: number }) {
  const response = await apiClient.get<{ videos: Video[] }>("/videos", {
    params: {
      limit: params?.limit,
      skip: params?.skip,
    },
  });

  return response.data;
}
