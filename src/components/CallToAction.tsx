import styled from 'styled-components';

import { useTheme } from '../hooks';

function CallToAction() {
  const { theme } = useTheme();

  return (
    <Container>
      <Action className="automate">
        <div className="logo">Automate</div>
        <div className="description">Learn more about how to use Automate</div>
        <div className="link">
          <a href="https://blog.chronologic.network/" target="_blank" rel="noopener noreferrer">
            Our blog →
          </a>
        </div>
      </Action>
      {theme.name === 'xfai' && (
        <Action className="xfai">
          <div className="logo">xfai</div>
          <div className="description">Go to XFai now and start saving gas today!</div>
          <div className="link">
            <a href="https://xfai.com/" target="_blank" rel="noopener noreferrer">
              Go to XFai →
            </a>
          </div>
        </Action>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

const Action = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: ${(props) => props.theme.colors.border};
  padding: 24px;

  &:first-child {
    background-color: ${(props) => props.theme.colors.weak};
  }

  &.automate a {
    color: #2f4ffd;
  }
  &.xfai a {
    color: #fc307b;
  }
`;

export default CallToAction;
