import React, { createContext, useCallback, useState } from 'react';
import { parseUrl } from 'query-string';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import { ITheme } from '../types';
import themes from '../themes';

const defaultThemeName = 'automate';
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
  let themeName = localStorage.getItem(themeStorageKey) as string;

  const parsed = parseUrl(window.location.href);

  if (parsed.query?.utm_source) {
    themeName = parsed.query.utm_source as string;
  }

  return _setTheme(themeName);
}

function _setTheme(name: string, fallbackThemeName?: string): ITheme {
  const theme: ITheme = (themes as any)[name || fallbackThemeName || defaultThemeName];

  localStorage.setItem(themeStorageKey, theme.name);

  return theme;
}
