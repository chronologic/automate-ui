import { useCallback, useState, useEffect } from 'react';
import { Form, Input, Button, notification, Typography, Space } from 'antd';
import { ethers } from 'ethers';
import styled from 'styled-components';
import debounce from 'lodash/debounce';

import { ethereumAddressValidator, shortAddress } from '../../utils';
import { useMetamask } from '../../hooks/useMetamask';
import { ChainId } from '../../constants';
import { contractBalanceOf, contractTransferFrom, contractAllowance } from './magicContractHelper';

const { Text } = Typography;

function SweepExecute() {
  const [loading, setLoading] = useState(false);

  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [allowance, setAllowance] = useState(0);

  const [form] = Form.useForm();

  const { changeNetwork } = useMetamask();

  const handleFromChange = useCallback(
    debounce((e) => {
      setFromAddress(e.target.value);
    }, 500),
    [setFromAddress]
  );

  const handleToChange = useCallback(
    debounce((e) => {
      setToAddress(e.target.value);
    }, 500),
    [setToAddress]
  );

  useEffect(() => {
    const validFromAddress = ethers.utils.isAddress(fromAddress);
    const getBalance = async () => {
      try {
        const balanceEth = await contractBalanceOf(fromAddress);
        setBalance(balanceEth[1]);
      } catch (e) {
        console.log(e);
      }
    };

    const validToAddress = ethers.utils.isAddress(toAddress);
    const getAllowance = async () => {
      try {
        const balanceWei = await contractAllowance(fromAddress, toAddress);
        setAllowance(balanceWei);
      } catch (e) {
        console.log(e);
      }
    };

    if (validFromAddress) {
      getBalance();
    }
    if (validFromAddress && validToAddress) {
      getAllowance();
    }
  }, [fromAddress, toAddress]);

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

      await contractTransferFrom(fromAddress, toAddress, Number(amount));

      notification.success({
        message: (
          <span>
            <b> (amount) Magic </b>has been successfully transferred from <b> {shortAddress(fromAddress)} </b>
            to <b>{shortAddress(toAddress)} </b>
          </span>
        ),
      });
    } catch (e) {
      console.error(e);
      const error = (e as any)?.message || 'Error';
      notification.error({ message: error });
    } finally {
      setLoading(false);
    }
  }, [fromAddress, toAddress, amount, changeNetwork, form]);

  const setAmountToMax = () => {
    setAmount(balance.toString());
  };

  const maxButton = (
    <Button type="primary" onClick={setAmountToMax}>
      Max
    </Button>
  );

  return (
    <Container>
      <Typography.Title level={5} className="subtitle">
        Transfer Magic ✨ tokens
      </Typography.Title>
      <Form.Item
        name="fromAddress"
        colon={true}
        label="From Address"
        rules={[
          { required: true, message: 'Address is required' },
          { validator: (_, value) => ethereumAddressValidator(value) },
        ]}
      >
        <Input
          type="text"
          placeholder="The address Magic tokens will be transfered from"
          value={fromAddress}
          onChange={handleFromChange}
          required={true}
        />
      </Form.Item>
      <Form.Item className="title">
        <Space size={'large'}>
          <Text>Balance: {balance}</Text>
          <Text>Allowance: {allowance} </Text>
        </Space>
      </Form.Item>
      <Form.Item
        name="toAddress"
        label="To Address"
        colon={true}
        rules={[
          { required: true, message: 'Address is required' },
          { validator: (_, value) => ethereumAddressValidator(value) },
        ]}
      >
        <Input
          type="text"
          placeholder="The address Magic tokens will be transferred to"
          value={toAddress}
          required={true}
          onChange={handleToChange}
        />
      </Form.Item>
      <Form.Item
        name="amount"
        colon={true}
        label="Amount"
        rules={[
          { required: true, message: 'Amount is required' },
          { validator: (_, value) => validateAmount(value, balance) },
        ]}
        required={true}
      >
        <Input
          name="amount"
          type="number"
          placeholder="Amount of tokens"
          value={amount}
          onChange={handleAmountChange}
          addonAfter={maxButton}
        />
      </Form.Item>

      <div className="transferButton">
        <Button type="primary" loading={loading} onClick={handleTransfer}>
          Transfer Magic tokens
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
  .title {
    font-size: 15px;
    margin-bottom: 10px;
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
