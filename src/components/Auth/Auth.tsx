import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Input, Typography, Form } from 'antd';
import styled from 'styled-components';

import PageTitle from '../PageTitle';
import { useAuth } from '../../hooks';
import { ALLOW_SIGNUP } from '../../env';

const emailRegex =
  // eslint-disable-next-line no-control-regex
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;

function Auth() {
  const history = useHistory();
  const { authenticating, isAuthenticated, onAuthenticate } = useAuth();
  const [signup, setSignup] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = useCallback(() => {
    onAuthenticate(login, password, signup);
  }, [login, onAuthenticate, password, signup]);

  const handleLoginChange = useCallback((e: any) => {
    setLogin(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: any) => {
    setPassword(e.target.value);
  }, []);

  const handleModeSwitch = useCallback(() => {
    setSignup(!signup);
  }, [signup]);

  useEffect(() => {
    if (isAuthenticated) {
      console.log('REDIRECT');
      history.push('/connect');
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
          <ModeSwitch>
            <Typography.Text>{signup ? 'Already have an account?' : "Don't have an account?"}</Typography.Text>{' '}
            <Typography.Link onClick={handleModeSwitch}>{signup ? 'Log in' : 'Sign up'}</Typography.Link>
          </ModeSwitch>
        )}
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
