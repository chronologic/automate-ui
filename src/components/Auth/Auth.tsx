import { useCallback, useState } from 'react';
import { Button, Input, Typography, Form } from 'antd';
import styled from 'styled-components';

import { UserAPI } from '../../api/UserAPI';
import PageTitle from '../PageTitle';

const emailRegex =
  // eslint-disable-next-line no-control-regex
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;

function Auth() {
  const [signUp, setSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = useCallback(async () => {
    try {
      setLoading(true);

      const apiKeyRes = await UserAPI.auth(login, password);

      setApiKey(apiKeyRes);
    } finally {
      setLoading(false);
    }
  }, [login, password]);

  const handleLoginChange = useCallback((e: any) => {
    setLogin(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: any) => {
    setPassword(e.target.value);
  }, []);

  const handleModeSwitch = useCallback(() => {
    setSignUp(!signUp);
  }, [signUp]);

  return (
    <Container>
      <Form layout="vertical">
        <PageTitle />
        <Typography.Title level={3} className="title">
          {signUp ? 'Sign up for Automate' : 'Log in to Automate'}
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
            disabled={loading}
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
            disabled={loading}
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
          loading={loading}
          disabled={!login || !password}
          className="submit-btn"
          onClick={handleAuth}
        >
          Submit
        </Button>
        <ModeSwitch>
          <Typography.Text>{signUp ? 'Already have an account?' : "Don't have an account?"}</Typography.Text>{' '}
          <Typography.Link onClick={handleModeSwitch}>{signUp ? 'Log in' : 'Sign up'}</Typography.Link>
        </ModeSwitch>
        {apiKey && <span>Your API key is: {apiKey}</span>}
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
    margin-top: 16px;
    margin-bottom: 24px;
    padding-left: 40px;
    padding-right: 40px;
  }
`;

const ModeSwitch = styled.div`
  margin-bottom: 32px;
`;

async function validatePassword(password: string): Promise<void> {
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
