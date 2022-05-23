import React from 'react';
import { Modal, Input, Button, notification } from 'antd';

interface IProps {
  visible: boolean;
  onCancel: () => void;
}

function PasswordReset({ visible, onCancel }: IProps) {
  // const handleOnSubmit = () => {};
  const showEmailSentNotification = () => {
    notification['success']({
      message: 'Password Reset Email Has Been Sent',
      description: 'We sent you an email with a reset link',
      duration: 3.5,
      // close model too
    });
    onCancel();
  };
  return (
    <Modal
      title="Reset Password"
      centered
      className="modal"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="submitResetPassword" onClick={showEmailSentNotification}>
          Submit
        </Button>,
        <Button key="cancelResetPassword" onClick={onCancel}>
          Cancel
        </Button>,
      ]}
    >
      <Input placeholder="Please provide your email address that you use to log in" />
    </Modal>
  );
}

export default PasswordReset;
