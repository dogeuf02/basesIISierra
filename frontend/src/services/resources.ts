import api from './api';
import type { Resource, Author, Category, Keyword, Review, ReviewInput } from '../types';

export const resourcesService = {
  async getAll(skip = 0, limit = 50): Promise<Resource[]> {
    const { data } = await api.get<Resource[]>('/resources/', {
      params: { skip, limit },
    });
    return data;
  },

  async getById(resourceId: number): Promise<Resource> {
    const { data } = await api.get<Resource>(`/resources/${resourceId}`);
    return data;
  },

  async getAuthors(resourceId: number): Promise<Author[]> {
    const { data } = await api.get<Author[]>(`/resources/${resourceId}/authors`);
    return data;
  },

  async getCategories(resourceId: number): Promise<Category[]> {
    const { data } = await api.get<Category[]>(`/resources/${resourceId}/categories`);
    return data;
  },

  async getKeywords(resourceId: number): Promise<Keyword[]> {
    const { data } = await api.get<Keyword[]>(`/resources/${resourceId}/keywords`);
    return data;
  },

  async getReviews(resourceId: number): Promise<Review[]> {
    const { data } = await api.get<Review[]>(`/resources/${resourceId}/reviews`);
    return data;
  },

  async addReview(resourceId: number, review: ReviewInput): Promise<Review> {
    const { data } = await api.post<Review>(`/resources/${resourceId}/reviews`, review);
    return data;
  },

  async uploadFile(resourceId: number, file: File): Promise<Resource> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post<Resource>(`/resources/${resourceId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  async downloadFile(resourceId: number, userId?: number): Promise<Blob> {
    const params = userId ? { user_id: userId } : {};
    const { data } = await api.get<Blob>(`/resources/${resourceId}/file`, {
      params,
      responseType: 'blob',
    });
    return data;
  },
};
