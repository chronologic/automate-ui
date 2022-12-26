import { useEffect } from 'react';
import { Col, Row, Typography } from 'antd';
import { GiftOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Web3 from 'web3';

import VerseClaimerABI from '../../../abi/VerseClaimer.json';
import { IStrategyBlockTx } from '../../../types';
import { StrategyBlock } from '../../../constants';
import { useStrategyStore } from '../../../hooks';
import BaseBlock from './BaseBlock';

const { Title, Text } = Typography;

const VERSE_CLAIMER_ADDRESS = '0xE5aC5142BdE69cfA722662D9C3E4C8111f60B8d5';

const web3 = new Web3();
const callData = new web3.eth.Contract(VerseClaimerABI as any).methods.scrapeMyTokens().encodeABI();

const tx: IStrategyBlockTx = {
  to: VERSE_CLAIMER_ADDRESS,
  data: callData,
};

export function getTx(): IStrategyBlockTx {
  return tx;
}

function Ethereum_Verse_Claim() {
  const setTx = useStrategyStore((state) => state.setTx);

  useEffect(() => {
    setTx(StrategyBlock.Ethereum_Verse_Claim, tx);
  }, [setTx]);

  return (
    <Container>
      <BaseBlock
        title={
          <>
            <GiftOutlined />
            <Text className="cardTitle">Claim Rewards</Text>
          </>
        }
      >
        <Row gutter={12}>
          <Col span={6}>
            <img alt="Verse" src="/img/verse.png" height="72px" />
          </Col>
          <Col>
            <div>
              <Title className="secondary" level={5}>
                Claim from{' '}
                <a
                  href="https://etherscan.io/address/0xE5aC5142BdE69cfA722662D9C3E4C8111f60B8d5"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  VerseClaimer
                </a>
              </Title>
            </div>
          </Col>
        </Row>
      </BaseBlock>
    </Container>
  );
}

const Container = styled.div``;

export default Ethereum_Verse_Claim;
