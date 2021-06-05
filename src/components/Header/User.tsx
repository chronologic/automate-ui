import { Link } from 'react-router-dom';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import { useAuth } from '../../hooks';
import { IThemeProps } from '../../types';

function HeaderMain() {
  const { isAuthenticated, user, onLogout } = useAuth();

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
            {user.login} <DownOutlined />
          </Login>
        </Dropdown>
      </Container>
    );
  }

  return (
    <Container>
      <Link to="/">
        Log in
        {/* Log in/Sign up */}
      </Link>
    </Container>
  );
}

const Container = styled.div`
  color: ${(props: IThemeProps) => props.theme.colors.accent};
  margin-right: 40px;
`;

const Login = styled.div`
  color: ${(props: IThemeProps) => props.theme.colors.text};
  cursor: pointer;
`;

export default HeaderMain;
