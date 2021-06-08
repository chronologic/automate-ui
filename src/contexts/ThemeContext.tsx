import React, { createContext } from 'react';
import { parseUrl } from 'query-string';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import { ITheme } from '../types';
import themes from '../themes';

const defaultTheme = 'automate';
const themeStorageKey = 'theme';

export interface IThemeContext {
  theme: ITheme;
}

interface IProps {
  children: React.ReactNode;
}

const theme = getTheme();

export const ThemeContext = createContext<IThemeContext>({
  theme,
});

export const ThemeProvider: React.FC<IProps> = ({ children }: IProps) => {
  // const [theme, setTheme] = useState(themes[defaultTheme]);

  // useEffect(() => {
  //   const currentTheme = getTheme();
  //   setTheme(currentTheme);
  // }, []);

  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
};

function getTheme(): ITheme {
  let theme = localStorage.getItem(themeStorageKey) as string;

  if (!theme) {
    const parsed = parseUrl(window.location.href);

    if (parsed.query?.source) {
      theme = parsed.query.source as string;
    }
  }

  if (!(themes as any)[theme]) {
    theme = defaultTheme;
  }

  localStorage.setItem(themeStorageKey, theme as string);

  return (themes as any)[theme];
}
