import { Link } from 'react-router-dom';
import styled from 'styled-components';

import WalletConnector from '../WalletConnector';
import FlexSpacer from '../FlexSpacer';
import logo from './logo.svg';
import User from './User';

function HeaderMain() {
  return (
    <Container>
      <Link to="/" className="logo-link">
        <img alt="logo" className="logo" src={logo} />
      </Link>
      <FlexSpacer />
      <User />
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
