import { Button, Input } from 'antd';
import React, { useCallback, useState } from 'react';

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
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        justifyContent: 'center',
        width: '100%'
      }}
    >
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
    </div>
  );
}

export default Auth;
