import React from 'react';

import { ThemeProvider } from './contexts';

interface IProps {
  children: React.ReactNode;
}

export function Providers({ children }: IProps) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
