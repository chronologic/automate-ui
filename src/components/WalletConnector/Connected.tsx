import styled from 'styled-components';
import { Menu, Dropdown, Typography } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

import { shortAddress } from '../../utils';
import { useAutomateConnection } from '../../hooks';

const { Text } = Typography;

function Connected() {
  const { account, connected, reset } = useAutomateConnection();

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<PoweroffOutlined />} onClick={reset}>
        Disconnect
      </Menu.Item>
    </Menu>
  );

  return account ? (
    <Dropdown trigger={['click']} overlay={menu}>
      <Container>
        <Jazzicon diameter={30} seed={jsNumberForAddress(account)} />
        <Content>
          <Text title={account || ''} className="address">
            {shortAddress(account)}
          </Text>
          <Text className="network">{connected ? 'Automate' : 'Ethereum'}</Text>
        </Content>
      </Container>
    </Dropdown>
  ) : null;
}

const Container = styled.div`
  cursor: pointer;
  padding: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 4px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;

  .address {
    margin-bottom: 4px;
  }
  .network {
    text-transform: uppercase;
    font-weight: 100;
  }
`;

export default Connected;
