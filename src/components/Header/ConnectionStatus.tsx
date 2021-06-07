import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Alert } from 'antd';
import styled from 'styled-components';

import { useEthers } from '../../hooks';
import { isConnectedToAutomate } from '../../utils';

function ConnectionStatus() {
  const history = useHistory();
  const { ethereum } = useEthers();
  const [connectedToAutomate, setConnectedToAutomate] = useState(false);

  const handleClick = useCallback(() => {
    history.push('/connect');
  }, [history]);

  useEffect(() => {
    checkConnection();
    let intervalId = setInterval(checkConnection, 5000);

    async function checkConnection() {
      const connectedToAutomate = await isConnectedToAutomate(ethereum);

      setConnectedToAutomate(connectedToAutomate);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [ethereum]);

  return (
    <Container onClick={handleClick}>
      <Alert
        type={connectedToAutomate ? 'success' : 'error'}
        message={connectedToAutomate ? "You're connected to Automate" : "You're not connected to Automate"}
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
