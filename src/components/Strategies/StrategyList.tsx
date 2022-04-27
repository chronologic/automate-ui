import { Card, Row, Col, Typography } from 'antd';
import styled from 'styled-components';

import { IStrategies } from './../../types';

import { strategies } from './StrategyData';

const { Meta } = Card;

const { Text } = Typography;

function StrategyList() {
  const strategyClick = (strategy: IStrategies) => {
    var comingSoonTextId = document.getElementById(strategy.title);
    if (strategy.displayComingSoonText) {
      comingSoonTextId!.style.display = 'block';
    } else {
      window.open('/' + strategy.detailPageURL);
    }
  };

  return (
    <Container>
      <Row gutter={[24, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
        {strategies.map((strategy) => (
          <Col span={8} key={strategy.itemId}>
            <div onClick={() => strategyClick(strategy)} id={strategy.itemId.toString()}>
              <Card hoverable cover={<img alt={strategy.title} src={strategy.imageSrc} />}>
                <Meta title="Claim Rewards" description={strategy.title} />
                <Text type="danger" className="soon" id={strategy.title}>
                  COMING SOON!
                </Text>
              </Card>
            </div>
          </Col>
        ))}
      </Row>
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
    display: none;
    float: right;
  }
`;

export default StrategyList;
