import { useEffect, useState } from 'react';
import { Col, Row, Typography, Input, Form } from 'antd';
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

const MAGIC_ADDRESS = '0x539bdE0d7Dbd336b79148AA742883198BBF60342';
const MAGIC_DECIMAL_UNIT = 'ether';
const magicContract = new web3.eth.Contract(ERC20ABI as any, MAGIC_ADDRESS);

function Arbitrum_Magic_Send() {
  const setTx = useStrategyStore((state) => state.setTx);
  const { account, chainId } = useAutomateConnection();
  const strategyChainId = useStrategyStore((state) => state.chainId);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const isCorrectChain = chainId === strategyChainId;

  useEffect(() => {
    try {
      const amountWei = web3.utils.toWei(amount, MAGIC_DECIMAL_UNIT);
      const callData = magicContract.methods.transfer(address, amountWei).encodeABI();

      setTx(StrategyBlock.Arbitrum_Magic_Send, {
        to: MAGIC_ADDRESS,
        data: callData,
        amount: amountWei,
        asset: MAGIC_ADDRESS,
      });
    } catch (e) {
      console.error(e);
    }
  }, [address, amount, setTx]);

  return (
    <Container>
      <BaseBlock
        title={
          <>
            <ExportOutlined />
            <Text className="cardTitle">Send $MAGIC</Text>
          </>
        }
      >
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item
              name={`${StrategyBlock.Arbitrum_Magic_Send}_to`}
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
              name={`${StrategyBlock.Arbitrum_Magic_Send}_amount`}
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
    magicContract.methods.balanceOf(account).call()
  );
  const balanceEth = Number(web3.utils.fromWei(balanceWei, MAGIC_DECIMAL_UNIT));

  if (balanceEth < amount) {
    throw new Error(`You need at least ${amount} $MAGIC in your wallet to be able to Automate`);
  }
}

const Container = styled.div``;

export default Arbitrum_Magic_Send;
