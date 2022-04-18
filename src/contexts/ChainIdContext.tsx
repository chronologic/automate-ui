import React, { createContext, useCallback, useState } from 'react';

interface IChainIdContext {
  chainId: number | null;
  setChainId: (chainId: number) => void;
}

interface IProps {
  children: React.ReactNode;
}

const chainIdStorageKey = 'chainId';
const defaultChainId = _retrieveChainId();
console.log('6');
console.log('defaultChainId: ' + defaultChainId);

export const ChainIdContext = createContext<IChainIdContext>({
  chainId: defaultChainId,
  setChainId: () => {},
});

export const ChainIdProvider: React.FC<IProps> = ({ children }: IProps) => {
  console.log('1');
  const [chainId, setChainId] = useState<number | null>(defaultChainId);
  console.log('2');
  console.log('chainid: ' + chainId + 'setChainid: ' + setChainId);

  const handleSetChainId = useCallback((chainId: number | null) => {
    _storeChainId(chainId);
    setChainId(chainId);
  }, []);
  console.log('handleSetChainId: ' + handleSetChainId);

  return (
    <ChainIdContext.Provider value={{ chainId, setChainId: handleSetChainId }}>{children}</ChainIdContext.Provider>
  );
};

function _retrieveChainId(): number | null {
  console.log('3');
  const chainId = JSON.parse(localStorage.getItem(chainIdStorageKey) || 'null');
  console.log('chainId: ' + chainId);

  return chainId ? Number(chainId) : null;
}

function _storeChainId(chainId: number | null): void {
  console.log('4');

  localStorage.setItem(chainIdStorageKey, String(chainId));
}
