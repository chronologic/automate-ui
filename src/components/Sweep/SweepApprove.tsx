import { useCallback, useState, useEffect } from 'react';
import { Form, Input, Button, notification, Typography } from 'antd';
import { ethers } from 'ethers';
import styled from 'styled-components';
import debounce from 'lodash/debounce';

import { numberToBn, ethereumAddressValidator, shortAddress } from '../../utils';
import { useMetamask } from '../../hooks/useMetamask';
import { ChainId } from '../../constants';
import { contractApprove, contractBalanceOf } from './magicContractHelper';
import { useSweepStore } from './useSweep';

function SweepApprove() {
  const [loading, setLoading] = useState(false);
  const { spenderAddr, setSpenderAddr } = useSweepStore();

  const [approveAmount, setApproveAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState(0);

  const [form] = Form.useForm();

  const { changeNetwork, connect } = useMetamask();

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);

      await form.validateFields();

      await changeNetwork(ChainId.arbitrum);
      const { account } = await connect();

      if (approveAmount === '') {
        await contractApprove(spenderAddr, account!, ethers.constants.MaxUint256);
      } else {
        await contractApprove(spenderAddr, account!, numberToBn(Number(approveAmount)));
      }

      notification.success({
        message: (
          <span>
            Wallet <b> {shortAddress(spenderAddr)} </b> has been whitelisted for amount{' '}
            <b>{approveAmount} Magic tokens</b> successfully.
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
  }, [spenderAddr, approveAmount, changeNetwork, form, connect]);

  const handleSpenderChange = useCallback(
    debounce((e) => {
      setSpenderAddr(e.target.value);
    }, 500),
    [setSpenderAddr]
  );

  const handleAmountChange = useCallback(
    (e) => {
      setApproveAmount(e.target.value);
    },
    [setApproveAmount]
  );

  const setAmountToMax = () => setApproveAmount(maxAmount.toString());

  const maxButton = (
    <Button type="primary" onClick={setAmountToMax}>
      Max
    </Button>
  );

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
  }, [connect]);

  return (
    <Container>
      <Typography.Title level={5} className="subtitle">
        Approve wallet to transfer Magic ✨ tokens
      </Typography.Title>
      <Form.Item
        name="spenderAddr"
        colon={true}
        label="Spender Address"
        rules={[
          { required: true, message: 'The address is required' },
          { validator: (_, value) => ethereumAddressValidator(value) },
        ]}
      >
        <Input
          name="spenderAddr"
          type="text"
          placeholder="The address to whitelist"
          defaultValue={spenderAddr}
          onChange={handleSpenderChange}
          required={true}
        />
      </Form.Item>
      <Form.Item label="Approve Amount" colon={true}>
        <Input.Group compact>
          <Input
            name="approveAmount"
            type="number"
            placeholder="Max amount to spend (empty for infinite approval)"
            value={approveAmount}
            onChange={handleAmountChange}
            addonAfter={maxButton}
          />
        </Input.Group>
      </Form.Item>
      <div className="approveButton">
        <Button type="primary" loading={loading} onClick={handleSubmit}>
          Approve (whitelist) wallet
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
