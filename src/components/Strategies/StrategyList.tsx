import { Card, Row, Col, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Meta } = Card;

const { Text } = Typography;

function StrategyList() {
  return (
    <Container>
      <Row gutter={[24, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
        <Col span={8}>
          <Card hoverable cover={<img alt="example" src="../img/atlas-mine.jpg" />}>
            <Meta title="Claim Rewards" description="Bridgeworld (Atlas Mine)" />
          </Card>
        </Col>
        <Col span={8}>
          <Card hoverable cover={<img alt="example" src="../img/magic-dragon.jpg" />}>
            <Meta title="Claim Rewards" description="Magic Dragon DAO" />
            <Text type="danger" className="soon">
              COMING SOON!
            </Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card hoverable cover={<img alt="example" src="../img/battlefly.jpg" />}>
            <Meta title="Claim Rewards" description="BattleFly" />
            <Text type="danger" className="soon">
              COMING SOON!
            </Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card hoverable cover={<img alt="example" src="../img/tales-of-alleria.jpg" />}>
            <Meta title="Claim Rewards" description="Tales of Elleria" />
            <Text type="danger" className="soon">
              COMING SOON!
            </Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card hoverable cover={<img alt="example" src="../img/smithy.jpg" />}>
            <Meta title="Go on Quests" description="SmithyDAO" />
            <Text type="danger" className="soon">
              COMING SOON!
            </Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="antcard" hoverable cover={<img alt="example" src="../img/ivory-tower.jpg" />}>
            <Meta title="Send Legions Questing" description="Bridgeworld" />
            <Text type="danger" className="soon">
              COMING SOON!
            </Text>
          </Card>
        </Col>
        <Col span={8}>
          <Create>
            <div
              data-tf-popup="qL2sZQN7"
              data-tf-auto-close="2000"
              data-tf-iframe-props="title=Automate ideas"
              data-tf-medium="snippet"
            >
              <Card className="antcard" hoverable>
                <PlusOutlined />
                <Meta description="Create your own" />
              </Card>
            </div>
          </Create>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
}

const Create = styled.div`
  text-align: center;
  .ant-card-body {
    padding: 132px 24px;
  }
  .ant-card-bordered {
    border: 1px dashed rgb(245 245 245 / 15%) !important;
  }
  .ant-card-hoverable:hover {
    border-color: ${(props) => props.theme.colors.accent} !important;
  }
  .ant-card-meta {
    display: block !important;
  }
  .anticon {
    font-size: 200%;
    color: rgb(245 245 245 / 45%);
    padding-bottom: 1em;
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

  .ant-card {
    border: none;
    background-color: rgb(245 245 245 / 5%);
    color: #f5f5f5;
  }

  .ant-card-meta-title {
    color: white;
  }
  .ant-card-meta-description {
    color: rgb(255 255 255 / 45%);
  }

  .ant-card-meta {
    display: inline-block;
  }

  .soon {
    float: right;
  }
`;

export default StrategyList;
