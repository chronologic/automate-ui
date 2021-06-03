import React, { createContext, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import { ethers } from 'ethers';

interface IEthersContext {
  provider: ethers.providers.Web3Provider | null;
}

interface IProps {
  children: React.ReactNode;
}

export const EthersContext = createContext<IEthersContext>({
  provider: null,
});

export const EthersProvider: React.FC<IProps> = ({ children }: IProps) => {
  const wallet = useWallet();
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

  useEffect(() => {
    if (wallet.status === 'connected' && wallet.ethereum) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setProvider(new ethers.providers.Web3Provider(wallet.ethereum as any));
    }
  }, [wallet.ethereum, wallet.status]);

  return <EthersContext.Provider value={{ provider }}>{children}</EthersContext.Provider>;
};
