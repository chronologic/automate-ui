import styled from 'styled-components';
import { useAutomateConnection } from '../../hooks';

import Connect from './Connect';
import Connected from './Connected';

interface IProps {
  className: string;
}

function WalletConnector({ className = '' }: Partial<IProps>) {
  const { connected } = useAutomateConnection();

  return <Container className={className}>{connected ? <Connected /> : <Connect />}</Container>;
}

const Container = styled.div``;

export default WalletConnector;
