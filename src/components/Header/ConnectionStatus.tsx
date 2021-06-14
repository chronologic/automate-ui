import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Alert } from 'antd';
import styled from 'styled-components';

import { useAutomateConnection } from '../../hooks';

function ConnectionStatus() {
  const history = useHistory();
  const { connected, checkConnection } = useAutomateConnection();

  const handleClick = useCallback(() => {
    history.push('/connect');
  }, [history]);

  useEffect(() => {
    let intervalId = setInterval(checkConnection, 5000);

    checkConnection();

    return () => {
      clearInterval(intervalId);
    };
  }, [checkConnection]);

  return (
    <Container onClick={handleClick}>
      <Alert
        type={connected ? 'success' : 'error'}
        message={connected ? "You're connected to Automate" : "You're not connected to Automate"}
        banner
      />
    </Container>
  );
}

const Container = styled.div`
  cursor: pointer;

  .ant-alert {
    justify-content: center;

    .ant-alert-content {
      flex: none;
      font-weight: 300;
    }
  }
`;

export default ConnectionStatus;
