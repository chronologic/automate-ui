import { useEffect, useState } from 'react';
import { Col, Row, Typography, Input, Form, Checkbox } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Web3 from 'web3';

import ERC20ABI from '../../../abi/ERC20.json';
import { useAutomateConnection, useStrategyStore } from '../../../hooks';
import { ethereum, StrategyBlock } from '../../../constants';
import { ethereumAddressValidator, retryRpcCallOnIntermittentError } from '../../../utils';
import BaseBlock from './BaseBlock';

const { Text } = Typography;
const web3 = new Web3(ethereum as any);

const verseAddress = '0x249cA82617eC3DfB2589c4c17ab7EC9765350a18';
const verseContract = new web3.eth.Contract(ERC20ABI as any, verseAddress);
const verseDecimalUnit = 'ether';

function Ethereum_Verse_Send() {
  const setTx = useStrategyStore((state) => state.setTx);
  const strategyChainId = useStrategyStore((state) => state.chainId);
  const { account, chainId } = useAutomateConnection();
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [withFallback, setWithFallback] = useState(true);
  const isCorrectChain = chainId === strategyChainId;

  useEffect(() => {
    try {
      const amountWei = web3.utils.toWei(amount, verseDecimalUnit);
      const callData = verseContract.methods.transfer(address, amountWei).encodeABI();

      setTx(StrategyBlock.Ethereum_Verse_Send, {
        to: verseAddress,
        data: callData,
        amount: amountWei,
        asset: verseAddress,
        fallback: withFallback,
      });
    } catch (e) {
      console.error(e);
    }
  }, [address, amount, withFallback, setTx]);

  return (
    <Container>
      <BaseBlock
        title={
          <>
            <ExportOutlined />
            <Text className="cardTitle">Send $VERSE</Text>
          </>
        }
      >
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item
              name={`${StrategyBlock.Ethereum_Verse_Send}_to`}
              validateFirst
              rules={[
                { required: true, message: 'Recipient address is required' },
                { validator: (_, value) => ethereumAddressValidator(value) },
              ]}
            >
              <Input size="large" placeholder="To address" onChange={(e) => setAddress(e.target.value)} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name={`${StrategyBlock.Ethereum_Verse_Send}_amount`}
              validateFirst
              rules={[
                { required: true, message: 'Amount is required' },
                {
                  validator: (_, value) =>
                    isCorrectChain ? tokenBalanceValidator(account!, value) : Promise.resolve(value),
                },
              ]}
            >
              <Input size="large" placeholder="Amount" onChange={(e) => setAmount(e.target.value)} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name={`${StrategyBlock.Ethereum_Verse_Send}_withFallback`}
              label="Fallback"
              tooltip="Enabling this option will generate a fallback Claim tx for every Send. The fallback tx will be executed if there's not enough $VERSE tokens in your wallet. Without the fallback, the strategy is more likely to get stuck but requires you to sign more transactions."
              colon={false}
            >
              <Checkbox checked={withFallback} onChange={(e) => setWithFallback(!withFallback)} />
            </Form.Item>
          </Col>
        </Row>
      </BaseBlock>
    </Container>
  );
}

async function tokenBalanceValidator(account?: string, amount?: number): Promise<void> {
  if (!amount) {
    return;
  }

  if (!ethereum || !account) {
    throw new Error('Connect to Automate to validate amount');
  }

  const balanceWei = await retryRpcCallOnIntermittentError<string>(async () =>
    verseContract.methods.balanceOf(account).call()
  );
  const balanceEth = Number(web3.utils.fromWei(balanceWei, verseDecimalUnit));

  if (balanceEth < amount) {
    throw new Error(`You need at least ${amount} $VERSE in your wallet to be able to Automate`);
  }
}

const Container = styled.div``;

export default Ethereum_Verse_Send;
