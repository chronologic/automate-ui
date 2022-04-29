import React, { createContext, useCallback, useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import { ITheme } from '../types';
import themes from '../themes';
import { getUserSource, hasNonDefaultUserSource } from '../utils';

const defaultThemeName = 'magic';
const themeStorageKey = 'theme';

export interface IThemeContext {
  theme: ITheme;
  setTheme: (name: string) => void;
}

interface IProps {
  children: React.ReactNode;
}

const initialTheme = _getTheme();

export const ThemeContext = createContext<IThemeContext>({
  theme: initialTheme,
  setTheme: () => {},
});

export const ThemeProvider: React.FC<IProps> = ({ children }: IProps) => {
  const [theme, setNewTheme] = useState(initialTheme);
  const setTheme = useCallback((name: string) => {
    // forced defaultTheme to be 'Magic'.
    const newTheme = _setTheme(defaultThemeName, initialTheme.name);
    setNewTheme(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

function _getTheme(): ITheme {
  let themeName = localStorage.getItem(themeStorageKey) as string;
  const source = getUserSource();
  if (hasNonDefaultUserSource()) {
    themeName = source;
  }

  return _setTheme(themeName);
}

function _setTheme(name: string, fallbackThemeName?: string): ITheme {
  const theme: ITheme = (themes as any)[name || fallbackThemeName || defaultThemeName];

  localStorage.setItem(themeStorageKey, theme.name);

  return theme;
}
