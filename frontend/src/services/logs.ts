import api from './api';
import type { LogEvent } from '../types';

export const logsService = {
  async logEvent(event: {
    type: string;
    user_id: number;
    resource_id?: number;
    query?: string;
    metadata: { ip: string; device: string };
  }): Promise<{ id: string }> {
    const { data } = await api.post<{ id: string }>('/logs/', event);
    return data;
  },

  async getByUser(userId: number): Promise<LogEvent[]> {
    const { data } = await api.get<LogEvent[]>(`/logs/user/${userId}`);
    return data;
  },

  async getByResource(resourceId: number): Promise<LogEvent[]> {
    const { data } = await api.get<LogEvent[]>(`/logs/resource/${resourceId}`);
    return data;
  },
};
