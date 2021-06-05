import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Alert } from 'antd';
import styled from 'styled-components';

import { useEthers } from '../../hooks';

function ConnectionStatus() {
  const history = useHistory();
  const { connected, ethereum } = useEthers();
  const [connectedToAutomate, setConnectedToAutomate] = useState(false);

  const handleClick = useCallback(() => {
    history.push('/connect');
  }, [history]);

  useEffect(() => {
    checkConnection();
    let intervalId = setInterval(checkConnection, 5000);

    async function checkConnection() {
      if (connected) {
        const res = await ethereum?.request({
          method: 'eth_call',
          params: [
            {
              from: '0x0000000000000000000000000000000000000000',
              // md5 hash of 'automate'
              to: '0x00000000e7fdc80c0728d856260f92fde10af019',
            },
          ],
        });

        setConnectedToAutomate(res.includes('automate'));
      }
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [connected, ethereum]);

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
