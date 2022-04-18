import React, { createContext, useState } from 'react';

export interface IAutomateConnectionContext {
  connected: string;
  setConnected: (connected: string) => void;
}

interface IProps {
  children: React.ReactNode;
}

export const AutomateConnectionContext = createContext<IAutomateConnectionContext>({
  connected: 'none',
  setConnected: () => {},
});

export const AutomateConnectionProvider: React.FC<IProps> = ({ children }: IProps) => {
  const [connected, setConnected] = useState('none');

  return (
    <AutomateConnectionContext.Provider value={{ connected, setConnected: setConnected as any }}>
      {children}
    </AutomateConnectionContext.Provider>
  );
};
