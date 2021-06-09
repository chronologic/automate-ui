import React, { createContext, useState } from 'react';

export interface IAutomateConnectionContext {
  connected: boolean;
  setConnected: (connected: boolean) => void;
}

interface IProps {
  children: React.ReactNode;
}

export const AutomateConnectionContext = createContext<IAutomateConnectionContext>({
  connected: false,
  setConnected: () => {},
});

export const AutomateConnectionProvider: React.FC<IProps> = ({ children }: IProps) => {
  const [connected, setConnected] = useState(false);

  return (
    <AutomateConnectionContext.Provider value={{ connected, setConnected: setConnected as any }}>
      {children}
    </AutomateConnectionContext.Provider>
  );
};
