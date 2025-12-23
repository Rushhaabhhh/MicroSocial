import { apiClient } from "./api";
import { Post, FeedResponse, PostResponse, LikeResponse } from "../types";

export const postsService = {
  async getFeed(page: number = 1, limit: number = 10): Promise<FeedResponse> {
    const response = await apiClient.get<FeedResponse>("/posts/feed", {
      params: { page, limit },
    });
    return response.data;
  },

  async getPostById(postId: string): Promise<PostResponse> {
    const response = await apiClient.get<PostResponse>(`/posts/${postId}`);
    return response.data;
  },

  async createPost(content: string): Promise<PostResponse> {
    const response = await apiClient.post<PostResponse>("/posts", {
      content: content.trim(),
    });
    return response.data;
  },

  async updatePost(postId: string, content: string): Promise<PostResponse> {
    const response = await apiClient.put<PostResponse>(`/posts/${postId}`, {
      content: content.trim(),
    });
    return response.data;
  },

  async deletePost(postId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<{ success: boolean }>(
      `/posts/${postId}`
    );
    return response.data;
  },

  async likePost(postId: string): Promise<LikeResponse> {
    const response = await apiClient.post<LikeResponse>("/likes", {
      postId,
    });
    return response.data;
  },

  async unlikePost(postId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<{ success: boolean }>(
      `/likes/${postId}`
    );
    return response.data;
  },

  async getUserPosts(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<FeedResponse> {
    const response = await apiClient.get<FeedResponse>(
      `/posts/user/${userId}`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },
};
