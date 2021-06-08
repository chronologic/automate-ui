import React from 'react';
import { UseWalletProvider } from 'use-wallet';

import { AuthProvider, EthersProvider, ThemeProvider } from './contexts';
import { CHAIN_ID } from './env';

interface IProps {
  children: React.ReactNode;
}

export function Providers({ children }: IProps) {
  return (
    <UseWalletProvider chainId={CHAIN_ID}>
      <EthersProvider>
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </EthersProvider>
    </UseWalletProvider>
  );
}
