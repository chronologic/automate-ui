import React, { createContext, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import { ethers } from 'ethers';
import Web3 from 'web3';

interface IEthersContext {
  provider: ethers.providers.Web3Provider | null;
  ethereum: any;
  web3: Web3 | null;
  connected: boolean;
}

interface IProps {
  children: React.ReactNode;
}

export const EthersContext = createContext<IEthersContext>({
  provider: null,
  ethereum: null,
  web3: null,
  connected: false,
});

export const EthersProvider: React.FC<IProps> = ({ children }: IProps) => {
  const wallet = useWallet();
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [ethereum, setEthereum] = useState(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (wallet.status === 'connected' && wallet.ethereum) {
      setConnected(true);
      setEthereum(wallet.ethereum as any);
      setProvider(new ethers.providers.Web3Provider(wallet.ethereum as any));
      setWeb3(new Web3(wallet.ethereum as any));
    } else {
      setConnected(false);
    }
  }, [wallet.ethereum, wallet.status]);

  return <EthersContext.Provider value={{ provider, ethereum, web3, connected }}>{children}</EthersContext.Provider>;
};
