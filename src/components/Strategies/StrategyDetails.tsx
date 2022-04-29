import React, { useCallback, useMemo } from 'react';
import { Card, Row, Col, Typography, DatePicker, Radio, Button, Space, Form } from 'antd';
import { BlockOutlined, ReloadOutlined, ArrowDownOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

import { IThemeProps } from '../../types';
import { strategies } from './strategyDetailsData';
import { blockForName } from './Blocks';
import { useStrategyStore } from '../../hooks';

const { Title, Text } = Typography;

const { RangePicker } = DatePicker;

function StrategyDetails() {
  const location = useLocation();
  const [form] = Form.useForm();
  const { pathname } = location;
  const txs = useStrategyStore((state) => state.txs);

  console.log(txs);

  const strategyName = useMemo(() => {
    return pathname.split('/').reverse()[0];
  }, [pathname]);

  const strategy = strategies[strategyName];

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
    const res = await form.validateFields();
    console.log(res);
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
            <Text type="secondary">{strategy.description}</Text>
          </Col>
          <Col span={12}>
            <div className="outer">
              <div className="inner">{blocks}</div>
              <Repeat>
                <Card
                  title={
                    <>
                      <ReloadOutlined spin />
                      <Text className="cardTitle">Repeat</Text>
                    </>
                  }
                  extra={<BlockOutlined />}
                >
                  <Col flex="auto">
                    <RangePicker size="large" />
                  </Col>
                  <Col flex="263px">
                    <Radio.Group defaultValue="a" size="large">
                      <Radio.Button value="a">Daily</Radio.Button>
                      <Radio.Button value="b">Weekly</Radio.Button>
                      <Radio.Button value="c">Monthly</Radio.Button>
                    </Radio.Group>
                  </Col>
                </Card>
              </Repeat>
            </div>
            <Footer>
              <Space direction="vertical" size="large">
                <Button type="primary" size="large" onClick={handleSubmit}>
                  Automate!
                </Button>
                <Text type="secondary">
                  This automation will generate <strong>14 transactions</strong> for you to sign in Metamask.
                </Text>
              </Space>
            </Footer>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
const Repeat = styled.div`
  .ant-card {
    border: none;
    background-color: ${(props: IThemeProps) => props.theme.colors.accent} !important;
    margin-bottom: 0px !important;
  }
  .ant-card-head {
    border-color: rgb(255 255 255 / 25%);
  }
  .ant-card-extra {
    color: rgb(255 255 255 / 45%) !important;
  }
`;

const Footer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 3em;
`;

const Arrow = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2px 0;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1220px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;

  .outer {
    border: 1px solid ${(props: IThemeProps) => props.theme.colors.accent};
    border-radius: 2px;
  }

  .inner {
    padding: 10px 10px 20px;
  }

  .ant-card {
    border: none;
    background-color: rgb(245 245 245 / 5%);
  }

  .ant-typography.ant-typography-secondary {
    color: rgb(255 255 255 / 45%);
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

export default StrategyDetails;
