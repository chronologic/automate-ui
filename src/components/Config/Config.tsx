import { useCallback, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { Form, Modal, Button, Typography, notification, Radio } from 'antd';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import { Network, ChainId } from '../../constants';
import { useAuth, useAutomateConnection } from '../../hooks';
import { CHAIN_ID } from '../../env';
import CopyInput from '../CopyInput';
import PageTitle from '../PageTitle';
import ConnectionSettings from './ConnectionSettings';

function Config() {
  const wallet = useWallet();
  const { checkConnection } = useAutomateConnection();
  const { user } = useAuth();
  const [gasPriceAware, setGasPriceAware] = useState(true);
  const [draft, setDraft] = useState(false);
  const [confirmationTime, setConfirmationTime] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [network, setNetwork] = useState(Network.None);

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
    if (network === Network.Ethereum) {
      handleEthereumConnection();
    } else if (network === Network.Arbitrum) {
      handleArbitrumConnection();
    }
  }, [network]);

  const handleEthereumConnection = useCallback(async () => {
    setSubmitted(true);
    setCompleted(false);
  }, []);

  const handleArbitrumConnection = useCallback(async () => {
    const isMetamaskInstalled = typeof window.ethereum !== 'undefined';
    if (isMetamaskInstalled) {
      arbitrumNetworkConnect();
    } else {
      notification.error({
        message: (
          <span>
            Metamask is not installed. Metamask is required to connect Automate. Install the{' '}
            <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer">
              Metamask extension.
            </a>{' '}
            If you have installed refresh the page.
          </span>
        ),
      });
    }
  }, []);

  const handleCancel = useCallback(async () => {
    setSubmitted(false);
  }, []);

  const handleConfirmConfigured = useCallback(async () => {
    if (!(wallet.status === 'connected')) {
      await wallet.connect('injected');
    }
    const isConnected = await checkConnection();
    if (isConnected) {
      notification.success({ message: `You're connected to Automate!` });
      setSubmitted(false);
      setCompleted(true);
    } else {
      notification.error({
        message: (
          <span>
            You're not connected to Automate. Make sure you followed the
            <br />
            <a
              href="https://blog.chronologic.network/how-to-use-automate-with-xfai-785065a4f306"
              target="_blank"
              rel="noopener noreferrer"
            >
              setup instructions
            </a>{' '}
            correctly.
          </span>
        ),
      });
    }
  }, [checkConnection, wallet]);

  const arbitrumNetworkConnect = useCallback(async () => {
    const arbitrumOneChainId = ethers.utils.hexlify(ChainId.Arbitrum);
    if (typeof window.ethereum !== 'undefined') {
      const currentChainId = await window.ethereum.request({ method: `eth_chainId` });
      if (currentChainId === arbitrumOneChainId) {
        setGasPriceAware(false);
        setDraft(true);
        setConfirmationTime(0);
        setNetwork(Network.Arbitrum);
        notification.success({ message: `You're connected to Automate!` });
      } else {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: arbitrumOneChainId,
                chainName: 'Arbitrum One',
                rpcUrls: ['https://arb1.arbitrum.io/rpc'],
                blockExplorerUrls: ['https://arbiscan.io/'],
                nativeCurrency: {
                  symbol: 'ETH', // 2-6 characters long
                  decimals: 18,
                },
              },
            ],
          });
        } catch (addError) {
          console.log(addError);
        }
      }
    } else {
      notification.error({
        message: (
          <span>
            Metamask is not installed. Metamask is required to connect Automate. Install the{' '}
            <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer">
              Metamask extension.
            </a>{' '}
            If you have installed refresh the page.
          </span>
        ),
      });
    }
  }, []);

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
            onChange={(e) => setNetwork(e.target.value)}
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
