import { Layout } from 'antd';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { SCREEN_BREAKPOINT } from '../constants';
import { IThemeProps } from '../types';

function Footer() {
  return (
    <Layout.Footer>
      <Wrapper>
        <Container>
          <Column>
            <a href="https://blog.chronologic.network/automate/home" target="_blank" rel="noopener noreferrer">
              What is Automate?
            </a>
            <a href="https://app.chronologic.network" target="_blank" rel="noopener noreferrer">
              <p>Chronos &amp; other dApps</p>
            </a>
            <Link to="/legacy" target="_blank" rel="noopener noreferrer">
              Use legacy app
            </Link>
          </Column>
          <Column>
            <Link to="/transactions">Transaction list</Link>
            <a href="https://chronologic.zendesk.com/hc/en-us" target="_blank" rel="noopener noreferrer">
              Support
            </a>
            <a href="https://blog.chronologic.network/automate-faq-d80956f3ee9" target="_blank" rel="noopener noreferrer">
              FAQ
            </a>
          </Column>
          <Column>
            <a href="https://blog.chronologic.network" target="_blank" rel="noopener noreferrer">
              Blog
            </a>
          </Column>
          <Column>
            <a
              href="https://twitter.com/ChronoLogicETH"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-link"
            >
              Twitter
            </a>
          </Column>
          <Column>
            <a href="https://t.me/chronologicnetwork" target="_blank" rel="noopener noreferrer" className="icon-link">
              Telegram
            </a>
          </Column>
        </Container>
      </Wrapper>
    </Layout.Footer>
  );
}

const Wrapper = styled.div`
  background-color: black;
  color: #a6a6a6;

  a {
    color: #a6a6a6;
    &:hover {
      color: ${(props: IThemeProps) => props.theme.colors.accent};
    }
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 24px 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;

  @media (max-width: ${SCREEN_BREAKPOINT.SM}px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Column = styled.div`
  a {
    display: block;
    margin-left: 8px;
    margin-right: 8px;
    margin-bottom: 16px;
    text-transform: uppercase;
    font-weight: 300;
  }

  @media (max-width: ${SCREEN_BREAKPOINT.SM}px) {
    text-align: center;
  }
`;

export default Footer;
