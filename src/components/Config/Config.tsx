import { useCallback, useMemo, useState } from 'react';
import { Form, Modal, Button, Checkbox, Typography, Slider, notification, Radio } from 'antd';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';

import { CHAIN_ID } from '../../env';
import { useAuth, useAutomateConnection } from '../../hooks';
import CopyInput from '../CopyInput';
import PageTitle from '../PageTitle';
import { MOBILE_SCREEN_THRESHOLD } from '../../constants';

function Config() {
  const wallet = useWallet();
  const { checkConnection } = useAutomateConnection();
  const { user } = useAuth();
  const [gasPriceAware, setGasPriceAware] = useState(true);
  const [draft, setDraft] = useState(false);
  const [confirmationTime, setConfirmationTime] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [networkvalue, setnetworkValue] = useState(1);

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

  const handleConnect = useCallback((network: string) => {
    console.log('network: ' + network);
    if (network == 'Etherium') {
      setSubmitted(true);
      setCompleted(false);
    } else if (network == 'Arbitrum') {
      // Check metamask extension is installed
      if (typeof window.ethereum !== 'undefined') {
        setGasPriceAware(false);
        setDraft(true);
        setConfirmationTime(0);
        // network: arbitrum (this is a new parameter that you will have to add,
        //it needs to be added to the connection string)
        ArbitrumNetworkConnect();
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

  const ArbitrumNetworkConnect = useCallback(async () => {
    const binanceTestChainId = '0x66eeb'; // arbitrum test net
    if (typeof window.ethereum !== 'undefined') {
      const chainId = await window.ethereum.request({ method: `eth_chainId` });
      if (chainId === binanceTestChainId) {
        notification.success({ message: `You're connected to Automate!` });
      } else {
        console.log('oulalal, switch to the correct network,chainid: ' + chainId);
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: binanceTestChainId }],
          });
          console.log('You have succefully switched to Arbitrum Test network');
        } catch (chainerror) {
          if (chainerror.code === 4902) {
            console.log('This network is not available in your metamask, please add it');
          }
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: binanceTestChainId,
                  chainName: 'Arbitrum Testnet',
                  rpcUrls: ['https://rinkeby.arbitrum.io/rpc'],
                  blockExplorerUrls: ['https://testnet.arbiscan.io/'],
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
        {completed ? 'Congratulations!' : networkvalue < 2 ? 'Connection Settings' : 'Select Network'}
      </Typography.Title>
      {completed && (
        <Completed>
          <p>You can now start scheduling transactions! </p>
        </Completed>
      )}
      {!completed && (
        <>
          <Radio.Group
            defaultValue={1}
            onChange={(e) => setnetworkValue(e.target.value)}
            size="large"
            className="title"
          >
            <Radio.Button value={1} className="radiobuttons">
              <img alt="eth-network-icon" src="/assets/eth.svg" width="32" height="32" className="network-icon" />
              Ethereum
            </Radio.Button>
            <Radio.Button value={2}>
              <img alt="eth-network-icon" src="/assets/arbitrum.svg" width="32" height="32" className="network-icon" />
              Arbitrum
            </Radio.Button>
            {/* if we want to add more networks.
              <Radio value={3}>C</Radio>
              <Radio value={4}>D</Radio>
            */}
          </Radio.Group>

          {networkvalue < 2 && (
            <>
              <Checkboxes>
                <CheckboxSection>
                  <Checkbox
                    checked={gasPriceAware}
                    disabled={submitted}
                    onChange={(e) => setGasPriceAware(e.target.checked)}
                  >
                    <Typography.Paragraph className="subtitle">Gas price aware</Typography.Paragraph>
                  </Checkbox>
                  <p>
                    Once the network gas price falls below the gas cost specified in the transaction, it will be
                    broadcast to the network.
                  </p>
                </CheckboxSection>
                <CheckboxSection>
                  <Checkbox checked={draft} disabled={submitted} onChange={(e) => setDraft(e.target.checked)}>
                    <Typography.Paragraph className="subtitle">Draft mode (Advanced)</Typography.Paragraph>
                  </Checkbox>
                  <p>
                    No transaction will be broadcast to the Ethereum network until you go to the Transaction list and
                    specify additional conditions.
                  </p>
                </CheckboxSection>
              </Checkboxes>
              <div>
                <Typography.Paragraph className="subtitle">Estimated Confirmation Time</Typography.Paragraph>
                <p>
                  Our algorithms analyze historical gas prices in real time to best propose a gas price for you. Longer
                  wait times generally correspond to cheaper gas prices. Since we cannot control the Ethereum network,
                  this is NOT a guaranteed confirmation time.
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
            </>
          )}
          <Button type="primary" size="large" onClick={() => handleConnect(networkvalue < 2 ? 'Etherium' : 'Arbitrum')}>
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

const Checkboxes = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 24px;

  @media (max-width: ${MOBILE_SCREEN_THRESHOLD}px) {
    flex-direction: column;
  }
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

  @media (max-width: ${MOBILE_SCREEN_THRESHOLD}px) {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  }

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

const Completed = styled.div``;

export default Config;
