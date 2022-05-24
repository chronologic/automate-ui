import axios from 'axios';

import { API_URL } from '../env';
import { IAuthParams, IUserCredits, IUserWithExpiration } from '../types';
import { withErrorHandler } from './withErrorHandler';

const api = axios.create({
  baseURL: API_URL,
});

export const UserAPI = {
  auth: withErrorHandler(async (params: IAuthParams): Promise<IUserWithExpiration> => {
    const response = await api.post('/auth', params);
    return response.data;
  }),

  login: withErrorHandler(async (params: IAuthParams): Promise<IUserWithExpiration> => {
    const response = await api.post('/auth/login', params);
    return response.data;
  }),

  signup: withErrorHandler(async (params: IAuthParams): Promise<IUserWithExpiration> => {
    const response = await api.post('/auth/signup', params);
    return response.data;
  }),

  resetPassword: withErrorHandler(async (params: IAuthParams): Promise<IUserWithExpiration> => {
    const response = await api.post('/auth/resetPassword', params);
    return response.data;
  }),

  getCredits: withErrorHandler(async (apiKey: string): Promise<IUserCredits> => {
    const response = await api.get('/user/credits', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    return response.data;
  }),
};
