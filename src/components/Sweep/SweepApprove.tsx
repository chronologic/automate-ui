import { useCallback, useState, useEffect } from 'react';
import { Form, Input, Button, notification, Typography } from 'antd';
import { ethers } from 'ethers';
import styled from 'styled-components';

import { numberToBn, ethereumAddressValidator, contractApprove, contractBalanceOf } from '../../utils';

import { useMetamask, requestAccount } from '../../hooks/useMetamask';

function SweepApprove() {
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);

  const [spenderAddr, setSpenderAddr] = useState('');
  const [approveAmount, setApproveAmount] = useState(0);
  const [maxAmount, setmaxAmount] = useState(0);

  const { changeNetwork } = useMetamask();

  const handleSubmit = useCallback(async () => {
    const validAddress = ethers.utils.isAddress(spenderAddr);
    if (validAddress) {
      try {
        setLoading(true);
        await changeNetwork(42161);
        const account = await requestAccount();

        if (approveAmount.toString() === '') {
          await contractApprove(spenderAddr, account, ethers.constants.MaxUint256);
        } else {
          await contractApprove(spenderAddr, account, numberToBn(approveAmount));
        }

        notification.success({
          message: `Wallet ${spenderAddr} has been whitelisted for ${approveAmount} amount succesffuly. `,
        });
      } catch (e) {
        console.error(e);
        const error = (e as any)?.message || 'Error';
        notification.error({ message: error });
      } finally {
        setLoading(false);
      }
    }
  }, [spenderAddr, approveAmount, changeNetwork]);

  const handleSpenderAddrChange = useCallback(
    (e) => {
      setSpenderAddr(e.target.value);
    },
    [setSpenderAddr]
  );

  const handleAmountChange = useCallback(
    (e) => {
      setApproveAmount(e.target.value);
    },
    [setApproveAmount]
  );

  const setAmountToMax = () => setApproveAmount(maxAmount);

  useEffect(() => {
    const getBalance = async () => {
      const account = await requestAccount();
      const validAFromAddress = ethers.utils.isAddress(account);
      if (validAFromAddress) {
        try {
          const balanceEth = await contractBalanceOf(account);
          setmaxAmount(balanceEth[1]);
        } catch (e) {
          console.log(e);
        }
      }
    };
    getBalance();

    const validSpenderAddr = ethers.utils.isAddress(spenderAddr);
    if (validSpenderAddr) {
      setValid(true);
    } else setValid(false);
  }, [spenderAddr]);

  return (
    <Container>
      <Typography.Title level={5} className="subtitle">
        Approve Wallet to transfer Magic ✨ Tokens
      </Typography.Title>
      <Form.Item
        name="spenderAddr"
        label="Spender Address:"
        rules={[
          { required: true, message: 'The Spender Ethereum Address is required' },
          { validator: (_, value) => ethereumAddressValidator(value) },
        ]}
        className="title"
      >
        <Input
          type="text"
          placeholder="The address to whitelist"
          value={spenderAddr}
          onChange={handleSpenderAddrChange}
          required={true}
        />
      </Form.Item>
      <Form.Item name="approveAmount" label="Approve Amount:">
        <Input.Group compact>
          <Input
            type="number"
            placeholder="Max amount to spend (empty for infinite approval)"
            value={approveAmount}
            onChange={handleAmountChange}
            style={{ width: 'calc(100% - 65px)' }}
          />
          <Button type="primary" onClick={setAmountToMax}>
            Max
          </Button>
        </Input.Group>
      </Form.Item>
      <div className="aproveButton">
        <Button type="primary" disabled={!valid} loading={loading} onClick={handleSubmit}>
          Approve (Whitelist) Wallet
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
  .aproveButton {
    flex-direction: row;
    display: flex;
    justify-content: flex-end;
  }
`;

export default SweepApprove;
