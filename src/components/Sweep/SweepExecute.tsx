import { useCallback, useState, useEffect } from 'react';
import { Form, Input, Button, notification, Typography } from 'antd';
import { ethers } from 'ethers';
import styled from 'styled-components';

import { ethereumAddressValidator } from '../../utils';
import { useMetamask } from '../../hooks/useMetamask';
import { ChainId } from '../../constants';
import { contractBalanceOf, contractTransferFrom, contractAllowance } from './useSweep';

const { Text } = Typography;

function SweepExecute() {
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);

  const [fromAddress, setFromAddress] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [allowance, setAllowance] = useState(0);

  const [form] = Form.useForm();

  const { changeNetwork } = useMetamask();

  const handleFromChange = useCallback(
    (e) => {
      setFromAddress(e.target.value);
    },
    [setFromAddress]
  );

  useEffect(() => {
    const validAFromAddress = ethers.utils.isAddress(fromAddress);
    const getBalance = async () => {
      const balanceEth = await contractBalanceOf(fromAddress);
      setBalance(balanceEth[1]);
    };

    const validToAddress = ethers.utils.isAddress(to);
    const getAllowance = async () => {
      const balanceWei = await contractAllowance(fromAddress, to);
      setAllowance(balanceWei);
    };

    if (validAFromAddress) {
      try {
        getBalance();
      } catch (e) {
        console.log(e);
      }
    }
    if (validAFromAddress && validToAddress) {
      try {
        getAllowance();
        setValid(true);
      } catch (e) {
        console.log(e);
      }
    } else {
      setValid(false);
    }
  }, [fromAddress, to]);

  const handleToChange = useCallback(
    (e) => {
      setTo(e.target.value);
    },
    [setTo]
  );

  const handleAmountChange = useCallback(
    (e) => {
      setAmount(e.target.value);
    },
    [setAmount]
  );

  const handleTransfer = useCallback(async () => {
    try {
      await form.validateFields();

      setLoading(true);
      await changeNetwork(ChainId.arbitrum);

      await contractTransferFrom(fromAddress, to, amount);

      notification.success({
        message: `From ${fromAddress} to ${to} ${amount} Magic has been transferred succesffuly. `,
      });
    } catch (e) {
      console.error(e);
      const error = (e as any)?.message || 'Error';
      notification.error({ message: error });
    } finally {
      setLoading(false);
    }
  }, [fromAddress, to, amount, changeNetwork, form]);

  const setAmountToMax = () => setAmount(balance);

  return (
    <Container>
      <Typography.Title level={5} className="subtitle">
        Transfer Magic ✨ Tokens
      </Typography.Title>
      <Form.Item
        name="fromAddress"
        label="From Address:"
        rules={[
          { required: true, message: 'Address is required' },
          { validator: (_, value) => ethereumAddressValidator(value) },
        ]}
        className="title"
      >
        <Input
          type="text"
          placeholder="The Address Magic Token's will be transfered from"
          value={fromAddress}
          onChange={handleFromChange}
          required={true}
        />
      </Form.Item>
      <Form.Item label="Balance">
        <Text>{balance}</Text>
      </Form.Item>
      <Form.Item
        name="toAddress"
        label="To Address:"
        rules={[
          { required: true, message: 'Address is required' },
          { validator: (_, value) => ethereumAddressValidator(value) },
        ]}
        className="title"
      >
        <Input
          type="text"
          placeholder="The Address Magic Token's will be transfered to"
          value={to}
          required={true}
          onChange={handleToChange}
        />
      </Form.Item>
      <Form.Item label="Allowance">
        <Text>{allowance} </Text>
      </Form.Item>
      <Form.Item
        name="approveAmount"
        label="Amount:"
        rules={[
          { required: true, message: 'Amount is required' },
          { validator: (_, value) => validateAmount(value, balance) },
        ]}
        required={true}
      >
        <Input.Group compact>
          <Input
            type="number"
            placeholder="Amount of tokens"
            value={amount}
            onChange={handleAmountChange}
            required={true}
            style={{ width: 'calc(100% - 65px)' }}
          />
          <Button type="primary" onClick={setAmountToMax}>
            Max
          </Button>
        </Input.Group>
      </Form.Item>

      <div className="transferButton">
        <Button type="primary" loading={loading} disabled={!valid} onClick={handleTransfer}>
          Transfer Magic Tokens
        </Button>
      </div>
    </Container>
  );
}

const Container = styled.div`
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 2px;
  padding: 24px;
  margin-bottom: 10px;
  .transferButton {
    flex-direction: row;
    display: flex;
    justify-content: flex-end;
  }
`;

async function validateAmount(amount: number, maxAvailable: number): Promise<void> {
  if (amount <= 0) {
    return Promise.reject(new Error('Amount should be greater than 0'));
  }
  if (amount > maxAvailable) {
    return Promise.reject(new Error('Amount cannot be greater than total available Magic Tokens'));
  }
}

export default SweepExecute;
