import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { QuestionCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Typography, Tooltip, Modal, Form, Input } from 'antd';

import { PaymentAPI } from '../../api';
import { useAuth, useMetamask } from '../../hooks';
import { ethereum } from '../../constants';

interface IModalProps {
  children: React.ReactNode;
}

const DEFAULT_CREDITS = 50;

function BuyCreditsModal({ children }: IModalProps) {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [credits, setCredits] = useState(DEFAULT_CREDITS);
  const [paymentAddress, setPaymentAddress] = useState('');

  const handleOpenModal = useCallback(() => setVisible(true), []);

  const handleCloseModal = useCallback(() => setVisible(false), []);

  const handleSubmit = useCallback(async () => {
    await form.validateFields();
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x1' }],
    });
    const [address] = (await ethereum.request<[string]>({ method: 'eth_requestAccounts' }))!;
    console.log(address);
    await PaymentAPI.initialize(user.apiKey, address!);
  }, [form, user?.apiKey]);

  useEffect(() => {
    PaymentAPI.getPaymentAddress().then((addr) => setPaymentAddress(addr));
  }, []);

  return (
    <Container>
      <div className="wrapper" onClick={handleOpenModal}>
        {children}
      </div>
      <Modal
        visible={visible}
        title="Buy Credits"
        okText="Buy"
        cancelText="Close"
        onOk={handleSubmit}
        onCancel={handleCloseModal}
      >
        <ModalContent>
          <div className="description">
            Use the form below to make a payment in{' '}
            <Typography.Link
              href="https://coinmarketcap.com/currencies/chronologic/"
              target="_blank"
              rel="noopener noreferrer"
            >
              DAY token
            </Typography.Link>
            .<br /> Your credits will be added to your account within a couple minutes.
          </div>
          <Form form={form}>
            <div className="creditsWrapper">
              <Form.Item
                name="credits"
                initialValue={DEFAULT_CREDITS}
                rules={[
                  { required: true, message: 'Please specify the amount of credits' },
                  { min: 1, message: 'Amount must be at least 1' },
                ]}
              >
                <Input type="number" min="1" step="1" onChange={(e) => setCredits(Number(e.target.value))} />
              </Form.Item>
              <div className="calculation">Credits = {credits} DAY</div>
            </div>
          </Form>
        </ModalContent>
      </Modal>
    </Container>
  );
}

const Container = styled.div``;

const ModalContent = styled.div`
  .creditsWrapper {
    display: flex;
    flex-direction: row;
    color: ${(props) => props.theme.colors.text};
  }
`;

export default BuyCreditsModal;
