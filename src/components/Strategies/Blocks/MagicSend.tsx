import { Col, Typography, Input, Form } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import { StrategyBlock } from '../../../constants';
import BaseBlock from './BaseBlock';

const { Text } = Typography;

function MagicSend() {
  return (
    <Container>
      <BaseBlock
        title={
          <>
            <ExportOutlined />
            <Text className="cardTitle">Send $MAGIC</Text>
          </>
        }
      >
        <Col flex="390px">
          <Form.Item name={StrategyBlock.Arbitrum_Magic_Send} normalize={getNormalizedValue} required>
            <Input size="large" placeholder="To address" />
          </Form.Item>
        </Col>
        <Col flex="auto">
          <Form.Item required>
            <Input size="large" placeholder="Amount" />
          </Form.Item>
        </Col>
      </BaseBlock>
    </Container>
  );
}

const Container = styled.div``;

function getNormalizedValue(...args: any[]) {
  console.log(args);
  return {};
}

export default MagicSend;
