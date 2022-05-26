import { useCallback, useMemo, useState } from 'react';
import { Form, Modal, Button, Typography, Radio, Alert } from 'antd';
import styled from 'styled-components';

import { Network, ChainId, ConfirmationTime, ethereum, strategyPathKey } from '../../constants';
import { useAuth, useAutomateConnection } from '../../hooks';
import { capitalizeFirstLetter } from '../../utils';
import CopyInput from '../CopyInput';
import PageTitle from '../PageTitle';
import ConnectionSettings from './ConnectionSettings';
import { detect } from 'detect-browser';

const { Link, Text } = Typography;

function FirefoxAlertMessage() {
  return (
    <Alert
      message="Warning"
      className="FirefoxAlert"
      description="Adding a new network might not work for you in Firefox. We recommend using Chrome or Brave."
      type="error"
      showIcon
    />
  );
}

function FirefoxAlert() {
  const browser = detect();

  if (browser && browser.name === 'firefox') {
    return <FirefoxAlertMessage />;
  } else {
    return null;
  }
}

function Config() {
  const { connect } = useAutomateConnection();
  const { user } = useAuth();
  const [gasPriceAware, setGasPriceAware] = useState(true);
  const [draft, setDraft] = useState(false);
  const [confirmationTime, setConfirmationTime] = useState(ConfirmationTime.oneDay);
  const [submitted, setSubmitted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [addedConnetionModalDisplay, setAddedConnetionModalDisplay] = useState(false);
  const [network, setNetwork] = useState(Network.none);
  const redirectPage = sessionStorage.getItem(strategyPathKey) || '';

  const connectionName = useMemo(() => {
    let name = `Automate ${capitalizeFirstLetter(network)}`;
    if (gasPriceAware) {
      name += ' Gas';
    }
    if (draft) {
      name += ' Draft';
    }
    if (confirmationTime) {
      name += ` ${confirmationTime}`;
    }
    return name;
  }, [confirmationTime, draft, gasPriceAware, network]);

  const rpcUrl = useMemo(() => {
    let url = `https://rpc.chronologic.network?email=${user.login}&apiKey=${user.apiKey}`;
    if (gasPriceAware) {
      url += '&gasPriceAware=true';
    }
    if (draft) {
      url += '&draft=true';
    }
    if (confirmationTime) {
      url += `&confirmationTime=${confirmationTime}`;
    }
    url += `&network=${network.toLowerCase()}`;

    return url;
  }, [confirmationTime, draft, gasPriceAware, network, user.apiKey, user.login]);

  const handleNetworkSelection = (network: Network) => {
    setNetwork(network);
    if (network === Network.ethereum) {
      setGasPriceAware(true);
      setDraft(false);
      setConfirmationTime(ConfirmationTime.oneDay);
    } else if (network === Network.arbitrum) {
      setGasPriceAware(false);
      setDraft(true);
      setConfirmationTime(ConfirmationTime.immediate);
    }
  };

  const handleConnect = useCallback(async () => {
    if (network !== Network.none) {
      setSubmitted(true);
      setCompleted(false);
    }
  }, [network]);

  const handleAlreadyConnected = useCallback(async () => {
    await connect({ desiredNetwork: network });
    setCompleted(true);
  }, [connect, network]);

  const handleCancel = useCallback(async () => {
    setSubmitted(false);
    setAddedConnetionModalDisplay(false);
  }, []);

  const handleConfirmConfigured = useCallback(async () => {
    await connect({ desiredNetwork: network, notifySuccess: true });
    setSubmitted(false);
    setCompleted(true);
  }, [connect, network]);

  return (
    <Container>
      <PageTitle title="Connect" />
      <Typography.Title level={3} className="title">
        {completed ? '' : 'Connect Automate to MetaMask'}
      </Typography.Title>
      <Typography.Title level={3} className="subtitle">
        {completed ? 'Congratulations!' : network === Network.ethereum ? 'Connection Settings' : 'Select Network'}
      </Typography.Title>
      {completed && (
        <Completed>
          <p>
            You can now <a href={'/' + redirectPage}> start scheduling transactions! </a>
          </p>
        </Completed>
      )}
      {!completed && (
        <>
          <Radio.Group
            defaultValue={Network.none}
            onChange={(e) => handleNetworkSelection(e.target.value)}
            size="large"
            className="title"
          >
            <img alt="eth-network-icon" src="/assets/eth.svg" width="36" height="36" className="network-icon" />
            <Radio value={Network.ethereum} className="radiobuttons">
              Ethereum
            </Radio>
            <img alt="arb-network-icon" src="/assets/arbitrum.svg" width="36" height="36" className="network-icon" />
            <Radio value={Network.arbitrum}>Arbitrum (MAGIC)</Radio>
          </Radio.Group>

          {network === Network.ethereum && (
            <ConnectionSettings
              gasPriceAware={gasPriceAware}
              setGasPriceAware={setGasPriceAware}
              draft={draft}
              setDraft={setDraft}
              confirmationTime={confirmationTime}
              setConfirmationTime={setConfirmationTime}
              submitted={submitted}
            />
          )}
          <Button
            type="primary"
            size="large"
            className="AddAutomateButton"
            disabled={network === Network.none ? true : false}
            onClick={() => handleConnect()}
          >
            Add Automate to MetaMask
          </Button>
          <Link disabled={network === Network.none ? true : false} onClick={() => handleAlreadyConnected()}>
            I've already added MetaMask connection
          </Link>
          <Alert
            message="Not sure what to do here?"
            description={
              <Text className="alert-txt">
                Read the tutorial on{' '}
                <a
                  href="https://blog.chronologic.network/how-to-sign-up-to-automate-and-claim-your-magic-rewards-cf67fca1ddb3"
                  target="_blank"
                  rel="noreferrer"
                >
                  How to sign up to Automate and claim your $MAGIC✨ rewards.
                </a>
              </Text>
            }
            type="info"
            showIcon
          />
        </>
      )}

      <Modal
        title="Add Automate to MetaMask"
        visible={submitted}
        onOk={handleConfirmConfigured}
        onCancel={handleCancel}
      >
        <MetaMaskConfig>
          <FirefoxAlert />
          <p>Almost there!</p>
          <p>
            Now you just need to add the Automate network configuration to your MetaMask.
            <br />
            To do that, just follow the instructions{' '}
            <a
              href="https://blog.chronologic.network/how-to-sign-up-to-automate-and-claim-your-magic-rewards-cf67fca1ddb3"
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
              <CopyInput value={connectionName} inputTitle="Network Name" />
            </Form.Item>
            <Form.Item label="New RPC URL">
              <CopyInput value={rpcUrl} inputTitle="New RPC URL" />
            </Form.Item>
            <Form.Item label="Chain ID (Metamask may highlight red, that is OK)">
              <CopyInput value={ChainId[network].toString()} inputTitle="Chain ID" />
            </Form.Item>
            <Form.Item label="Currency Symbol">
              <CopyInput value="ETH" inputTitle="Currency Symbol" />
            </Form.Item>
            <Form.Item label="Block Explorer URL">
              <CopyInput
                value="https://automate.chronologic.network/transactions?query="
                inputTitle="Block Explorer URL"
              />
            </Form.Item>
          </Form>
        </MetaMaskConfig>
      </Modal>

      <Modal
        title="Wrong Metamask network"
        visible={addedConnetionModalDisplay}
        onOk={handleConfirmConfigured}
        onCancel={handleCancel}
        centered
      >
        <MetaMaskConfig>
          <p>
            You are connected to the wrong network. Please switch the network in Metamask to{' '}
            <strong> {connectionName}</strong>{' '}
          </p>
        </MetaMaskConfig>
      </Modal>
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
  padding: 60px 20px 50px 20px;
  width: 100%;
  max-width: 540px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    font-weight: 300;
    margin-bottom: 20px;
  }
  .subtitle {
    font-weight: 300;
    font-size: 1.8rem;
    margin-bottom: 20px;
  }
  .radiobuttons {
    margin-right: 90px;
  }
  .network-icon {
    margin: 0 15px 8px;
  }
  p {
    font-weight: 300;
  }
  .AddAutomateButton {
    margin-bottom: 16px;
  }
  a.ant-typography.ant-typography-disabled,
  a.ant-typography.ant-typography-disabled:hover {
    color: #3e3e3e;
  }
  .ant-alert-with-description {
    margin-top: 60px;
  }
  .alert-txt {
    color: rgba(0, 0, 0, 0.85);
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
const Completed = styled.div``;

export default Config;
