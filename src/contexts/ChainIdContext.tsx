import React, { createContext, useCallback, useEffect, useState } from 'react';

interface IChainIdContext {
  chainId: number | null;
  injectedChainId: number | null;
  setChainId: (chainId: number) => void;
}

interface IProps {
  children: React.ReactNode;
}

const chainIdStorageKey = 'chainId';
const defaultChainId = _retrieveChainId();

export const ChainIdContext = createContext<IChainIdContext>({
  chainId: defaultChainId,
  injectedChainId: null,
  setChainId: () => {},
});

export const ChainIdProvider: React.FC<IProps> = ({ children }: IProps) => {
  const [chainId, setChainId] = useState<number | null>(defaultChainId);
  const [injectedChainId, setInjectedChainId] = useState<number | null>(null);

  const handleSetChainId = useCallback((chainId: number | null) => {
    _storeChainId(chainId);
    setChainId(chainId);
  }, []);

  useEffect(() => {
    (window as any).ethereum.on('chainChanged', (chainId: string) => setInjectedChainId(Number(chainId)));

    getInjectedChainId();

    async function getInjectedChainId() {
      const chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
      setInjectedChainId(Number(chainId));
    }
  }, []);

  return (
    <ChainIdContext.Provider value={{ chainId, injectedChainId, setChainId: handleSetChainId }}>
      {children}
    </ChainIdContext.Provider>
  );
};

function _retrieveChainId(): number | null {
  const chainId = JSON.parse(localStorage.getItem(chainIdStorageKey) || 'null');

  return chainId ? Number(chainId) : null;
}

function _storeChainId(chainId: number | null): void {
  localStorage.setItem(chainIdStorageKey, String(chainId));
}
