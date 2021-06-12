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
  const [initialized, setInitialized] = useState(false);
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
      expirationDate: user.expirationDate || moment().add(30, 'days').toISOString(),
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

  // TODO: move the interval to 'onAuthenticated' to ensure proper check
  useEffect(() => {
    let user: IUserWithExpiration | null = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || 'null');
    let logoutCheckInterval: NodeJS.Timeout;
    if (user && user.expirationDate) {
      const timeToExpiration = new Date(user.expirationDate).getTime() - new Date().getTime();

      if (timeToExpiration <= 0) {
        user = null;
      } else {
        const MINUTE_MILLIS = 60 * 1000;
        logoutCheckInterval = setInterval(() => {
          if (user && user.expirationDate) {
            const timeToExpiration = new Date(user.expirationDate).getTime() - new Date().getTime();
            if (timeToExpiration <= 0) {
              onLogout();
            }
          }
        }, MINUTE_MILLIS);
      }
    }
    if (user) {
      onAuthenticated(user);
    } else {
      onLogout();
    }

    setInitialized(true);

    return () => {
      clearInterval(logoutCheckInterval);
    };
  }, [onAuthenticated, onLogout]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, authenticating, onAuthenticate, onLogout }}>
      {initialized && children}
    </AuthContext.Provider>
  );
};
