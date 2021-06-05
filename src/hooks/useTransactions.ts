import { useCallback, useMemo } from 'react';
import { TransactionAPI } from '../api';

import { useAuth } from './useAuth';

export function useTransactions() {
  const { user } = useAuth();

  const handleGetTransactionList = useCallback(async () => {
    const res = await TransactionAPI.list(user.apiKey);

    return res;
  }, [user?.apiKey]);

  const api = useMemo(() => {
    return {
      getList: handleGetTransactionList,
    };
  }, [handleGetTransactionList]);

  return api;
}
