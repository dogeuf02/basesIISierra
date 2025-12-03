import api from './api';
import type { SearchResult } from '../types';

export const searchService = {
  async search(query: string): Promise<SearchResult[]> {
    if (!query.trim()) return [];
    const { data } = await api.get<SearchResult[]>('/search/', {
      params: { query },
    });
    return data;
  },
};
