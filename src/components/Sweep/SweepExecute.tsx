import { useCallback, useState, useEffect } from 'react';
import { Form, Input, Button, notification, Typography } from 'antd';
import { ethers } from 'ethers';
import styled from 'styled-components';

import {
  ethereumAddressValidator,
  validateAmount,
  contractBalanceOf,
  contractTransferFrom,
  contractAllowance,
} from '../../utils';
import { useMetamask } from '../../hooks/useMetamask';

function SweepExecute() {
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);

  const [fromAddress, setFromAddress] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState(0);
  const [maxAmount, setMaxAmount] = useState(0);
  const [allowance, setAllowance] = useState(0);

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
      setMaxAmount(balanceEth[1]);
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
    const validAddress = ethers.utils.isAddress(fromAddress);
    if (validAddress) {
      try {
        setLoading(true);
        await changeNetwork(42161);
        console.log(ethers.utils.isAddress(fromAddress));
        console.log(ethers.utils.isAddress(to));

        contractTransferFrom(fromAddress, to, amount);

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
    }
  }, [fromAddress, to, amount, changeNetwork]);

  const setAmountToMax = () => setAmount(maxAmount);

  return (
    <Container>
      <Typography.Title level={5} className="subtitle">
        Transfer Magic ✨ Tokens
      </Typography.Title>
      <Form.Item
        name="fromAddress"
        label="From Address:"
        rules={[
          { required: true, message: 'From Ethereum Address is required' },
          { validator: (_, value) => ethereumAddressValidator(value) },
        ]}
        className="title"
      >
        <Input
          type="text"
          placeholder="The Ethereum Address Magic Token's will be transfered from"
          value={fromAddress}
          onChange={handleFromChange}
          required={true}
        />
      </Form.Item>
      <Form.Item name="Balance" label="Balance">
        <Input type="number" placeholder="The Maximum Amount avalible tokens" value={maxAmount} disabled={true} />{' '}
      </Form.Item>
      <Form.Item
        name="toAddress"
        label="To Address:"
        rules={[
          { required: true, message: 'To Ethereum Address is required' },
          { validator: (_, value) => ethereumAddressValidator(value) },
        ]}
        className="title"
      >
        <Input
          type="text"
          placeholder="The Ethereum Address Magic Token's will be transfered to"
          value={to}
          required={true}
          onChange={handleToChange}
        />
      </Form.Item>
      <Form.Item name="Allowance" label="Allowance">
        <Input type="number" placeholder="The Maximum Amount of allowed tokens" value={allowance} disabled={true} />{' '}
      </Form.Item>
      <Form.Item label="Amount:" required={true}>
        <Form.Item
          name="amount"
          label="amount:"
          noStyle
          rules={[
            { required: true, message: 'Amount is required' },
            { validator: (_, value) => validateAmount(value, maxAmount) },
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
      </Form.Item>
      <div className="transferButton">
        <Button type="primary" loading={loading} disabled={!valid} onClick={handleTransfer}>
          Tranfer Magic Tokens
        </Button>
      </div>
    </Container>
  );
}

const Container = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  padding: 24px;
  margin-bottom: 10px;
  .transferButton {
    flex-direction: row;
    display: flex;
    justify-content: flex-end;
  }
`;

export default SweepExecute;
