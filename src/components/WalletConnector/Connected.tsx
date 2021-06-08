import { useCallback } from 'react';
import styled from 'styled-components';
import { Menu, Dropdown, Typography } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';
import { Wallet } from 'use-wallet';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

import { shortAddress } from '../../utils';

interface IProps {
  wallet: Wallet<unknown>;
}

const { Text } = Typography;

function Connected({ wallet }: IProps) {
  const handleDisconnect = useCallback(() => wallet.reset(), [wallet]);

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<PoweroffOutlined />} onClick={handleDisconnect}>
        Disconnect
      </Menu.Item>
    </Menu>
  );

  return wallet?.account ? (
    <Dropdown trigger={['click']} overlay={menu}>
      <Container>
        <Jazzicon diameter={30} seed={jsNumberForAddress(wallet.account)} />
        <Content>
          <Text title={wallet.account || ''} className="address">
            {shortAddress(wallet.account)}
          </Text>
          <Text className="network">Ethereum</Text>
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
  border: 1px solid #d9d9d9;
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
