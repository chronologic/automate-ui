import React from 'react';
import { UseWalletProvider } from 'use-wallet';

import { EthersProvider, ThemeProvider } from './contexts';
import { CHAIN_ID } from './env';

interface IProps {
  children: React.ReactNode;
}

export function Providers({ children }: IProps) {
  return (
    <UseWalletProvider chainId={CHAIN_ID}>
      <EthersProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </EthersProvider>
    </UseWalletProvider>
  );
}
