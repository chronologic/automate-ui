import { useCallback, useMemo, useState } from 'react';
import { Form, Modal, Button, Checkbox, Typography, Slider, notification } from 'antd';
import styled from 'styled-components';

import { CHAIN_ID } from '../../env';
import { useAuth, useEthers } from '../../hooks';
import { isConnectedToAutomate } from '../../utils';
import CopyInput from '../CopyInput';
import PageTitle from '../PageTitle';

function Config() {
  const { ethereum } = useEthers();
  const { user } = useAuth();
  const [gasPriceAware, setGasPriceAware] = useState(true);
  const [draft, setDraft] = useState(false);
  const [confirmationTime, setConfirmationTime] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const sliderMarks: {
    [key: number]: {
      value: string;
      label: React.ReactNode;
    };
  } = useMemo(
    () => ({
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
    }),
    [confirmationTime]
  );

  const networkName = useMemo(() => {
    let name = 'Automate';
    if (gasPriceAware) {
      name += ' Gas';
    }
    if (draft) {
      name += ' Draft';
    }
    if (confirmationTime) {
      name += ` ${sliderMarks[confirmationTime].value}`;
    }

    return name;
  }, [confirmationTime, draft, gasPriceAware, sliderMarks]);

  const rpcUrl = useMemo(() => {
    let url = `https://rpc.chronologic.network?email=${user.login}&apiKey=${user.apiKey}`;
    if (gasPriceAware) {
      url += '&gasPriceAware=true';
    }
    if (draft) {
      url += '&draft=true';
    }
    if (confirmationTime) {
      url += `&confirmationTime=${sliderMarks[confirmationTime].value}`;
    }

    return url;
  }, [confirmationTime, draft, gasPriceAware, sliderMarks, user.apiKey, user.login]);

  const handleConnect = useCallback(async () => {
    setSubmitted(true);
  }, []);

  const handleCancel = useCallback(async () => {
    setSubmitted(false);
  }, []);

  const handleConfirmConfigured = useCallback(async () => {
    const isConnected = await isConnectedToAutomate(ethereum);
    if (isConnected) {
      notification.success({ message: `You're connected to Automate!` });
      setSubmitted(false);
    } else {
      notification.error({ message: `You're not connected to Automate. Check your configuration.` });
    }
  }, [ethereum]);

  return (
    <Container>
      <PageTitle title="Connect" />
      <Typography.Title level={3} className="title">
        Connection Settings
      </Typography.Title>
      <Checkboxes>
        <CheckboxSection>
          <Checkbox checked={gasPriceAware} disabled={submitted} onChange={(e) => setGasPriceAware(e.target.checked)}>
            <Typography.Paragraph className="subtitle">Gas price aware</Typography.Paragraph>
          </Checkbox>
          <p>
            Once the network gas price falls below the gas cost specified in the transaction, it will be broadcast to
            the network.
          </p>
        </CheckboxSection>
        <CheckboxSection>
          <Checkbox checked={draft} disabled={submitted} onChange={(e) => setDraft(e.target.checked)}>
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
            disabled={submitted}
            tooltipVisible={false}
            onChange={setConfirmationTime}
          />
        </SliderContainer>
      </div>
      <Button type="primary" size="large" onClick={handleConnect}>
        Connect to Automate
      </Button>
      <Modal
        title="Add Automate to MetaMask"
        visible={submitted}
        onOk={handleConfirmConfigured}
        onCancel={handleCancel}
      >
        <MetaMaskConfig>
          <p>Almost there!</p>
          <p>
            Now you just need to add the Automate network configuration to your MetaMask.
            <br />
            To do that, just follow the instructions{' '}
            <a
              href="https://metamask.zendesk.com/hc/en-us/articles/360043227612-How-to-add-custom-Network-RPC-and-or-Block-Explorer"
              rel="noopener noreferrer"
              target="_blank"
            >
              here
            </a>{' '}
            and when you get to the 'Add Network' screen, simply copy and paste all values presented below to their
            respective inputs in MetaMask and save the connection.
          </p>
          <p>When you're done, click 'OK' below.</p>
          <Form layout="vertical">
            <Form.Item label="Network Name">
              <CopyInput value={networkName} inputTitle="Network Name" />
            </Form.Item>
            <Form.Item label="New RPC URL">
              <CopyInput value={rpcUrl} inputTitle="New RPC URL" />
            </Form.Item>
            <Form.Item label="Chain ID">
              <CopyInput value={CHAIN_ID.toString()} inputTitle="Chain ID" />
            </Form.Item>
            <Form.Item label="Currency Symbol">
              <CopyInput value="ETH" inputTitle="Currency Symbol" />
            </Form.Item>
            <Form.Item label="Block Explorer URL">
              <CopyInput
                value="https://automate.chronologic.network/transactions?tx="
                inputTitle="Block Explorer URL"
              />
            </Form.Item>
          </Form>
        </MetaMaskConfig>
      </Modal>
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

const MetaMaskConfig = styled.div`
  .ant-form-item-control-input-content > div {
    width: 100%;
  }

  .ant-col.ant-form-item-label {
    padding-bottom: 0;
  }

  .ant-row.ant-form-item {
    margin-bottom: 8px;
  }
`;

export default Config;
