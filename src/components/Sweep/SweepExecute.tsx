import { useCallback, useState, useEffect } from 'react';
import { Form, Input, Button, notification, Typography, Space } from 'antd';
import { ethers } from 'ethers';
import styled from 'styled-components';
import debounce from 'lodash/debounce';

import { ethereumAddressValidator, shortAddress } from '../../utils';
import { useMetamask } from '../../hooks/useMetamask';
import { ChainId } from '../../constants';
import { contractBalanceOf, contractTransferFrom, contractAllowance } from './magicContractHelper';
import { useSweepStore } from './useSweep';

const { Text } = Typography;

function SweepExecute() {
  const [loading, setLoading] = useState(false);

  const [amount, setAmount] = useState('');

  const storedFromAddr = localStorage.getItem('fromAddr')?.toString();
  const storedToAddr = localStorage.getItem('toAddr')?.toString();

  const { fromAddr, setFromAddr, toAddr, setToAddr } = useSweepStore();

  const [balance, setBalance] = useState(0);
  const [allowance, setAllowance] = useState(0);

  const [form] = Form.useForm();

  const { changeNetwork } = useMetamask();

  const handleFromChange = useCallback(
    debounce((e) => {
      setFromAddr(e.target.value);
    }, 500),
    []
  );

  const handleToChange = useCallback(
    debounce((e) => {
      setToAddr(e.target.value);
    }, 500),
    []
  );

  useEffect(() => {
    const validFromAddress = ethers.utils.isAddress(storedFromAddr!);

    const getBalance = async () => {
      try {
        const balanceEth = await contractBalanceOf(storedFromAddr!);
        setBalance(balanceEth[1]);
      } catch (e) {
        console.log(e);
      }
    };

    const validToAddress = ethers.utils.isAddress(storedToAddr!);

    const getAllowance = async () => {
      try {
        const balanceWei = await contractAllowance(storedFromAddr!, storedToAddr!);
        setAllowance(balanceWei[1]);
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
  }, [storedFromAddr, storedToAddr]);

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

      const fromAddr = storedFromAddr!;
      const toAddr = storedToAddr!;
      await contractTransferFrom(fromAddr, toAddr, Number(amount));

      notification.success({
        message: (
          <span>
            <b> (amount) Magic </b>has been successfully transferred from <b> {shortAddress(storedFromAddr!)} </b>
            to <b>{shortAddress(storedToAddr!)} </b>
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
  }, [storedFromAddr, storedToAddr, amount, changeNetwork, form]);

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
          defaultValue={fromAddr}
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
          defaultValue={toAddr}
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
