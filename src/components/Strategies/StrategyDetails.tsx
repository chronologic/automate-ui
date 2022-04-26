import { Card, Row, Col, Typography, Input, DatePicker, Radio, Button, Space } from 'antd';
import { BlockOutlined, GiftOutlined, ExportOutlined, ReloadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { IThemeProps } from '../../types';

const { Title, Text } = Typography;

const { RangePicker } = DatePicker;

function StrategyDetails() {
  return (
    <Container>
      <Row gutter={[24, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
        <Col span={12}>
          <Title level={3}>Claim Rewards</Title>
          <Text type="secondary">
            Use this combo when you want to periodically claim $MAGIC earned during a vested release. This strategy
            combines two steps for you: sending $MAGIC to a specified wallet address and setting up recurring payouts.
          </Text>
        </Col>
        <Col span={12}>
          <div className="outer">
            <div className="inner">
              <Card
                hoverable
                title={
                  <>
                    <GiftOutlined />
                    <Text className="cardTitle">Claim Rewards</Text>
                  </>
                }
                extra={<BlockOutlined />}
              >
                <Col flex="14px">
                  <img alt="example" src="../img/atlas-mine.jpg" height="72px" />
                </Col>
                <Col flex="auto">
                  <div>
                    <Title className="secondary" level={5}>
                      Atlas Mine
                    </Title>
                    <Text type="secondary">There is nothing to specify at this step.</Text>
                  </div>
                </Col>
              </Card>

              <Card
                hoverable
                title={
                  <>
                    <ExportOutlined />
                    <Text className="cardTitle">Send $MAGIC</Text>
                  </>
                }
                extra={<BlockOutlined />}
              >
                <Col flex="390px">
                  <Input size="large" placeholder="To address" />
                </Col>
                <Col flex="auto">
                  <Input size="large" placeholder="Amount" />
                </Col>
              </Card>
            </div>

            <Repeat>
              <Card
                title={
                  <>
                    <ReloadOutlined />
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
              <Button type="primary" size="large">
                Automate!
              </Button>
              <Text type="secondary">
                This automation will generate <strong>14 transactions</strong> for you to sign in Metamask.
              </Text>
            </Space>
          </Footer>
        </Col>
      </Row>
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


  }
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
    padding: 10px 10px 0;
  }

  .ant-card {
    border: none;
    background-color: rgb(245 245 245 / 5%);
  }

  .ant-typography.ant-typography-secondary {
    color: rgb(255 255 255 / 45%);
  }

  .ant-card {
    margin-bottom: 24px;
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
