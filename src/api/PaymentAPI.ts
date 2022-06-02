import axios from 'axios';

import { API_URL } from '../env';
import { withErrorHandler } from './withErrorHandler';

const api = axios.create({
  baseURL: API_URL,
});

export const PaymentAPI = {
  getPaymentAddress: withErrorHandler(async (): Promise<string> => {
    const res = await api.get('/payments/address');
    return res.data.address;
  }),
  initialize: withErrorHandler(async (apiKey: string, from: string): Promise<void> => {
    await api.post(
      '/payments/initialize',
      { from },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
  }),
};
