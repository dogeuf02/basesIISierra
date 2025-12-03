import api from './api';
import type { Category } from '../types';

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    const { data } = await api.get<Category[]>('/categories/');
    return data;
  },
};
