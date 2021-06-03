import { createGlobalStyle } from 'styled-components';

import { ITheme } from './types';

interface IProps {
  theme: ITheme;
}

// weird hack to make prettier recognize css in createGlobalStyle and format it
const styled = {
  div: createGlobalStyle,
};

const GlobalStyle = styled.div<IProps>`
  body,
  html {
    color: ${(props) => props.theme.colors.body};
    height: 100%;
    font-family: -apple-system, 'PingFangSC', BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
      'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    font-size: 10px;
    box-sizing: border-box;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }

  #root {
    height: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    font-size: 1.4rem;

    > main {
      flex: 1;
    }
  }

  a,
  a.ant-typography {
    color: ${(props) => props.theme.colors.accent};

    &:hover,
    &:focus {
      color: ${(props) => props.theme.colors.accent};
    }
  }

  .ant-layout-header,
  .ant-layout-footer {
    height: auto;
    background: transparent;
    padding: 0;
    color: ${(props) => props.theme.colors.text};
    line-height: initial;
  }

  .ant-btn {
    color: ${(props) => props.theme.colors.text};
  }

  .ant-btn.ant-btn-primary:not([disabled]) {
    background-color: ${(props) => props.theme.colors.accent};
    border-color: ${(props) => props.theme.colors.accent};
    color: ${(props) => props.theme.colors.textAccent};
  }

  .ant-btn-ghost:hover {
    color: ${(props) => props.theme.colors.accent};
    border-color: ${(props) => props.theme.colors.accent};
  }

  .ant-btn-ghost.primary {
    color: ${(props) => props.theme.colors.accent};
    border-color: ${(props) => props.theme.colors.accent};
  }

  .ant-input:hover {
    border-color: ${(props) => props.theme.colors.accent};
  }
  .ant-input:focus {
    border-color: ${(props) => props.theme.colors.accent};
    box-shadow: none;
  }
`;

export default GlobalStyle;