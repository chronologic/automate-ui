import { createGlobalStyle } from 'styled-components';

import { ITheme } from './models';

interface IProps {
  theme: ITheme;
}

const GlobalStyle = createGlobalStyle<IProps>`
  body {
    color: ${(props) => props.theme.colors.body};
  }
`;

export default GlobalStyle;
