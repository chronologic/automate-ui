import styled from 'styled-components';
import { Button } from 'antd';

import { useAutomateConnection } from '../../hooks';

function Connect() {
  const { connect } = useAutomateConnection();

  return (
    <Container>
      <Button type="ghost" className="connect-button primary" onClick={() => connect()}>
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
