import { useContext } from 'react';

import { ChainIdContext } from '../contexts';

export function useChainId() {
  const context = useContext(ChainIdContext);

  return context;
}
