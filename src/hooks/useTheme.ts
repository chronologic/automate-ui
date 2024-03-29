import { useContext, useEffect } from 'react';

import { ThemeContext } from '../contexts';
import { useAuth } from './useAuth';

export const useTheme = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (user?.source) {
      setTheme(user.source);
    }
  }, [setTheme, user?.source]);

  return { theme, setTheme };
};
