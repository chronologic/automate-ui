import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Alert } from 'antd';
import styled from 'styled-components';

import { useAutomateConnection } from '../../hooks';
import { MOBILE_SCREEN_THRESHOLD } from '../../constants';

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
        type={connected !== 'none' ? 'success' : 'error'}
        message={
          connected !== 'none'
            ? `You're connected to Automate ${connected} network`
            : `You're not connected to Automate ${connected} network`
        }
        banner
      />
    </Container>
  );
}

const Container = styled.div`
  cursor: pointer;

  @media (max-width: ${MOBILE_SCREEN_THRESHOLD}px) {
    display: none;
  }

  .ant-alert {
    justify-content: center;

    .ant-alert-content {
      flex: none;
      font-weight: 300;
    }
  }
`;

export default ConnectionStatus;
