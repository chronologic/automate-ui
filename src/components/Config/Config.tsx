import { useCallback, useState } from 'react';
import { Button, Checkbox, Typography, Slider } from 'antd';
import styled from 'styled-components';

import PageTitle from '../PageTitle';
import { useAuth } from '../../hooks';

function Config() {
  const [gasPriceAware, setGasPriceAware] = useState(true);
  const [draft, setDraft] = useState(false);
  const [confirmationTime, setConfirmationTime] = useState(1);

  const sliderMarks = {
    0: {
      value: '0',
      label: <div className={confirmationTime === 0 ? 'selected' : ''}>Immediate</div>,
    },
    1: {
      value: '1d',
      label: (
        <div className={confirmationTime === 1 ? 'selected' : ''}>
          <span>24 hours</span>
          <br />
          <span className="note">(recommended)</span>
        </div>
      ),
    },
    2: {
      value: '3d',
      label: <div className={confirmationTime === 2 ? 'selected' : ''}>3 days</div>,
    },
    3: {
      value: '5d',
      label: <div className={confirmationTime === 3 ? 'selected' : ''}>5 days</div>,
    },
  };

  const handleConnect = useCallback(async () => {}, []);

  return (
    <Container>
      <PageTitle title="Connect" />
      <Typography.Title level={3} className="title">
        Connection Settings
      </Typography.Title>
      <Checkboxes>
        <CheckboxSection>
          <Checkbox checked={gasPriceAware} onChange={(e) => setGasPriceAware(e.target.checked)}>
            <Typography.Paragraph className="subtitle">Gas price aware</Typography.Paragraph>
          </Checkbox>
          <p>
            Once the network gas price falls below the gas cost specified in the transaction, it will be broadcast to
            the network.
          </p>
        </CheckboxSection>
        <CheckboxSection>
          <Checkbox checked={draft} onChange={(e) => setDraft(e.target.checked)}>
            <Typography.Paragraph className="subtitle">Draft mode (Advanced)</Typography.Paragraph>
          </Checkbox>
          <p>
            No transaction will be broadcast to the Ethereum network until you go to the Transaction list and specify
            additional conditions.
          </p>
        </CheckboxSection>
      </Checkboxes>
      <div>
        <Typography.Paragraph className="subtitle">Estimated Confirmation Time</Typography.Paragraph>
        <p>
          Out algorithms analyze historical gas prices in real time to best propose a gas price for you. Longer wait
          times generally correspond to cheaper gas prices. Since we cannot control the Ethereum network, this is NOT a
          guaranteed confirmation time.
        </p>
        <SliderContainer>
          <Slider
            marks={sliderMarks}
            step={1}
            value={confirmationTime}
            min={0}
            max={3}
            tooltipVisible={false}
            onChange={setConfirmationTime}
          />
        </SliderContainer>
      </div>
      <Button type="primary" size="large" onClick={handleConnect}>
        Connect to Automate
      </Button>
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
  padding: 60px 20px 20px 20px;
  width: 100%;
  max-width: 540px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    font-weight: 300;
    margin-bottom: 30px;
  }
  .subtitle {
    font-weight: 300;
    font-size: 1.8rem;
    margin-bottom: 16px;
  }
  p {
    font-weight: 300;
  }
`;

const Checkboxes = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 24px;
`;

const CheckboxSection = styled.div`
  flex: 1;

  &:first-child {
    padding-right: 16px;
  }
`;

const SliderContainer = styled.div`
  width: 100%;
  margin-bottom: 100px;

  .ant-slider-mark {
    white-space: nowrap;

    .ant-slider-mark-text {
      color: ${(props) => props.theme.colors.text};
      font-weight: 300;

      .note.note {
        font-weight: 300;
      }
    }

    .ant-slider-mark-text-active .selected {
      font-weight: bold;
    }
  }
`;

export default Config;
