import { useContext } from 'react';

import { EthersContext } from '../contexts';

export function useEthers() {
  const context = useContext(EthersContext);

  return context;
}
