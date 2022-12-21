import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Typography, Modal, Form, Input, Alert, notification } from 'antd';
import { ethers } from 'ethers';
import Web3 from 'web3';

import { PaymentAPI } from '../../api';
import { useAuth, useMetamask } from '../../hooks';
import { ethereum, ChainId } from '../../constants';
import { ERC20 } from '../../api/erc20';

interface IModalProps {
  children: React.ReactNode;
}

const DEFAULT_CREDITS = 50;
const DAY_ADDRESS = '0xe814aee960a85208c3db542c53e7d4a6c8d5f60f';
const web3 = new Web3(ethereum as any);
const dayContract = new web3.eth.Contract(ERC20 as any, DAY_ADDRESS);

function BuyCreditsModal({ children }: IModalProps) {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const { changeNetwork, connect } = useMetamask();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(DEFAULT_CREDITS);
  const [paymentAddress, setPaymentAddress] = useState('');
  const [paymentComplete, setPaymentComplete] = useState(false);

  const handleOpenModal = useCallback(() => setVisible(true), []);

  const handleCloseModal = useCallback(() => {
    setVisible(false);
    setPaymentComplete(false);
    setCredits(DEFAULT_CREDITS);
    form.resetFields();
  }, [form]);

  const handleSubmit = useCallback(async () => {
    await form.validateFields();
    setLoading(true);
    try {
      const { account } = await connect();
      await changeNetwork(ChainId.ethereum);
      await PaymentAPI.initialize(user.apiKey, account!);
      const amountDay = ethers.utils.parseEther(`${credits}`);
      await dayContract.methods.transfer(paymentAddress, amountDay).send({ from: account });
      setPaymentComplete(true);
      notification.success({
        message: 'Payment successful',
      });
    } catch (e) {
      console.error(e);
      notification.error({ message: (e as any).message || 'Error. Please try again.' });
    } finally {
      setLoading(false);
    }
  }, [changeNetwork, connect, credits, form, paymentAddress, user?.apiKey]);

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
        destroyOnClose
        okButtonProps={{ disabled: loading, loading }}
        title="Buy Credits"
        okText="Buy"
        cancelText="Close"
        onOk={handleSubmit}
        onCancel={handleCloseModal}
      >
        <ModalContent>
          <div className="description">
            You can buy credits with the{' '}
            <Typography.Link
              href="https://blog.chronologic.network/how-to-buy-automate-credits-e0a824572ccd"
              target="_blank"
              rel="noopener noreferrer"
            >
              DAY token
            </Typography.Link>
            .<br />
            Specify the amount of credits and click "Buy".
            <br />
          </div>
          <Form form={form} initialValues={{ credits: DEFAULT_CREDITS }}>
            <div className="creditsWrapper">
              <Form.Item
                className="creditsFormItem"
                name="credits"
                rules={[{ required: true, message: 'Please specify the amount of credits' }]}
              >
                <Input
                  type="number"
                  min="1"
                  step="1"
                  disabled={loading}
                  onChange={(e) => setCredits(Number(e.target.value))}
                />
              </Form.Item>
              <div className="calculation">Credits = {credits} DAY</div>
            </div>
          </Form>
          <Alert
            message="Use only this form to buy credits to ensure that your payment is processed correctly"
            type="warning"
            showIcon
          />
          {paymentComplete && (
            <div>
              <br />
              Thank you for your payment! 🎉
              <br /> Your credits will be added to your account within a couple minutes.
              <br /> <i>Don't forget to switch back to Automate Network in Metamask 🚀</i>
            </div>
          )}
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
    justify-content: center;
  }

  .description {
    margin-bottom: 24px;
  }

  .creditsFormItem {
    width: 100px;
  }

  .calculation {
    color: ${(props) => props.theme.colors.text};
    margin-left: 8px;
    margin-top: 4px;
  }
`;

export default BuyCreditsModal;
