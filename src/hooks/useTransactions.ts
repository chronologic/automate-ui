import { useCallback, useMemo } from 'react';

import { TransactionAPI } from '../api';
import { IGetListParams, IScheduleAccessKey, IScheduleParams, IScheduleRequest } from '../api/SentinelAPI';
import { IBatchUpdateNotes } from '../types';

import { useAuth } from './useAuth';

export function useTransactions() {
  const { user } = useAuth();

  const handleGetTransactionList = useCallback(
    async (apiKey: string, params: IGetListParams) => {
      const res = await TransactionAPI.list(apiKey || user?.apiKey, params);

      return res;
    },
    [user?.apiKey]
  );

  const handleEditTx = useCallback(
    async ({ request, queryParams }: { request: IScheduleRequest; queryParams?: IScheduleParams }) => {
      const res = await TransactionAPI.edit(queryParams?.apiKey || user?.apiKey, request, queryParams);

      return res;
    },
    [user?.apiKey]
  );

  const handleCancelTx = useCallback(
    async ({ params, apiKey }: { params: IScheduleAccessKey; apiKey?: string }) => {
      const res = await TransactionAPI.cancel(apiKey || user?.apiKey, params);

      return res;
    },
    [user?.apiKey]
  );

  const handleBatchUpdateNotes = useCallback(
    async ({ updates, apiKey }: { updates: IBatchUpdateNotes[]; apiKey?: string }) => {
      await TransactionAPI.batchUpdateNotes(apiKey || user?.apiKey, updates);
    },
    [user?.apiKey]
  );

  const api = useMemo(() => {
    return {
      getList: handleGetTransactionList,
      editTx: handleEditTx,
      cancelTx: handleCancelTx,
      batchUpdateNotes: handleBatchUpdateNotes,
    };
  }, [handleBatchUpdateNotes, handleCancelTx, handleEditTx, handleGetTransactionList]);

  return api;
}
