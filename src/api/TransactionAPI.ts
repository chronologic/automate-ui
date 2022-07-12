import axios from 'axios';
import queryString from 'query-string';
import { notification } from 'antd';

import { API_URL } from '../env';
import { IBatchUpdateNotes, IScheduledForUser, Status } from '../types';
import { IGetListParams, IScheduleAccessKey, IScheduleParams, IScheduleRequest } from './SentinelAPI';
import { withErrorHandler } from './withErrorHandler';

const api = axios.create({
  baseURL: API_URL,
});

export const TransactionAPI = {
  list: withErrorHandler(async (apiKey: string, params: IGetListParams): Promise<[IScheduledForUser[], number]> => {
    const response = await api.get(`/transactions`, {
      params,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    console.log(JSON.stringify(response.data.result));

    const items = response.data.items[0] as IScheduledForUser[];

    return [
      items.map((i) => {
        i.statusName = Status[i.status];

        return i;
      }),
      response.data.items[1],
    ];
  }),
  edit: withErrorHandler(
    async (apiKey: string, request: IScheduleRequest, queryParams?: any): Promise<IScheduledForUser> => {
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
