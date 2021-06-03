import { useCallback, useState } from 'react';
import { Button, Input, Typography } from 'antd';
import styled from 'styled-components';

import { UserAPI } from '../../api/UserAPI';
import PageTitle from '../PageTitle';

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
      <PageTitle />
      <Typography.Title level={3} className="title">
        {signUp ? 'Sign up for Automate' : 'Log in to Automate'}
      </Typography.Title>
      <Input
        type="email"
        size="large"
        style={{ width: '240px' }}
        placeholder="Email"
        disabled={loading}
        value={login}
        onChange={handleLoginChange}
      />
      <br />
      <Input
        type="password"
        size="large"
        style={{ width: '240px' }}
        placeholder="Password"
        disabled={loading}
        value={password}
        onChange={handlePasswordChange}
      />
      <br />
      <Button
        type="primary"
        size="large"
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
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding-top: 60px;

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

export default Auth;
