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

export const ChainIdContext = createContext<IChainIdContext>({
  chainId: defaultChainId,
  setChainId: () => {},
});

export const ChainIdProvider: React.FC<IProps> = ({ children }: IProps) => {
  const [chainId, setChainId] = useState<number | null>(defaultChainId);

  const handleSetChainId = useCallback((chainId: number | null) => {
    _storeChainId(chainId);
    setChainId(chainId);
  }, []);

  return (
    <ChainIdContext.Provider value={{ chainId, setChainId: handleSetChainId }}>{children}</ChainIdContext.Provider>
  );
};

function _retrieveChainId(): number | null {
  const chainId = JSON.parse(localStorage.getItem(chainIdStorageKey) || 'null');

  return chainId ? Number(chainId) : null;
}

function _storeChainId(chainId: number | null): void {
  localStorage.setItem(chainIdStorageKey, String(chainId));
}
