import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Input, Typography, Form, Modal, notification } from 'antd';
import styled from 'styled-components';
import { parseUrl } from 'query-string';

import { getUserSource } from '../../utils';
import { ALLOW_SIGNUP } from '../../env';
import { useAuth } from '../../hooks';
import { UserAPI } from '../../api';

import PageTitle from '../PageTitle';

const emailRegex =
  // eslint-disable-next-line no-control-regex
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;

const parsed = parseUrl(window.location.href);

function Auth() {
  const history = useHistory();
  const { authenticating, isAuthenticated, onAuthenticate } = useAuth();
  const [signup, setSignup] = useState(ALLOW_SIGNUP && !!parsed.query?.utm_source);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [pwResetLogin, setPwResetLogin] = useState('');
  const [resetting, setResetting] = useState(false);
  const [showPwResetModal, setShowPwResetModal] = useState(false);
  const [resetPwForm] = Form.useForm();

  const handleAuth = useCallback(() => {
    onAuthenticate({ login, password, signup, source: getUserSource() });
  }, [login, onAuthenticate, password, signup]);

  const handleLoginChange = useCallback((e: any) => {
    setLogin(e.target.value);
  }, []);

  const handlePwResetLoginChange = useCallback((e: any) => {
    setPwResetLogin(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: any) => {
    setPassword(e.target.value);
  }, []);

  const handleModeSwitch = useCallback(() => {
    setSignup(!signup);
  }, [signup]);

  const handleRequestPasswordReset = useCallback(async () => {
    try {
      setResetting(true);

      await resetPwForm.validateFields();

      await UserAPI.requestResetPassword({ login: pwResetLogin });

      showPwResetNotification();
    } finally {
      setShowPwResetModal(false);
    }
  }, [resetPwForm, pwResetLogin]);

  const handlePasswordReset = useCallback(() => {
    setShowPwResetModal(true);
  }, []);

  const handleCancel = () => {
    setShowPwResetModal(false);
  };

  const showPwResetNotification = () => {
    notification.success({
      message: 'Password Reset Email Has Been Sent',
      description: 'We sent you an email with a reset link',
      duration: 3.5,
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      const returnPath = (history.location as any).state?.from?.pathname || '/connect';

      history.replace(returnPath);
    }
  }, [history, isAuthenticated]);

  return (
    <Container>
      <Form layout="vertical">
        <PageTitle />
        <Typography.Title level={3} className="title">
          {signup ? 'Sign up for Automate' : 'Log in to Automate'}
        </Typography.Title>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Email is required' },
            { pattern: emailRegex, message: 'Invalid email' },
          ]}
        >
          <Input
            type="email"
            size="large"
            style={{ width: '240px' }}
            placeholder="Email"
            disabled={authenticating}
            value={login}
            onChange={handleLoginChange}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Password is required' },
            { validator: (_, value) => validatePassword(value) },
          ]}
        >
          <Input
            type="password"
            size="large"
            style={{ width: '240px' }}
            placeholder="Password"
            disabled={authenticating}
            value={password}
            required={true}
            onChange={handlePasswordChange}
          />
        </Form.Item>
        <br />
        <Button
          type="primary"
          size="large"
          htmlType="submit"
          loading={authenticating}
          disabled={!login || !password}
          className="submit-btn"
          onClick={handleAuth}
        >
          Submit
        </Button>
        {ALLOW_SIGNUP && (
          <ModeSwitch className="signupLoginText">
            <Typography.Text>{signup ? 'Already have an account?' : "Don't have an account?"}</Typography.Text> <br />
            <Typography.Link onClick={handleModeSwitch}>
              {signup ? 'Log in' : 'Limited Time First 50 $MAGIC✨ Hour Pod Listeners get 200 FREE credits'}
            </Typography.Link>{' '}
            <br /> <br />
            {!signup && <Typography.Link onClick={handlePasswordReset}>Forgot Password?</Typography.Link>}
          </ModeSwitch>
        )}
      </Form>
      <Form form={resetPwForm}>
        <Modal
          title="Reset Password"
          centered
          className="modal"
          visible={showPwResetModal}
          onCancel={handleCancel}
          footer={[
            <Button
              key="submitResetPassword"
              type="primary"
              disabled={resetting}
              loading={resetting}
              onClick={handleRequestPasswordReset}
            >
              Submit
            </Button>,
            <Button key="cancelResetPassword" onClick={handleCancel}>
              Cancel
            </Button>,
          ]}
        >
          <Form layout="vertical">
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Email is required' },
                { pattern: emailRegex, message: 'Invalid email' },
              ]}
            >
              <Input
                type="email"
                size="large"
                placeholder="Please provide your email address that you use to log in"
                disabled={resetting}
                value={pwResetLogin}
                onChange={handlePwResetLoginChange}
              />
            </Form.Item>
          </Form>
        </Modal>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
  padding-top: 60px;

  .ant-form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .ant-col.ant-form-item-control {
    text-align: center;
  }

  .title {
    font-weight: 300;
    margin-bottom: 30px;
  }

  .submit-btn {
    margin-bottom: 24px;
    padding-left: 40px;
    padding-right: 40px;
  }
  .signupLoginText {
    text-align: center;
  }
`;

const ModeSwitch = styled.div`
  margin-bottom: 32px;
`;

export async function validatePassword(password: string): Promise<void> {
  if (!/(?=.*[A-Z])(?=.*[a-z]).*/.test(password)) {
    return Promise.reject(new Error('Password must contain lower and uppercase characters'));
  }
  if (!/.{8,}/.test(password)) {
    return Promise.reject(new Error('Password must be at least 8 characters'));
  }
  if (!/(?=.*[0-9\W]).*/.test(password)) {
    return Promise.reject(new Error('Password must contain a number or a symbol'));
  }
}

export default Auth;
