import styled from 'styled-components';
import { Typography, Form, Input } from 'antd';
import { SCREEN_BREAKPOINT } from '../../constants';
import { ethers } from 'ethers';

const fromAdress = '0xD94723BC1dE64f020EeD9D312135Dc89E7B1314B';

const SweepFrom = () => {
  return (
    <Form.Item
      name="fromAddress"
      label="From Eth. Address:"
      rules={[
        { required: true, message: 'From Ethereum Address is required' },
        { validator: (_, value) => validatePassword(value) },
      ]}
      className="title"
    >
      <Input
        type="text"
        placeholder="From Ethereum Address"
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

export default SweepFrom;
