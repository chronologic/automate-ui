import { useEffect, useState } from 'react';
import { Col, Typography, Input, Form } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Web3 from 'web3';

import ERC20ABI from '../../../abi/ERC20.json';
import { useStrategyStore } from '../../../hooks';
import { StrategyBlock } from '../../../constants';
import { ethereumAddressValidator } from '../../../utils';
import BaseBlock from './BaseBlock';

const { Text } = Typography;
const web3 = new Web3();

const MAGIC_ADDRESS = '0x539bdE0d7Dbd336b79148AA742883198BBF60342';
const MAGIC_DECIMAL_UNIT = 'ether';
const magicContract = new web3.eth.Contract(ERC20ABI as any);

function MagicSend() {
  const setTx = useStrategyStore((state) => state.setTx);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');

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
        <Col flex="390px">
          <Form.Item
            name={`${StrategyBlock.Arbitrum_Magic_Send}_to`}
            rules={[
              { required: true, message: 'Recipient address is required' },
              { validator: (_, value) => ethereumAddressValidator(value) },
            ]}
          >
            <Input size="large" placeholder="To address" onChange={(e) => setAddress(e.target.value)} />
          </Form.Item>
        </Col>
        <Col flex="auto">
          <Form.Item
            name={`${StrategyBlock.Arbitrum_Magic_Send}_amount`}
            rules={[{ required: true, message: 'Amount is required' }]}
          >
            <Input size="large" placeholder="Amount" onChange={(e) => setAmount(e.target.value)} />
          </Form.Item>
        </Col>
      </BaseBlock>
    </Container>
  );
}

const Container = styled.div``;

export default MagicSend;
