import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, Progress, Typography } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import styled from 'styled-components';

import { calculatePercent } from '../../utils';

const { Text, Title } = Typography;

interface IProps {
  visible: boolean;
  onCancel: () => void;
  currentTxIndex: number;
  totalTxsToSign: number;
  completedSigning: boolean;
}
function SigningPopup({ visible, onCancel, currentTxIndex, totalTxsToSign, completedSigning }: IProps) {
  const completed = currentTxIndex === totalTxsToSign;

  return (
    <Modal title="Signing transactions" centered className="modal" visible={visible} onCancel={onCancel} footer={null}>
      {!completedSigning && (
        <>
          <SigningProgress>
            <Text className="descriptionMsg">
              Please sign transaction {currentTxIndex + 1} of {totalTxsToSign}
            </Text>
            <ProgressBar>
              <Progress percent={calculatePercent(currentTxIndex, totalTxsToSign)} />
            </ProgressBar>
            <Text className="infoMsg">
              Don't worry if you see transactions fail or succeed in Metamask while you are signing!
            </Text>
          </SigningProgress>
        </>
      )}
      {completedSigning && (
        <>
          <Completed>
            <CheckCircleFilled className="completedCheck" />
            <Title level={5} className="congratulationsMsg">
              Your Automation is ready! <br /> We'll notify you via email whenever a transaction is executed.
            </Title>
            <ProgressBar>
              <Progress percent={100} />
            </ProgressBar>
            <Text className="bottomMsg">
              IMPORTANT!
              <br />
              If you want to use the nonces you just signed for other transactions, you will have to{' '}
              <a
                href="https://metamask.zendesk.com/hc/en-us/articles/360015488891-How-to-reset-your-account"
                target="_blank"
                rel="noopener noreferrer"
              >
                reset your Metamask account.
              </a>{' '}
              And remember to{' '}
              <a
                href="https://blog.chronologic.network/how-to-sign-up-to-automate-and-claim-your-magic-rewards-cf67fca1ddb3#8256"
                target="_blank"
                rel="noopener noreferrer"
              >
                switch back to non-Automate Network
              </a>{' '}
              in MetaMask.
            </Text>
            <Link to="/transactions">
              <Button key="okButton" className="okButton">
                OK, take me to Transaction List
              </Button>
            </Link>
          </Completed>
        </>
      )}
    </Modal>
  );
}

const SigningProgress = styled.div`
  width: 100%;
  max-width: 1220px;
  .descriptionMsg {
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    margin-bottom: 5px;
    color: white;
  }
  .infoMsg {
    display: flex;
    margin-top: 5px;
    text-align: center;
    color: white;
  }
`;

const ProgressBar = styled.div`
  .ant-progress-text {
    color: white;
  }
  .ant-progress-bg {
    background: ${(props) => props.theme.colors.accent};
  }
`;
const Completed = styled.div`
  width: 100%;
  max-width: 1220px;
  .congratulationsMsg {
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    margin-bottom: 20px;
    color: white;
  }
  .bottomMsg {
    margin-top: 20px;
    display: inline-block;
    text-align: center;
    margin-bottom: 20px;
    color: white;
  }
  .completedCheck {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    font-size: 90px;
    color: ${(props) => props.theme.colors.accent};
  }
  .okButton {
    margin-left: 25%;
    margin-top: 16px;
    margin-bottom: 8px;
    background-color: ${(props) => props.theme.colors.accent};
    color: white;
  }
`;
export default SigningPopup;
