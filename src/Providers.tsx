import React from 'react';

import { AuthProvider, ThemeProvider, AutomateConnectionProvider } from './contexts';

interface IProps {
  children: React.ReactNode;
}

export function Providers({ children }: IProps) {
  return (
    <AutomateConnectionProvider>
      <AuthProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </AuthProvider>
    </AutomateConnectionProvider>
  );
}
