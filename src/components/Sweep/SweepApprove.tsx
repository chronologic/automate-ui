import { useCallback, useState, useEffect } from 'react';
import { Form, Input, Button, notification, Typography } from 'antd';
import { ethers } from 'ethers';
import styled from 'styled-components';

import { numberToBn, ethereumAddressValidator } from '../../utils';
import { useMetamask } from '../../hooks/useMetamask';
import { ChainId } from '../../constants';
import { contractApprove, contractBalanceOf } from './useSweep';

function SweepApprove() {
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);

  const [spenderAddr, setSpenderAddr] = useState('');
  const [approveAmount, setApproveAmount] = useState(0);
  const [maxAmount, setMaxAmount] = useState(0);

  const [form] = Form.useForm();

  const { changeNetwork, connect } = useMetamask();

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);

      await form.validateFields();

      await changeNetwork(ChainId.arbitrum);
      const { account } = await connect();

      if (approveAmount.toString() === '') {
        await contractApprove(spenderAddr, account!, ethers.constants.MaxUint256);
      } else {
        await contractApprove(spenderAddr, account!, numberToBn(approveAmount));
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
  }, [spenderAddr, approveAmount, changeNetwork, form, connect]);

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
      const { account } = await connect();
      const isValidFromAddress = ethers.utils.isAddress(account!);
      if (isValidFromAddress) {
        try {
          const balanceEth = await contractBalanceOf(account!);
          setMaxAmount(balanceEth[1]);
        } catch (e) {
          console.log(e);
        }
      }
    };
    getBalance();

    const isValidSpenderAddr = ethers.utils.isAddress(spenderAddr);
    setValid(isValidSpenderAddr);
  }, [spenderAddr, connect]);

  return (
    <Container>
      <Typography.Title level={5} className="subtitle">
        Approve Wallet to transfer Magic ✨ Tokens
      </Typography.Title>
      <Form.Item
        name="spenderAddr"
        label="Spender Address:"
        rules={[
          { required: true, message: 'The Address is required' },
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
      <Form.Item label="Approve Amount:">
        <Input.Group compact>
          <Input
            name="approveAmount"
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
      <div className="approveButton">
        <Button type="primary" disabled={!valid} loading={loading} onClick={handleSubmit}>
          Approve (Whitelist) Wallet
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
  .approveButton {
    flex-direction: row;
    display: flex;
    justify-content: flex-end;
  }
`;

export default SweepApprove;
