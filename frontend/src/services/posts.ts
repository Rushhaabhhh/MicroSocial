import { apiClient } from './api';
import { FeedResponse, PostResponse } from '../types';

export const postsService = {
  // Feed - paginated posts
  async getFeed(page: number = 1, limit: number = 10): Promise<FeedResponse> {
    const response = await apiClient.get<FeedResponse>('/posts/feed', {
      params: { page, limit },
    });
    return response.data;
  },

  // Single post by ID
  async getPostById(postId: string): Promise<PostResponse> {
    const response = await apiClient.get<PostResponse>(`/posts/${postId}`);
    return response.data;
  },

  // Create text post
  async createPost(content: string): Promise<PostResponse> {
    const response = await apiClient.post<PostResponse>('/posts', {
      content: content.trim(),
    });
    return response.data;
  },

  // Update post content
  async updatePost(postId: string, content: string): Promise<PostResponse> {
    const response = await apiClient.put<PostResponse>(`/posts/${postId}`, {
      content: content.trim(),
    });
    return response.data;
  },

  // Delete post
  async deletePost(postId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<{ success: boolean }>(`/posts/${postId}`);
    return response.data;
  },

  // Toggle like/unlike (single endpoint)
  async toggleLike(postId: string): Promise<{ postId: string; isLiked: boolean; likeCount: number }> {
    const response = await apiClient.post<{ postId: string; isLiked: boolean; likeCount: number }>(
      `/likes/${postId}`
    );
    return response.data;
  },

  // User posts
  async getUserPosts(userId: string, page: number = 1, limit: number = 10): Promise<FeedResponse> {
    const response = await apiClient.get<FeedResponse>(`/posts/user/${userId}`, {
      params: { page, limit },
    });
    return response.data;
  },
};
