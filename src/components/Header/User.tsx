import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import { useAuth, useScreen } from '../../hooks';
import { IThemeProps } from '../../types';
import { ALLOW_SIGNUP } from '../../env';
import { SCREEN_BREAKPOINT } from '../../constants';

function HeaderMain() {
  const { isAuthenticated, user, onLogout } = useAuth();
  const { isLg } = useScreen();

  const loginShort = useMemo(() => {
    return user.login.split('@')[0] || user.login.slice(0, 10);
  }, [user.login]);

  if (isAuthenticated) {
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <Link to="/connect">Connection</Link>
        </Menu.Item>
        <Menu.Item key="1">
          <Link to="/transactions">Transactions</Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3" onClick={onLogout}>
          Log out
        </Menu.Item>
      </Menu>
    );

    return (
      <Container>
        <Dropdown overlay={menu} trigger={['click']}>
          <Login>
            <span>{isLg ? user.login : loginShort}</span> <DownOutlined />
          </Login>
        </Dropdown>
      </Container>
    );
  }

  return (
    <Container>
      <Link to="/login">{ALLOW_SIGNUP ? 'Log in/Sign up' : 'Log in'}</Link>
    </Container>
  );
}

const Container = styled.div`
  color: ${(props: IThemeProps) => props.theme.colors.accent};
  margin-right: 40px;

  @media (max-width: ${SCREEN_BREAKPOINT.SM}px) {
    margin-right: 0;

    .ant-dropdown-trigger {
      white-space: nowrap;
    }
  }
`;

const Login = styled.div`
  color: ${(props: IThemeProps) => props.theme.colors.text};
  cursor: pointer;
`;

export default HeaderMain;
