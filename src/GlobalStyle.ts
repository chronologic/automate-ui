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
  .ant-typography {
    color: ${(props) => props.theme.colors.text};
  }

  .ant-layout-header,
  .ant-layout-footer {
    height: auto;
    background: transparent;
    padding: 0;
    color: ${(props) => props.theme.colors.text};
    line-height: initial;
  }

  .ant-form-item-label > label {
    color: ${(props) => props.theme.colors.text};
  }

  .ant-btn {
    background-color: ${(props) => props.theme.colors.body};
    color: ${(props) => props.theme.colors.text};
    border-color: ${(props) => props.theme.colors.border};
  }
  .ant-btn:hover,
  .ant-btn:focus {
    border-color: ${(props) => props.theme.colors.accent};
    background-color: ${(props) => props.theme.colors.body};
    color: ${(props) => props.theme.colors.accent};
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
  .ant-btn-primary[disabled],
  .ant-btn-primary[disabled]:hover,
  .ant-btn-primary[disabled]:focus,
  .ant-btn-primary[disabled]:active {
    background-color: ${(props) => props.theme.colors.body};
    border-color: ${(props) => props.theme.colors.border};
    color: ${(props) => props.theme.colors.border};
  }

  .ant-input {
    color: ${(props) => props.theme.colors.text};
    background-color: ${(props) => props.theme.colors.body};
    border-color: ${(props) => props.theme.colors.border};
  }
  .ant-input:hover {
    border-color: ${(props) => props.theme.colors.accent};
  }
  .ant-input:focus {
    border-color: ${(props) => props.theme.colors.accent};
    box-shadow: none;
  }
  .ant-input[disabled] {
    color: ${(props) => props.theme.colors.border};
    background-color: ${(props) => props.theme.colors.body};
    border-color: ${(props) => props.theme.colors.border};
    &::placeholder {
      color: ${(props) => props.theme.colors.border};
    }
  }
  .ant-input-search .ant-input:hover,
  .ant-input-search .ant-input:focus {
    border-color: ${(props) => props.theme.colors.accent};
  }
  .ant-input-search .ant-input:hover + .ant-input-group-addon .ant-input-search-button:not(.ant-btn-primary),
  .ant-input-search .ant-input:focus + .ant-input-group-addon .ant-input-search-button:not(.ant-btn-primary) {
    border-left-color: ${(props) => props.theme.colors.accent};
  }
  .ant-input-search
    > .ant-input-group
    > .ant-input-group-addon:last-child
    .ant-input-search-button:not(.ant-btn-primary) {
    color: ${(props) => props.theme.colors.text};
  }
  .ant-input-group-addon {
    color: ${(props) => props.theme.colors.text};
  }

  .ant-dropdown-menu {
    background-color: ${(props) => props.theme.colors.body};
    color: ${(props) => props.theme.colors.text};
    box-shadow: ${(props) => props.theme.colors.shadow};

    a {
      color: ${(props) => props.theme.colors.text};
    }
  }
  .ant-dropdown-menu-item,
  .ant-dropdown-menu-submenu-title {
    color: ${(props) => props.theme.colors.text};
  }
  .ant-dropdown-menu-item-divider,
  .ant-dropdown-menu-submenu-title-divider {
    background-color: ${(props) => props.theme.colors.border};
  }
  .ant-dropdown-menu-item:hover,
  .ant-dropdown-menu-submenu-title:hover,
  .ant-dropdown-menu-item:hover a {
    background-color: ${(props) => props.theme.colors.body};
    color: ${(props) => props.theme.colors.accent};
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

  .ant-table-row-expand-icon:focus,
  .ant-table-row-expand-icon:hover {
    color: ${(props) => props.theme.colors.accent};
  }

  .ant-modal {
    color: ${(props) => props.theme.colors.text};
  }
  .ant-modal-content {
    background-color: ${(props) => props.theme.colors.body};
    box-shadow: ${(props) => props.theme.colors.shadow};
  }
  .ant-modal-header {
    background-color: ${(props) => props.theme.colors.body};
    color: ${(props) => props.theme.colors.text};
    border-color: ${(props) => props.theme.colors.border};

    .ant-modal-title {
      color: ${(props) => props.theme.colors.text};
    }
  }
  .ant-modal-footer {
    border-color: ${(props) => props.theme.colors.border};
  }
`;

export default GlobalStyle;
