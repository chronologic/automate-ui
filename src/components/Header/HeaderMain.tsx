import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { useTheme } from '../../hooks';
import WalletConnector from '../WalletConnector';
import FlexSpacer from '../FlexSpacer';
import User from './User';

function HeaderMain() {
  const { theme } = useTheme();

  return (
    <Container>
      <Logos>
        <Link to="/" className="logo-link">
          <img alt="logo" className="logo" src={theme.assets.logoMain} />
        </Link>
        {!!theme.assets.logoPartner && (
          <>
            <div className="plus">+</div>
            <a href={theme.urls?.partnerHomepage} target="_blank" rel="noopener noreferrer" className="logo-link">
              <img alt="logo" className="logo" src={theme.assets.logoPartner} />
            </a>
          </>
        )}
      </Logos>
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
`;

const Logos = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-right: 16px;

  .logo {
    height: 60px;
  }
  .plus {
    font-size: 2rem;
    margin-left: 24px;
    margin-right: 16px;
  }
`;

export default HeaderMain;
