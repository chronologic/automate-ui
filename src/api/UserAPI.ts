import { notification } from 'antd';
import axios from 'axios';

import { API_URL } from '../env';
import { IUserWithExpiration } from '../types';

const api = axios.create({
  baseURL: API_URL,
});

export const UserAPI = {
  auth: withErrorHandler(async (login: string, password: string): Promise<IUserWithExpiration> => {
    const response = await api.post('/auth', { login, password });
    return response.data;
  }),

  login: withErrorHandler(async (login: string, password: string): Promise<IUserWithExpiration> => {
    const response = await api.post('/auth/login', { login, password });
    return response.data;
  }),

  signup: withErrorHandler(async (login: string, password: string): Promise<IUserWithExpiration> => {
    const response = await api.post('/auth/signup', { login, password });
    return response.data;
  }),
};

function withErrorHandler<T extends Function>(fn: T): T {
  return function inner(...args: any[]) {
    return fn(...args).catch((e: any) => {
      notification.error({
        message: e.response?.data?.error?.message || e.message || 'Error',
      });
      throw e;
    });
  } as any;
}
