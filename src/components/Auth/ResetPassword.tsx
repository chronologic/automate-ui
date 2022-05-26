import React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Typography, Input, Button, notification } from 'antd';
import styled from 'styled-components';
import qs from 'query-string';

import { useAuth } from '../../hooks';

function ResetPassword() {
  const { authenticating, onPasswordReset, isPasswordResetted } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(' ');
  const [enableSubmitButton, setEnableSubmitButton] = useState(false);

  const history = useHistory();

  const q = qs.parse(document.location.search);
  const token = q.token as string;
  const login = q.email as string;

  const handlePasswordChange = useCallback((e: any) => {
    setPassword(e.target.value);
  }, []);
  const handleconfirmPasswordChange = useCallback((e: any) => {
    setConfirmPassword(e.target.value);
  }, []);

  const resetSuccessfulNotification = () => {
    notification.success({
      message: 'Password has been successfully changed.',
      description: 'Your password has been successfully changed. You can log in with your new password now.',
      duration: 3.5,
    });
  };

  const handlePasswordReset = useCallback(() => {
    if (password === confirmPassword) {
      onPasswordReset({ login, password, token });
    }
  }, [login, token, password, confirmPassword, onPasswordReset]);

  async function validatePassword(password: string): Promise<void> {
    setEnableSubmitButton(false);
    if (!/(?=.*[A-Z])(?=.*[a-z]).*/.test(password)) {
      return Promise.reject(new Error('Password must contain lower and uppercase characters'));
    }
    if (!/.{8,}/.test(password)) {
      return Promise.reject(new Error('Password must be at least 8 characters'));
    }
    if (!/(?=.*[0-9\W]).*/.test(password)) {
      return Promise.reject(new Error('Password must contain a number or a symbol'));
    }
    setEnableSubmitButton(true);
  }
  const checkPasswordMatch = useCallback(() => {
    if (!(password === confirmPassword)) {
      return Promise.reject(new Error('Passwords must match'));
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    if (isPasswordResetted) {
      resetSuccessfulNotification();
      history.push('/login/');
    }
  }, [history, isPasswordResetted]);

  return (
    <Container>
      <Form layout="vertical">
        <Typography.Title level={3} className="title">
          {`Reset Password for ${login.replace(/\s/g, '')}`}
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
          name="confirmPassword"
          rules={[
            { required: true, message: 'Confirm password is required' },
            { validator: (_, value) => validatePassword(value) },
            { validator: () => checkPasswordMatch() },
          ]}
        >
          <Input
            type="password"
            size="large"
            style={{ width: '240px' }}
            placeholder="Confirm New Password"
            disabled={authenticating}
            value={confirmPassword}
            required={true}
            onChange={handleconfirmPasswordChange}
          />
        </Form.Item>
        <Button
          type="primary"
          size="large"
          htmlType="submit"
          loading={authenticating}
          disabled={!(password === confirmPassword) || !enableSubmitButton}
          className="submit-btn"
          onClick={handlePasswordReset}
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

export default ResetPassword;
