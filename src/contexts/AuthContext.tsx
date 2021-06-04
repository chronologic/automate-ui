import React, { createContext, useCallback, useEffect, useState } from 'react';
import moment from 'moment';

import { IUser, IUserWithExpiration } from '../types';
import { UserAPI } from '../api';

export interface IAuthContext {
  isAuthenticated: boolean;
  authenticating: boolean;
  user: IUser;
  onAuthenticate: (login: string, password: string, signup: boolean) => void;
  onLogout: () => void;
}

interface IProps {
  children: React.ReactNode;
}

const USER_STORAGE_KEY = 'user';

const defaultUser: IUser = {
  login: '',
  apiKey: '',
};

export const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  authenticating: false,
  user: defaultUser,
  onAuthenticate: () => {},
  onLogout: () => {},
});

export const AuthProvider: React.FC<IProps> = ({ children }: IProps) => {
  const [authenticating, setAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<IUser>({
    login: '',
    apiKey: '',
  });
  const onAuthenticated = useCallback((user: IUserWithExpiration) => {
    setIsAuthenticated(true);
    setUser(user);
    const userWithExpiration: IUserWithExpiration = {
      ...user,
      expirationDate: user.expirationDate || moment().add(1, 'day').toISOString(),
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userWithExpiration));
  }, []);

  const onAuthenticate = useCallback(
    async (login: string, password: string, signup: boolean) => {
      setAuthenticating(true);
      const fn = signup ? UserAPI.signup : UserAPI.login;

      try {
        const user = await fn(login, password);
        onAuthenticated(user);
      } catch (e) {
        console.error(e);
      } finally {
        setAuthenticating(false);
      }
    },
    [onAuthenticated]
  );

  const onLogout = useCallback(() => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setIsAuthenticated(false);
    setUser(defaultUser);
  }, []);

  useEffect(() => {
    let user: IUserWithExpiration | null = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || 'null');
    let logoutTimeout: NodeJS.Timeout;
    if (user && user.expirationDate) {
      const timeToExpiration = new Date(user.expirationDate).getTime() - new Date().getTime();

      if (timeToExpiration <= 0) {
        user = null;
      } else {
        logoutTimeout = setTimeout(onLogout, timeToExpiration);
      }
    }
    if (user) {
      onAuthenticated(user);
    } else {
      onLogout();
    }

    return () => {
      clearTimeout(logoutTimeout);
    };
  }, [onAuthenticated, onLogout]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, authenticating, onAuthenticate, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
