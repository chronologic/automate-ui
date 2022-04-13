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
  const { chainId } = useChainId();

  return (
    <ScreenProvider>
      <UseWalletProvider connectors={{ injected: { chainId: [1, 3, 42161, 421611] } }}>
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
