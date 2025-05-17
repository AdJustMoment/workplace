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

export async function fetchVideos(params?: {
  limit?: number;
  skip?: number;
  valid?: boolean | null;
}) {
  const response = await apiClient.get<{ videos: Video[] }>("/videos", {
    params: {
      limit: params?.limit,
      skip: params?.skip,
      valid: params?.valid === null ? "null" : params?.valid,
    },
  });

  return response.data;
}

export async function validateVideos(yt_ids: string[], valid: boolean) {
  const response = await apiClient.patch("/videos/validate", {
    yt_ids,
    valid,
  });
  return response.data;
}
