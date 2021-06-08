import { useContext } from 'react';

import { AuthContext } from '../contexts';

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
