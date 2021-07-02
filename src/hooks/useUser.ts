import { useCallback, useMemo } from 'react';

import { UserAPI } from '../api';
import { useAuth } from './useAuth';

export function useUser() {
  const { user } = useAuth();

  const handleGetCredits = useCallback(async () => {
    const res = await UserAPI.getCredits(user.apiKey);

    return res;
  }, [user?.apiKey]);

  const api = useMemo(() => {
    return {
      getCredits: handleGetCredits,
    };
  }, [handleGetCredits]);

  return api;
}
