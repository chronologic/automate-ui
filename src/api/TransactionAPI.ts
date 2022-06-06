import axios from 'axios';
import queryString from 'query-string';
import { notification } from 'antd';

import { API_URL } from '../env';
import { IBatchUpdateNotes, IScheduledForUser, Status } from '../types';
import { IScheduleAccessKey, IScheduleParams, IScheduleRequest } from './SentinelAPI';
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
  edit: withErrorHandler(
    async (apiKey: string, request: IScheduleRequest, queryParams?: IScheduleParams): Promise<IScheduledForUser> => {
      const params = queryParams ? `?${queryString.stringify(queryParams)}` : '';
      const response = await api.post(`/transactions${params}`, request, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      notification.success({ message: 'Transaction updated' });

      return response.data;
    }
  ),
  cancel: withErrorHandler(async (apiKey: string, params: IScheduleAccessKey): Promise<IScheduledForUser> => {
    const response = await api.delete('/transactions', {
      params,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    notification.success({ message: 'Transaction cancelled' });

    return response.data;
  }),
  batchUpdateNotes: withErrorHandler(async (apiKey: string, updates: IBatchUpdateNotes[]): Promise<void> => {
    await api.post('/transactions/batchUpdateNotes', updates, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
  }),
};
