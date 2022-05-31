import { useEffect } from 'react';
import { Col, Row, Typography } from 'antd';
import { GiftOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Web3 from 'web3';

import MagicDragonABI from '../../../abi/MagicDragon.json';
import { IStrategyBlockTx } from '../../../types';
import { StrategyBlock } from '../../../constants';
import { useStrategyStore } from '../../../hooks';
import BaseBlock from './BaseBlock';

const { Title, Text } = Typography;

const MAGIC_DRAGON_ADDRESS = '0xA094629baAE6aF0C43F17F434B975337cBDb3C42';

const web3 = new Web3();
const callData = new web3.eth.Contract(MagicDragonABI as any).methods.claimAll().encodeABI();

const tx: IStrategyBlockTx = {
  to: MAGIC_DRAGON_ADDRESS,
  data: callData,
};

function Arbitrum_MagicDragon_Claim() {
  const setTx = useStrategyStore((state) => state.setTx);

  useEffect(() => {
    setTx(StrategyBlock.Arbitrum_MagicDragon_Claim, tx);
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
            <img alt="example" src="../img/magic-dragon.jpg" height="72px" />
          </Col>
          <Col>
            <div>
              <Title className="secondary" level={5}>
                Magic Dragon DAO
              </Title>
            </div>
          </Col>
        </Row>
      </BaseBlock>
    </Container>
  );
}

const Container = styled.div``;

export default Arbitrum_MagicDragon_Claim;
