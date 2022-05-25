import React, { createContext, useCallback, useEffect, useState } from 'react';
import moment from 'moment';

import { IAuthParams, IUser, IUserWithExpiration, IResetPasswordParams } from '../types';
import { UserAPI } from '../api';

export interface IAuthContext {
  isAuthenticated: boolean;
  authenticating: boolean;
  isPasswordResetted: boolean;
  user: IUser;
  onAuthenticate: (params: IAuthParams) => void;
  onRequestPasswordReset: (params: IResetPasswordParams) => void;
  onPasswordReset: (params: IResetPasswordParams) => void;
  onLogout: () => void;
}

interface IProps {
  children: React.ReactNode;
}

const USER_STORAGE_KEY = 'user';
const MINUTE_MILLIS = 60 * 1000;

const defaultUser: IUser = {
  login: '',
  apiKey: '',
};

export const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  authenticating: false,
  isPasswordResetted: false,
  user: defaultUser,
  onAuthenticate: () => {},
  onLogout: () => {},
  onRequestPasswordReset: () => {},
  onPasswordReset: () => {},
});

export const AuthProvider: React.FC<IProps> = ({ children }: IProps) => {
  const [initialized, setInitialized] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPasswordResetted, setIsPasswordResetted] = useState(false);
  const [user, setUser] = useState<IUser>({
    login: '',
    apiKey: '',
  });

  const onLogout = useCallback(() => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setIsAuthenticated(false);
    setUser(defaultUser);
  }, []);

  const onAuthenticated = useCallback((user: IUserWithExpiration) => {
    setUser(user);
    setIsAuthenticated(true);
    const userWithExpiration: IUserWithExpiration = {
      ...user,
      expirationDate: user.expirationDate || moment().add(30, 'days').toISOString(),
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userWithExpiration));
  }, []);

  const onAuthenticate = useCallback(
    async (params: IAuthParams) => {
      setAuthenticating(true);
      const fn = params.signup ? UserAPI.signup : UserAPI.login;
      try {
        const user = await fn(params);
        onAuthenticated(user);
      } catch (e) {
        console.error(e);
      } finally {
        setAuthenticating(false);
      }
    },
    [onAuthenticated]
  );
  const onRequestPasswordReset = useCallback(async (params: IResetPasswordParams) => {
    const fn = UserAPI.requestResetPassword;
    try {
      const user = await fn(params);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const onPasswordReset = useCallback(async (params: IResetPasswordParams) => {
    const fn = UserAPI.resetPassword;
    try {
      const user2 = await fn(params);
      setIsPasswordResetted(true);
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    let user: IUserWithExpiration | null = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || 'null');
    let logoutCheckInterval: NodeJS.Timeout;
    if (user && !isSessionExpired(user)) {
      onAuthenticated(user);
    } else {
      onLogout();
    }

    setInitialized(true);

    return () => {
      clearInterval(logoutCheckInterval);
    };
  }, [onAuthenticated, onLogout]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    function logoutIfSessionExpired() {
      const hasExpiration = !!(user as IUserWithExpiration).expirationDate;
      if (hasExpiration) {
        if (isSessionExpired(user)) {
          onLogout();
        } else {
          timeoutId = setTimeout(logoutIfSessionExpired, MINUTE_MILLIS);
        }
      }
    }

    logoutIfSessionExpired();

    return () => clearTimeout(timeoutId);
  }, [onLogout, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isPasswordResetted,
        authenticating,
        onAuthenticate,
        onLogout,
        onRequestPasswordReset,
        onPasswordReset,
      }}
    >
      {initialized && children}
    </AuthContext.Provider>
  );
};

function isSessionExpired(user: IUserWithExpiration): boolean {
  const timeToExpiration = new Date(user.expirationDate!).getTime() - new Date().getTime();

  return timeToExpiration <= MINUTE_MILLIS;
}
