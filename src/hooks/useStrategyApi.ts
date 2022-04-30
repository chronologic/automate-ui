import { useCallback, useMemo } from 'react';

import { StrategyAPI } from '../api';
import { IStrategyPrepTxWithConditions } from '../types';
import { useAuth } from './useAuth';

export function useStrategyApi() {
  const { user } = useAuth();

  const handlePrep = useCallback(
    async (txs: IStrategyPrepTxWithConditions[]) => {
      const res = await StrategyAPI.prep(txs, user.apiKey);

      return res;
    },
    [user?.apiKey]
  );

  const handleCancel = useCallback(
    async (strategyInstanceId: string) => {
      const res = await StrategyAPI.cancel(strategyInstanceId, user.apiKey);

      return res;
    },
    [user?.apiKey]
  );

  const api = useMemo(
    () => ({
      prep: handlePrep,
      cancel: handleCancel,
    }),
    [handleCancel, handlePrep]
  );

  return api;
}
