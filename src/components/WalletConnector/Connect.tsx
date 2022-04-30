import { useCallback } from 'react';
import styled from 'styled-components';
import { Button, notification } from 'antd';
import { Wallet } from 'use-wallet';

interface IProps {
  wallet: Wallet<unknown>;
}

function Connect({ wallet }: IProps) {
  const handleConnect = useCallback(async () => {
    try {
      await wallet.connect('injected');
    } catch (e: any) {
      console.error(e);
      notification.error(e.message);
    }
  }, [wallet]);

  return (
    <Container>
      <Button type="ghost" className="connect-button primary" onClick={handleConnect}>
        Connect to
        <br />
        MetaMask
      </Button>
    </Container>
  );
}

const Container = styled.div`
  cursor: pointer;
  text-transform: uppercase;
  font-size: 14px;
  line-height: 20px;

  .connect-button {
    height: auto;
    padding: 4px 40px;
    text-transform: uppercase;
  }
`;

export default Connect;
