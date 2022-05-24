import React from 'react';
import { useState, useCallback } from 'react';
import { Form, Typography, Input, Button, notification } from 'antd';
import { useAuth, useAutomateConnection } from '../../hooks';
import styled from 'styled-components';

function ResetPassword() {
  const { authenticating, isAuthenticated, onAuthenticate } = useAuth();
  const [password, setPassword] = useState('');
  const handlePasswordChange = useCallback((e: any) => {
    setPassword(e.target.value);
  }, []);
  const resetSuccessfulNotification = () => {
    notification['success']({
      message: 'Password has been successfully changed.',
      description: 'Your password has been successfully changed. You can log in with your new password now.',
      duration: 3.5,
      // close model too
    });
    // handleCancel();
  };
  return (
    <Container>
      <Form layout="vertical">
        <Typography.Title level={3} className="title">
          {'Reset Password'}
        </Typography.Title>
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
            placeholder="New Password"
            disabled={authenticating}
            value={password}
            required={true}
            onChange={handlePasswordChange}
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
            placeholder="Confirm New Password"
            disabled={authenticating}
            value={password}
            required={true}
            onChange={handlePasswordChange}
          />
        </Form.Item>
        <Button
          type="primary"
          size="large"
          htmlType="submit"
          loading={authenticating}
          disabled={!password}
          className="submit-btn"
          onClick={resetSuccessfulNotification}
        >
          Reset Password
        </Button>
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
export default ResetPassword;
