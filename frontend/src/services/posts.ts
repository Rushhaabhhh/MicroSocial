import { apiClient } from './api';
import { Post, FeedResponse, PostResponse, LikeResponse } from '../types';

export const postsService = {
  async getFeed(page: number = 1, limit: number = 10): Promise<FeedResponse> {
    const response = await apiClient.get<FeedResponse>('/posts/feed', {
      params: { page, limit },
    });
    return response.data;
  },

  async getPostById(postId: string): Promise<PostResponse> {
    const response = await apiClient.get<PostResponse>(`/posts/${postId}`);
    return response.data;
  },

  async createPost(
    content: string,
    image?: string
  ): Promise<PostResponse> {
    const response = await apiClient.post<PostResponse>('/posts', {
      content,
      ...(image && { image }),
    });
    return response.data;
  },

  async uploadImage(formData: FormData): Promise<{ url: string }> {
    const response = await apiClient.postFormData<{ url: string }>(
      '/posts/upload',
      formData
    );
    return response.data;
  },

  async updatePost(
    postId: string,
    content: string
  ): Promise<PostResponse> {
    const response = await apiClient.put<PostResponse>(`/posts/${postId}`, {
      content,
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
    const response = await apiClient.post<LikeResponse>(
      `/likes`,
      { post: postId }
    );
    return response.data;
  },

  async unlikePost(postId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<{ success: boolean }>(
      `/likes/${postId}`
    );
    return response.data;
  },

  async getUserPosts(userId: string, page: number = 1): Promise<FeedResponse> {
    const response = await apiClient.get<FeedResponse>(
      `/users/${userId}/posts`,
      { params: { page, limit: 10 } }
    );
    return response.data;
  },
};
