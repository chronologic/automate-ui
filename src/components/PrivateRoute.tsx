/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { useAuth } from '../hooks';

interface IProps {
  children: React.ReactNode;
  component?: React.ComponentType;
  exact?: boolean;
  path?: string;
}

export default function PrivateRoute({ children, ...rest }: IProps) {
  const { isAuthenticated } = useAuth();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
