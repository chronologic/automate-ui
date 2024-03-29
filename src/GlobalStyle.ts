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
  a.ant-typography,
  a .ant-tag {
    color: ${(props) => props.theme.colors.accent};

    &:hover,
    &:focus {
      color: ${(props) => props.theme.colors.accent};
    }
  }
  .ant-typography {
    color: ${(props) => props.theme.colors.text};
  }
  h5.ant-typography,
  .ant-typography h5,
  h4.ant-typography,
  .ant-typography h4,
  h3.ant-typography,
  .ant-typography h3,
  h1.ant-typography,
  .ant-typography h1 {
    color: ${(props) => props.theme.colors.text};
  }

  .ant-layout-header,
  .ant-layout-footer {
    height: auto;
    background: ${(props) => props.theme.colors.header};
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
    background-color: ${(props) => props.theme.colors.accent};
    border-color: ${(props) => props.theme.colors.accent};
  }
  .ant-input-status-error:not(.ant-input-disabled):not(.ant-input-borderless).ant-input,
  .ant-input-status-error:not(.ant-input-disabled):not(.ant-input-borderless).ant-input:hover {
    background-color: transparent;
  }
  .ant-form-item-has-error .ant-input,
  .ant-form-item-has-error .ant-input-affix-wrapper,
  .ant-form-item-has-error .ant-input:hover,
  .ant-form-item-has-error .ant-input-affix-wrapper:hover {
    background-color: ${(props) => props.theme.colors.body};
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
  .ant-dropdown-menu-title-content {
    display: inline-block;
    width: 100%;
    a {
      display: inline-block;
      width: 100%;
    }
  }

  .ant-empty-description {
    color: ${(props) => props.theme.colors.text};
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

  .ant-table {
    background-color: ${(props) => props.theme.colors.body};
    color: ${(props) => props.theme.colors.text};
  }
  .ant-table-thead > tr > th,
  .ant-table-small .ant-table-thead > tr > th {
    background-color: ${(props) => props.theme.colors.weak};
    color: ${(props) => props.theme.colors.text};
    border-color: ${(props) => props.theme.colors.border};
  }
  .ant-table-tbody > tr > td {
    border-color: ${(props) => props.theme.colors.border};
  }
  .ant-table-tbody > tr.ant-table-placeholder:hover > td {
    background-color: ${(props) => props.theme.colors.weak};
  }
  .ant-table-footer {
    background-color: ${(props) => props.theme.colors.body};
    color: ${(props) => props.theme.colors.text};
    border-color: ${(props) => props.theme.colors.border};
  }
  .ant-table-row-expand-icon:focus,
  .ant-table-row-expand-icon:hover {
    color: ${(props) => props.theme.colors.accent};
  }
  .ant-table-tbody > tr.ant-table-row:hover > td {
    background-color: ${(props) => props.theme.colors.weak};
  }
  tr.ant-table-expanded-row > td,
  tr.ant-table-expanded-row:hover > td {
    background-color: ${(props) => props.theme.colors.weak};
  }
  .ant-table-row-expand-icon {
    background-color: ${(props) => props.theme.colors.body};
    border-color: ${(props) => props.theme.colors.border};
  }
  .ant-table-tbody > tr.ant-table-row-selected > td {
    background-color: ${(props) => props.theme.colors.border};
  }
  td.ant-table-column-sort {
    background-color: ${(props) => props.theme.colors.weak};
  }
  .ant-table-column-sorter {
    margin-left: 4px;
  }

  .ant-pagination-item-active {
    background-color: ${(props) => props.theme.colors.body};
    border-color: ${(props) => props.theme.colors.accent};
    a {
      color: ${(props) => props.theme.colors.accent};
    }
  }
  .ant-pagination-item-active:focus-visible,
  .ant-pagination-item-active:hover {
    background-color: ${(props) => props.theme.colors.body};
    border-color: ${(props) => props.theme.colors.accent};
    a {
      color: ${(props) => props.theme.colors.accent};
    }
  }
  .ant-pagination.mini .ant-pagination-item:not(.ant-pagination-item-active) {
    a {
      color: ${(props) => props.theme.colors.text};
    }
  }
  .ant-pagination.mini .ant-pagination-item:focus-visible,
  .ant-pagination.mini .ant-pagination-item:hover {
    a {
      color: ${(props) => props.theme.colors.accent};
    }
  }
  .ant-pagination-prev button,
  .ant-pagination-next button {
    color: ${(props) => props.theme.colors.text};
  }
  .ant-pagination-prev:focus-visible .ant-pagination-item-link,
  .ant-pagination-next:focus-visible .ant-pagination-item-link,
  .ant-pagination-prev:hover .ant-pagination-item-link,
  .ant-pagination-next:hover .ant-pagination-item-link {
    color: ${(props) => props.theme.colors.accent};
  }
  .ant-pagination-disabled .ant-pagination-item-link,
  .ant-pagination-disabled:hover .ant-pagination-item-link,
  .ant-pagination-disabled:focus-visible .ant-pagination-item-link {
    color: ${(props) => props.theme.colors.border};
  }

  .ant-modal {
    color: ${(props) => props.theme.colors.text};
  }
  .ant-modal-content {
    background-color: ${(props) => props.theme.colors.body};
    box-shadow: none;
  }
  .ant-modal-close-x {
    color: white;
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

  .ant-card {
    border-color: ${(props) => props.theme.colors.border};
    background-color: ${(props) => props.theme.colors.body};
    color: ${(props) => props.theme.colors.text};
  }
  .ant-card-head {
    border-color: ${(props) => props.theme.colors.border};
    color: ${(props) => props.theme.colors.text};
  }
  .ant-picker-time-panel-column > li.ant-picker-time-panel-cell-selected .ant-picker-time-panel-cell-inner {
    background: ${(props) => props.theme.colors.text};
  }
  .ant-picker-range .ant-picker-active-bar {
    background: ${(props) => props.theme.colors.accent};
  }
  .ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner,
  .ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner,
  .ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner {
    background: ${(props) => props.theme.colors.accent};
  }
  .ant-picker-cell-in-view.ant-picker-cell-today .ant-picker-cell-inner::before {
    border: ${(props) => props.theme.colors.accent};
  }
  .ant-picker-cell-in-view.ant-picker-cell-in-range::before {
    background: ${(props) => props.theme.colors.text};
  }

  .ant-picker:hover,
  .ant-picker-focused,
  .ant-radio-wrapper-checked:not(.ant-radio-wrapper-disabled):first-child,
  .ant-radio-wrapper-checked:not(.ant-radio-wrapper-disabled) {
    border-color: ${(props) => props.theme.colors.accent};
  }

  .ant-radio-wrapper {
    color: ${(props) => props.theme.colors.text};
  }

  .ant-picker-header-view button:hover,
  .ant-radio-wrapper-checked:not(.ant-radio-wrapper-disabled),
  .ant-radio-wrapper:hover {
    color: ${(props) => props.theme.colors.accent};
  }
  .ant-radio-wrapper-checked:not([class*=' ant-radio-wrapper-disabled']).ant-radio-wrapper:first-child {
    border-right-color: ${(props) => props.theme.colors.accent};
  }
  .ant-radio-wrapper-checked:not(.ant-radio-wrapper-disabled)::before,
  .ant-radio-wrapper-checked:not(.ant-radio-wrapper-disabled):hover::before,
  .ant-radio-inner::after {
    background-color: ${(props) => props.theme.colors.accent};
  }
  .ant-radio-wrapper-checked:not(.ant-radio-wrapper-disabled):hover,
  .ant-radio-checked .ant-radio-inner,
  .ant-radio-wrapper:hover .ant-radio,
  .ant-radio:hover .ant-radio-inner,
  .ant-radio-input:focus + .ant-radio-inner {
    color: ${(props) => props.theme.colors.accent};
    border-color: ${(props) => props.theme.colors.accent};
  }

  .ant-picker:hover,
  .ant-picker-focused,
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):first-child,
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    border-color: ${(props) => props.theme.colors.accent};
  }

  .ant-picker-header-view button:hover,
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled),
  .ant-radio-button-wrapper:hover {
    color: ${(props) => props.theme.colors.accent};
  }
  .ant-radio-button-wrapper-checked:not([class*=' ant-radio-button-wrapper-disabled']).ant-radio-button-wrapper:first-child {
    border-right-color: ${(props) => props.theme.colors.accent};
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before,
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover::before,
  .ant-radio-button-inner::after {
    background-color: ${(props) => props.theme.colors.accent};
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover,
  .ant-radio-button-checked .ant-radio-button-inner,
  .ant-radio-button-wrapper:hover .ant-radio-button,
  .ant-radio-button:hover .ant-radio-button-inner,
  .ant-radio-button-input:focus + .ant-radio-button-inner {
    color: ${(props) => props.theme.colors.accent};
    border-color: ${(props) => props.theme.colors.accent};
  }

  .ant-radio-button-wrapper:focus-within,
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):focus-within {
    box-shadow: none;
  }

  .ant-picker-cell-in-view.ant-picker-cell-range-hover-start:not(.ant-picker-cell-in-range):not(.ant-picker-cell-range-start):not(.ant-picker-cell-range-end)::after,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover-end:not(.ant-picker-cell-in-range):not(.ant-picker-cell-range-start):not(.ant-picker-cell-range-end)::after,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover-start.ant-picker-cell-range-start-single::after,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover-start.ant-picker-cell-range-start.ant-picker-cell-range-end.ant-picker-cell-range-end-near-hover::after,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover-end.ant-picker-cell-range-start.ant-picker-cell-range-end.ant-picker-cell-range-start-near-hover::after,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover-end.ant-picker-cell-range-end-single::after,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover:not(.ant-picker-cell-in-range)::after {
    border-top: 1px dashed ${(props) => props.theme.colors.accent};
    border-bottom: 1px dashed ${(props) => props.theme.colors.accent};
  }
  tr > .ant-picker-cell-in-view.ant-picker-cell-range-hover:last-child::after,
  tr > .ant-picker-cell-in-view.ant-picker-cell-range-hover-start:last-child::after,
  .ant-picker-cell-in-view.ant-picker-cell-end.ant-picker-cell-range-hover-edge-end.ant-picker-cell-range-hover-edge-end-near-range::after,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover-edge-end:not(.ant-picker-cell-range-hover-edge-end-near-range)::after,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover-end::after {
    border-right: 1px dashed ${(props) => props.theme.colors.accent};
  }
  tr > .ant-picker-cell-in-view.ant-picker-cell-range-hover:first-child::after,
  tr > .ant-picker-cell-in-view.ant-picker-cell-range-hover-end:first-child::after,
  .ant-picker-cell-in-view.ant-picker-cell-start.ant-picker-cell-range-hover-edge-start.ant-picker-cell-range-hover-edge-start-near-range::after,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover-edge-start:not(.ant-picker-cell-range-hover-edge-start-near-range)::after,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover-start::after {
    border-left: 1px dashed ${(props) => props.theme.colors.accent};
  }
  .ant-progress-status-success .ant-progress-bg {
    background: ${(props) => props.theme.colors.accent};
  }

  .ant-input-number:hover {
    border-color: ${(props) => props.theme.colors.accent};
  }
  .ant-input-number {
    border: 1px solid ${(props) => props.theme.colors.accent};
  }

  .ant-tag {
    background: ${(props) => props.theme.colors.body};
    color: ${(props) => props.theme.colors.text};
    border-color: ${(props) => props.theme.colors.border};
  }
  .ant-btn-primary[disabled],
  .ant-btn-primary[disabled]:hover,
  .ant-btn-primary[disabled]:focus,
  .ant-btn-primary[disabled]:active {
    background-color: ${(props) => props.theme.colors.disabled};
    border-color: ${(props) => props.theme.colors.disabled};
    color: ${(props) => props.theme.colors.disabledText};
  }
`;

export default GlobalStyle;
