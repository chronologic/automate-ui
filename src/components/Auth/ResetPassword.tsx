import React from 'react';
import { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Typography, Input, Button, notification } from 'antd';
import styled from 'styled-components';
import qs from 'query-string';

import { useAuth } from '../../hooks';
import { UserAPI } from '../../api';
import { validatePassword } from './Auth';

function ResetPassword() {
  const [form] = Form.useForm();
  const { authenticating } = useAuth();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const history = useHistory();

  const q = qs.parse(document.location.search);
  const token = q.token as string;
  const login = (q.email as string) || '';

  const handlePasswordChange = useCallback((e: any) => {
    setPassword(e.target.value);
  }, []);
  const handleConfirmPasswordChange = useCallback((e: any) => {
    setPasswordConfirmation(e.target.value);
  }, []);

  const showResetSuccessNotification = () => {
    notification.success({
      message: 'Password has been successfully changed.',
      description: 'Your password has been successfully changed. You can log in with your new password now.',
      duration: 3.5,
    });
  };

  const handlePasswordReset = useCallback(async () => {
    await form.validateFields();
    history.push('/login/');
    const resetPassword = await UserAPI.resetPassword({ login, password, token });
    if (resetPassword) {
      showResetSuccessNotification();
    }
  }, [login, token, password, form, history]);

  async function checkPasswordMatch() {
    if (!(password === passwordConfirmation)) {
      return Promise.reject(new Error('Passwords must match'));
    }
  }

  return (
    <Container>
      <Form form={form}>
        <Typography.Title level={3} className="title">
          {`Reset Password ${login.replace(/\s/g, '')}`}
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
            className="password-input"
            placeholder="New Password"
            disabled={authenticating}
            value={password}
            required
            onChange={handlePasswordChange}
          />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Confirm password is required' },
            { validator: (_, value) => validatePassword(value) },
            { validator: () => checkPasswordMatch() },
          ]}
        >
          <Input
            type="password"
            size="large"
            className="password-input"
            placeholder="Confirm New Password"
            disabled={authenticating}
            value={passwordConfirmation}
            required
            onChange={handleConfirmPasswordChange}
          />
        </Form.Item>
        <Button type="primary" size="large" htmlType="submit" className="submit-btn" onClick={handlePasswordReset}>
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

  .password-input {
    width: 240px;
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
