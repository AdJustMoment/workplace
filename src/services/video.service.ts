import { apiClientWithAuth } from "../utils/api";

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
  lengthSecFrom?: number | null;
  lengthSecTo?: number | null;
}) {
  const response = await apiClientWithAuth.get<VideoResponse>("/videos", {
    params: {
      limit: params?.limit,
      skip: params?.skip,
      valid: params?.valid === null ? "null" : params?.valid,
      tag_id: params?.tagId,
      length_sec_from: params?.lengthSecFrom,
      length_sec_to: params?.lengthSecTo,
    },
  });

  return response.data;
}

export async function validateVideos(
  yt_ids: string[],
  valid: boolean | "null"
) {
  const response = await apiClientWithAuth.patch("/videos/validate", {
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
  const response = await apiClientWithAuth.get<TagResponse>("/videos/tags");
  return response.data;
}
