import styled from 'styled-components';

import { useTheme } from '../hooks';
// import

function CallToAction() {
  const { theme } = useTheme();

  return (
    <Container>
      <Action className={`automate ${theme.name === 'xfai' ? 'right' : ''}`}>
        <div className="content">
          <div className="logo">
            <img src={`/assets/themes/${theme.name}__logo_main.svg`} alt="Automate logo" />
          </div>
          <div className="description">Learn more about how to use Automate</div>
          <div className="link">
            <a href="https://blog.chronologic.network/" target="_blank" rel="noopener noreferrer">
              Our blog →
            </a>
          </div>
        </div>
      </Action>
      {theme.name === 'xfai' && (
        <Action className="xfai left">
          <div className="content">
            <div className="logo">
              <img src="/assets/themes/xfai__logo_partner.svg" alt="XFai logo" />
            </div>
            <div className="description">Go to XFai now and start saving gas today!</div>
            <div className="link">
              <a href="https://farm.xfai.com/" target="_blank" rel="noopener noreferrer">
                Go to XFai →
              </a>
            </div>
          </div>
        </Action>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
`;

const Action = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: ${(props) => props.theme.colors.border};
  padding: 24px 0;
  justify-content: center;
  align-items: center;

  &:first-child {
    background-color: ${(props) => props.theme.colors.weak};
  }

  &.automate {
    &.right {
      align-items: flex-end;
      .content {
        padding-right: 90px;
      }
    }
    a {
      color: #2f4ffd;
    }
  }
  &.xfai {
    &.left {
      align-items: flex-start;
      .content {
        padding-left: 90px;
      }
    }
    a {
      color: #fc307b;
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .logo {
      margin-bottom: 12px;
    }
    .logo img {
      height: 50px;
    }
    .description {
      margin-bottom: 12px;
    }
  }
`;

export default CallToAction;
