import api from './api';
import type { DailyStats } from '../types';

export const statsService = {
  async getLatest(): Promise<DailyStats> {
    const { data } = await api.get<DailyStats>('/stats/latest');
    return data;
  },

  async getByDate(date: string): Promise<DailyStats> {
    const { data } = await api.get<DailyStats>(`/stats/${date}`);
    return data;
  },
};
