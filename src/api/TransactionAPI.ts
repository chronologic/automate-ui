import axios from 'axios';

import { API_URL } from '../env';
import { IScheduledForUser, Status } from '../types';
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
    const items = response.data.items as IScheduledForUser[];

    return items.map((i) => {
      i.statusName = Status[i.status];

      return i;
    });
  }),
};
