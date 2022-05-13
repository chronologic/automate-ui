import React, { createContext, useCallback, useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import { ITheme } from '../types';
import themes from '../themes';
import { getUserSource } from '../utils';

const DEFAULT_THEME_NAME = 'automate';
const THEME_STORAGE_KEY = 'theme';

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
    const newTheme = _setTheme(name, initialTheme.name);
    setNewTheme(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

function _getTheme(): ITheme {
  let themeName = (localStorage.getItem(THEME_STORAGE_KEY) as string) || getUserSource();

  return _setTheme(themeName);
}

function _setTheme(name: string, fallbackThemeName?: string): ITheme {
  // forced magic theme
  // const theme: ITheme = (themes as any)[name || fallbackThemeName || DEFAULT_THEME_NAME];
  const theme: ITheme = (themes as any)['magic'];

  localStorage.setItem(THEME_STORAGE_KEY, theme.name);

  return theme;
}
