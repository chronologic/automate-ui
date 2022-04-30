import axios from 'axios';

import { API_URL } from '../env';
import { IStrategyPrepResponse, IStrategyPrepTxWithConditions } from '../types';
import { withErrorHandler } from './withErrorHandler';

const api = axios.create({
  baseURL: API_URL,
});

export const StrategyAPI = {
  prep: withErrorHandler(
    async (txs: IStrategyPrepTxWithConditions[], apiKey: string): Promise<IStrategyPrepResponse> => {
      const response = await api.post('/strategy/prep', txs, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      return response.data;
    }
  ),
  cancel: withErrorHandler(async (strategyInstanceId: string, apiKey: string): Promise<void> => {
    await api.delete(`/strategy/prep/${strategyInstanceId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
  }),
};
