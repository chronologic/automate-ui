import React, { createContext, useCallback, useEffect, useState } from 'react';

import { IUser } from '../types';

export interface IAuthContext {
  isAuthenticated: boolean;
  user: IUser;
  onAuthenticated: (user: IUser) => void;
  onLogout: () => void;
}

interface IProps {
  children: React.ReactNode;
}

const USER_STORAGE_KEY = 'user';

const defaultUser: IUser = {
  email: '',
  apiKey: '',
};

export const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  user: defaultUser,
  onAuthenticated: () => {},
  onLogout: () => {},
});

export const AuthProvider: React.FC<IProps> = ({ children }: IProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<IUser>({
    email: '',
    apiKey: '',
  });
  const onAuthenticated = useCallback((user: IUser) => {
    setIsAuthenticated(true);
    setUser(user);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }, []);
  const onLogout = useCallback(() => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setIsAuthenticated(false);
    setUser(defaultUser);
  }, []);

  useEffect(() => {
    let user: IUser | null = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || 'null');
    // let logoutTimeout: NodeJS.Timeout;
    // if (user) {
    //   const timeToExpiration = new Date(user.oauthTokenExpirationDate).getTime() - new Date().getTime();

    //   if (timeToExpiration <= 0) {
    //     user = null;
    //   } else {
    //     logoutTimeout = setTimeout(onLogout, timeToExpiration);
    //   }
    // }
    if (user) {
      onAuthenticated(user);
    } else {
      onLogout();
    }

    // return () => {
    //   clearTimeout(logoutTimeout);
    // };
  }, [onAuthenticated, onLogout]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, onAuthenticated, onLogout }}>{children}</AuthContext.Provider>
  );
};
