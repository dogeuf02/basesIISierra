import api from './api';
import type { Program } from '../types';

export const programsService = {
  async getAll(): Promise<Program[]> {
    const { data } = await api.get<Program[]>('/programs/');
    return data;
  },
};
