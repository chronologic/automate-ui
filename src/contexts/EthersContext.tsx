import React, { createContext, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import { ethers } from 'ethers';

interface IEthersContext {
  provider: ethers.providers.Web3Provider | null;
  ethereum: any;
  connected: boolean;
}

interface IProps {
  children: React.ReactNode;
}

export const EthersContext = createContext<IEthersContext>({
  provider: null,
  ethereum: null,
  connected: false,
});

export const EthersProvider: React.FC<IProps> = ({ children }: IProps) => {
  const wallet = useWallet();
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [ethereum, setEthereum] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (wallet.status === 'connected' && wallet.ethereum) {
      setConnected(true);
      setEthereum(wallet.ethereum as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setProvider(new ethers.providers.Web3Provider(wallet.ethereum as any));
    } else {
      setConnected(false);
    }
  }, [wallet.ethereum, wallet.status]);

  return <EthersContext.Provider value={{ provider, ethereum, connected }}>{children}</EthersContext.Provider>;
};
