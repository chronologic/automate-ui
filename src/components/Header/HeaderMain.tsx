import { Link } from 'react-router-dom';
import styled from 'styled-components';

import logo from './logo.svg';
import WalletConnector from '../WalletConnector';

function HeaderMain() {
  return (
    <Container>
      <Link to="/" className="logo-link">
        <img alt="logo" className="logo" src={logo} />
      </Link>
      <WalletConnector />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 8px 0;

  .logo {
    height: 60px;
  }
`;

export default HeaderMain;
