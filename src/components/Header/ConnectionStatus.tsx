import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Alert } from 'antd';
import styled from 'styled-components';

import { useAutomateConnection } from '../../hooks';
import { SCREEN_BREAKPOINT } from '../../constants';
import { capitalizeFirstLetter } from '../../utils';

function ConnectionStatus() {
  const history = useHistory();
  const { connected, connectionParams } = useAutomateConnection();

  const handleClick = useCallback(() => {
    history.push('/connect');
  }, [history]);

  return (
    <Container onClick={handleClick}>
      <Alert
        type={connected ? 'success' : 'error'}
        message={
          connected
            ? `You're connected to Automate ${capitalizeFirstLetter(connectionParams.network)} network`
            : `You're not connected to Automate `
        }
        banner
      />
    </Container>
  );
}

const Container = styled.div`
  cursor: pointer;

  @media (max-width: ${SCREEN_BREAKPOINT.SM}px) {
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
