import styled from 'styled-components';
import { Typography, Form, Input } from 'antd';
import { SCREEN_BREAKPOINT } from '../../constants';
import { ethers } from 'ethers';

const SweepTo = () => {
  return (
    <Form.Item
      name="toAddress"
      label="To Eth. Address:"
      rules={[
        { required: true, message: 'To Ethereum Address is required' },
        { validator: (_, value) => validatePassword(value) },
      ]}
      className="title"
    >
      <Input
        type="text"
        placeholder="To Ethereum Address"
        // disabled={authenticating}
        // value={password}
        required={true}
        // onChange={handlePasswordChange}
      />
    </Form.Item>
  );
};

export async function validatePassword(address: string): Promise<void> {
  if (!ethers.utils.isAddress(address)) {
    return Promise.reject(new Error('Invalid etherium address.'));
  }
}

export default SweepTo;
