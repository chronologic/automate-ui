import { useEffect } from 'react';
import { Col, Row, Typography } from 'antd';
import { GiftOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Web3 from 'web3';

import AtlasMineABI from '../../../abi/AtlasMine.json';
import { IStrategyBlockTx } from '../../../types';
import { StrategyBlock } from '../../../constants';
import { useStrategyStore } from '../../../hooks';
import BaseBlock from './BaseBlock';

const { Title, Text } = Typography;

const ATLAS_MINE_ADDRESS = '0xA0A89db1C899c49F98E6326b764BAFcf167fC2CE';

const web3 = new Web3();
const callData = new web3.eth.Contract(AtlasMineABI as any).methods.harvestAll().encodeABI();

const tx: IStrategyBlockTx = {
  to: ATLAS_MINE_ADDRESS,
  data: callData,
};

function Arbitrum_Bridgeworld_Claim() {
  const setTx = useStrategyStore((state) => state.setTx);

  useEffect(() => {
    setTx(StrategyBlock.Arbitrum_Bridgeworld_Claim, tx);
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
            <img alt="example" src="../img/atlas-mine.jpg" height="72px" />
          </Col>
          <Col>
            <div>
              <Title className="secondary" level={5}>
                Atlas Mine
              </Title>
              <Text type="secondary">There are no parameters to specify at this step.</Text>
            </div>
          </Col>
        </Row>
      </BaseBlock>
    </Container>
  );
}

const Container = styled.div``;

export default Arbitrum_Bridgeworld_Claim;
