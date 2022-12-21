import axios from 'axios';
import queryString from 'query-string';
import { notification } from 'antd';

import { API_URL } from '../env';
import { IBatchUpdateNotes, IScheduledForUser, ITxListParams, Status } from '../types';
import { IGetListParams, IScheduleAccessKey, IScheduleParams, IScheduleRequest } from './SentinelAPI';
import { withErrorHandler } from './withErrorHandler';

const api = axios.create({
  baseURL: API_URL,
});

export const TransactionAPI = {
  list: withErrorHandler(async (apiKey: string, params: IGetListParams): Promise<ITxListParams> => {
    const response = await api.get(`/transactions`, {
      params,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const item = response.data.items.items as IScheduledForUser[];
    const totalTx = response.data.items.total as number;

    return {
      items: item.map((i) => {
        i.statusName = Status[i.status];

        return i;
      }),
      total: totalTx,
    };
  }),
  count: withErrorHandler(async (apiKey: string): Promise<number> => {
    const response = await api.get(`/transactions/count`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    return response.data;
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
