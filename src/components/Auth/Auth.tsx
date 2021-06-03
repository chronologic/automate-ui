import { useCallback, useState } from 'react';
import { Button, Input } from 'antd';
import styled from 'styled-components';

import { UserAPI } from '../../api/UserAPI';

function Auth() {
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

  return (
    <Container>
      <Input
        type="text"
        style={{ width: '320px' }}
        placeholder="Login"
        disabled={loading}
        value={login}
        onChange={handleLoginChange}
      />
      <br />
      <Input
        type="password"
        style={{ width: '320px' }}
        placeholder="Password"
        disabled={loading}
        value={password}
        onChange={handlePasswordChange}
      />
      <br />
      <Button type="primary" loading={loading} disabled={!login || !password} onClick={handleAuth}>
        Submit
      </Button>
      <br />
      <br />
      {apiKey && <span>Your API key is: {apiKey}</span>}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export default Auth;
