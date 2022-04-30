import React from 'react';
import { UseWalletProvider } from 'use-wallet';

import {
  AuthProvider,
  ChainIdProvider,
  EthersProvider,
  ThemeProvider,
  AutomateConnectionProvider,
  ScreenProvider,
} from './contexts';
import { useChainId } from './hooks';

interface IProps {
  children: React.ReactNode;
}

export function Providers({ children }: IProps) {
  return (
    <ChainIdProvider>
      <WrappedProviders>{children}</WrappedProviders>
    </ChainIdProvider>
  );
}

function WrappedProviders({ children }: IProps) {
  const { injectedChainId } = useChainId();

  return (
    <ScreenProvider>
      <UseWalletProvider chainId={injectedChainId!}>
        <EthersProvider>
          <AutomateConnectionProvider>
            <AuthProvider>
              <ThemeProvider>{children}</ThemeProvider>
            </AuthProvider>
          </AutomateConnectionProvider>
        </EthersProvider>
      </UseWalletProvider>
    </ScreenProvider>
  );
}
