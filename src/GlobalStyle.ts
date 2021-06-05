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
    background-color: ${(props) => props.theme.colors.body};
    color: ${(props) => props.theme.colors.text};
    height: 100%;
    font-family: -apple-system, 'PingFangSC', BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
      'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    font-size: 10px;
    font-weight: 300;
    box-sizing: border-box;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }

  #root {
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

  .ant-dropdown-menu {
    background-color: ${(props) => props.theme.colors.body};
    color: ${(props) => props.theme.colors.text};
    a {
      color: ${(props) => props.theme.colors.text};
    }
  }

  .ant-slider-track,
  .ant-slider:hover .ant-slider-track {
    background-color: ${(props) => props.theme.colors.accent};
  }
  .ant-slider-dot,
  .ant-slider-handle,
  .ant-slider-handle:focus,
  .ant-slider:hover .ant-slider-handle.ant-slider-handle {
    border-color: ${(props) => props.theme.colors.accent};
    box-shadow: none;
  }

  .ant-checkbox-checked:not(.ant-checkbox-disabled) .ant-checkbox-inner {
    background-color: ${(props) => props.theme.colors.accent};
    border-color: ${(props) => props.theme.colors.accent};
  }
  .ant-checkbox-wrapper:hover .ant-checkbox-inner,
  .ant-checkbox:hover .ant-checkbox-inner,
  .ant-checkbox-input:focus + .ant-checkbox-inner,
  .ant-checkbox-checked:after {
    border-color: ${(props) => props.theme.colors.accent};
  }
`;

export default GlobalStyle;
