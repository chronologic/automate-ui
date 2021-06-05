import axios from 'axios';

import { API_URL } from '../env';
import { IScheduledForUser } from '../types';
import { withErrorHandler } from './withErrorHandler';

const api = axios.create({
  baseURL: API_URL,
});

export const TransactionAPI = {
  list: withErrorHandler(async (apiKey: string): Promise<IScheduledForUser[]> => {
    const response = await api.get('/transactions', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return response.data.items;
  }),
};
