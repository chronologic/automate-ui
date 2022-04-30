import React, { useCallback, useMemo } from 'react';
import { Row, Col, Typography, Button, Space, Form } from 'antd';
import { ArrowDownOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

import { IThemeProps } from '../../types';
import { strategies } from './strategyDetailsData';
import { useStrategyStore } from '../../hooks';
import { blockForName, Repeat } from './Blocks';

const { Title, Text } = Typography;

function StrategyDetails() {
  const location = useLocation();
  const [form] = Form.useForm();
  const txs = useStrategyStore((state) => state.txs);
  const repetitions = useStrategyStore((state) => state.repetitions);

  console.log(txs, repetitions);

  const strategyName = useMemo(() => {
    return location?.pathname?.split('/').reverse()[0];
  }, [location?.pathname]);

  const strategy = strategies[strategyName];

  const txsToSign = useMemo(() => {
    return (strategy?.blocks.length || 0) * repetitions.length;
  }, [repetitions.length, strategy?.blocks.length]);

  const blocks = useMemo(() => {
    const separator = (
      <Arrow>
        <ArrowDownOutlined style={{ color: 'rgb(255 255 255 / 45%)' }} />
      </Arrow>
    );

    return strategy?.blocks.map((name, index) => {
      const Block = blockForName[name];
      return (
        <React.Fragment key={name}>
          {index !== 0 && separator}
          <Block />
        </React.Fragment>
      );
    });
  }, [strategy?.blocks]);

  const handleSubmit = useCallback(async () => {
    await form.validateFields();

    // TODO:
    // - calculate # of iterations based on the Repeat input
    // - construct IStrategyPrepTx[] from txs + user nonce
    // - call API /strategies/prep and store response
    // - batch send all constructed txs to metamask
  }, [form]);

  if (!strategy) {
    return <div>strategy not found</div>;
  }

  return (
    <Container>
      <Form form={form}>
        <Row gutter={[24, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
          <Col span={12}>
            <Title level={3}>{strategy.title}</Title>
            <Text type="secondary" className="description">
              {strategy.description}
            </Text>
          </Col>
          <Col span={12}>
            <div className="outer">
              <div className="inner">{blocks}</div>
              <Repeat />
            </div>
            <Footer>
              <Space direction="vertical" size="large">
                <Button type="primary" size="large" onClick={handleSubmit}>
                  Automate!
                </Button>
                <Text type="secondary" className="txsToSign">
                  This automation will generate <strong>{txsToSign} transactions</strong> for you to sign in Metamask.
                </Text>
              </Space>
            </Footer>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  max-width: 1220px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;

  .description {
    color: rgb(255 255 255 / 45%);
  }

  .outer {
    border: 1px solid ${(props: IThemeProps) => props.theme.colors.accent};
    border-radius: 2px;
  }

  .inner {
    padding: 10px 10px 20px;
  }

  .ant-card-head {
    color: white;
  }

  .ant-card-body {
    display: flex;
  }

  .secondary {
    color: rgb(255 255 255 / 45%);
  }

  .ant-card-extra {
    color: rgb(255 255 255 / 25%);
    font-size: 18px;
  }

  .cardTitle {
    margin-left: 10px;
  }
`;

const Footer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 3em;

  .txsToSign {
    color: rgb(255 255 255 / 45%);
  }
`;

const Arrow = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2px 0;
`;

export default StrategyDetails;
