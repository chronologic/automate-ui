import { useCallback, useMemo, useState } from 'react';
import { Form, Modal, Button, Typography, Radio } from 'antd';
import styled from 'styled-components';

import { useAuth, useAutomateConnection } from '../../hooks';
import { Network, ChainId, ConfirmationTime, ethereum } from '../../constants';
import CopyInput from '../CopyInput';
import PageTitle from '../PageTitle';
import ConnectionSettings from './ConnectionSettings';
import { notifications } from './Notifications';

function Config() {
  const { connect } = useAutomateConnection();
  const { user } = useAuth();
  const [gasPriceAware, setGasPriceAware] = useState(true);
  const [draft, setDraft] = useState(false);
  const [confirmationTime, setConfirmationTime] = useState(ConfirmationTime.oneDay);
  const [submitted, setSubmitted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [network, setNetwork] = useState(Network.None);

  const connectionName = useMemo(() => {
    let name = `Automate ${network}`;
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

  const checkMetamaskInstalled = () => {
    const isMetamaskInstalled = !!ethereum;
    if (!isMetamaskInstalled) {
      throw notifications.metamaskNotInstalled();
    }
  };
  const handleNetworkSelection = (network: Network) => {
    setNetwork(network);
    if (network === Network.Ethereum) {
      setGasPriceAware(true);
      setDraft(false);
      setConfirmationTime(ConfirmationTime.oneDay);
    } else if (network === Network.Arbitrum) {
      setGasPriceAware(false);
      setDraft(true);
      setConfirmationTime(ConfirmationTime.immediate);
    }
  };

  const handleConnect = useCallback(async () => {
    checkMetamaskInstalled();
    if (network !== Network.None) {
      setSubmitted(true);
      setCompleted(false);
    }
  }, [network]);

  const handleCancel = useCallback(async () => {
    setSubmitted(false);
  }, []);

  const handleConfirmConfigured = useCallback(async () => {
    const res = await connect();
    if (!res.connected) {
      notifications.notConnectedtoAutomate();
    } else if (res.connectionParams.network === network.toLowerCase()) {
      notifications.connectedToAutomate(network);
      setSubmitted(false);
      setCompleted(true);
    } else {
      notifications.connectedWrongNetwork(res.connectionParams.network, network);
    }
  }, [connect, network]);

  return (
    <Container>
      <PageTitle title="Connect" />
      <Typography.Title level={3} className="title">
        {completed ? 'Congratulations!' : network === Network.Ethereum ? 'Connection Settings' : 'Select Network'}
      </Typography.Title>
      {completed && (
        <Completed>
          <p>You can now start scheduling transactions! </p>
        </Completed>
      )}
      {!completed && (
        <>
          <Radio.Group
            defaultValue={Network.None}
            onChange={(e) => handleNetworkSelection(e.target.value)}
            size="large"
            className="title"
          >
            <Radio.Button value={Network.Ethereum} className="radiobuttons">
              <img alt="eth-network-icon" src="/assets/eth.svg" width="32" height="32" className="network-icon" />
              Ethereum
            </Radio.Button>
            <Radio.Button value={Network.Arbitrum}>
              <img alt="arb-network-icon" src="/assets/arbitrum.svg" width="32" height="32" className="network-icon" />
              Arbitrum
            </Radio.Button>
          </Radio.Group>

          {network === Network.Ethereum && (
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
            disabled={network === Network.None ? true : false}
            onClick={() => handleConnect()}
          >
            Connect to Automate
          </Button>
        </>
      )}

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
              href="https://blog.chronologic.network/how-to-use-automate-with-xfai-785065a4f306"
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
            <Form.Item label="Chain ID">
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
    margin-bottom: 30px;
  }
  .subtitle {
    font-weight: 300;
    font-size: 1.8rem;
    margin-bottom: 16px;
  }
  .radiobuttons {
    margin-right: 50px;
  }
  .network-icon {
    padding: 1px 2px 5px 2px;
  }
  p {
    font-weight: 300;
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
