import { Alert } from 'antd';
import { detect } from 'detect-browser';
import styled from 'styled-components';

const browser = detect();

function FirefoxAlert() {
  if (browser && browser.name === 'firefox') {
    return (
      <Container>
        <Alert
          message="Warning"
          className="firefox-alert"
          description="Adding a new network might not work for you in Firefox. We recommend using Chrome or Brave."
          type="error"
          showIcon
        />
      </Container>
    );
  } else {
    return null;
  }
}

const Container = styled.div`
  .firefox-alert {
    margin-bottom: 16px;
  }
`;

export default FirefoxAlert;
