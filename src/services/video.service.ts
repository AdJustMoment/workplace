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

export type VideoResponse = {
  videos: Video[];
  total: number;
};

export async function fetchVideos(params?: {
  limit?: number;
  skip?: number;
  valid?: boolean | null;
  tagId?: number | null;
}) {
  const response = await apiClient.get<VideoResponse>("/videos", {
    params: {
      limit: params?.limit,
      skip: params?.skip,
      valid: params?.valid === null ? "null" : params?.valid,
      tag_id: params?.tagId,
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

export type Tag = {
  id: number;
  name: string;
};

export type TagResponse = {
  tags: Tag[];
};

export async function fetchVideoTags() {
  const response = await apiClient.get<TagResponse>("/videos/tags");
  return response.data;
}
