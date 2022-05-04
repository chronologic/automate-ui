import React from 'react';

import { AuthProvider, ThemeProvider, AutomateConnectionProvider, ScreenProvider } from './contexts';

interface IProps {
  children: React.ReactNode;
}

export function Providers({ children }: IProps) {
  return (
    <ScreenProvider>
      <AutomateConnectionProvider>
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </AutomateConnectionProvider>
    </ScreenProvider>
  );
}
