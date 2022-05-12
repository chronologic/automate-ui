import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, Progress, Typography } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import styled from 'styled-components';

import { calculatePercent } from '../../../utils';

const { Text } = Typography;

interface IProps {
  visible: boolean;
  onCancel: () => void;
  currentTxIndex: number;
  totalTxsToSign: number;
}
function SigningPopup({ visible, onCancel, currentTxIndex, totalTxsToSign }: IProps) {
  const infoMessage = "Don't worry if you see transactions fail or succeed in Metamask while you are signing!";
  const completed = currentTxIndex === totalTxsToSign;
  return (
    <Modal
      title="Signing transactions"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Link to="/transactions">
          <Button key="back" disabled={completed ? false : true}>
            OK, take me to Transaction List
          </Button>
        </Link>,
      ]}
    >
      <Container>
        {!completed && (
          <>
            <Text className="description">
              Please sign transaction {currentTxIndex + 1} of {totalTxsToSign}
            </Text>
            <ProgressBar>
              <Progress percent={calculatePercent(currentTxIndex, totalTxsToSign)} />
            </ProgressBar>
            <Text className="infoMessage">{infoMessage}</Text>
          </>
        )}
        {completed && (
          <>
            <Completed>
              <CheckCircleFilled className="completedCheck" />
              <Text className="congMessage">
                Congratulations! Your Automation is ready! <br /> We will notify you via email whenever a transaction is
                executed.
              </Text>
              <ProgressBar>
                <Progress percent={100} />
              </ProgressBar>
              <Text className="bottomMessage">
                If you want to use the nonces you just signed for other transactions, you will have to{' '}
                <a
                  href="https://metamask.zendesk.com/hc/en-us/articles/360015488891-How-to-reset-your-account"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  reset your Metamask account.
                </a>
              </Text>
            </Completed>
          </>
        )}
      </Container>
    </Modal>
  );
}

const Container = styled.div`
  width: 100%;
  max-width: 1220px;
  .description {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .infoMessage {
    display: flex;
    text-align: center;
  }
`;

const ProgressBar = styled.div`
  .ant-progress-text {
    color: white;
  }
`;
const Completed = styled.div`
  width: 100%;
  max-width: 1220px;
  .congMessage {
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
  }
  .bottomMessage {
    display: inline-block;
    text-align: center;
  }
  .completedCheck {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    font-size: 90px;
  }
`;
export default SigningPopup;
