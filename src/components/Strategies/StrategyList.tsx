import { Card, Row, Col, Typography } from 'antd';
import styled from 'styled-components';

import { IStrategy } from './../../types';
import { strategies } from './strategyData';

const { Meta } = Card;

const { Text } = Typography;

function StrategyList() {
  const strategyClick = (strategy: IStrategy) => {
    try {
      (window as any).heap.track('StrategyClicked', {
        strategy: strategy.title,
        url: strategy.url,
        id: strategy.id,
      });
    } catch (e) {
      console.error(e as any);
    }
    const comingSoonText = document.getElementById(String(strategy.id));
    if (strategy.comingSoon) {
      comingSoonText!.classList.add('visible');
    } else {
      window.open('/' + strategy.url);
    }
  };

  return (
    <Container>
      <Row gutter={[24, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
        {strategies.map((strategy) => (
          <Col span={8} key={strategy.id}>
            <div onClick={() => strategyClick(strategy)}>
              <Card hoverable cover={<img alt={strategy.title} src={strategy.imageSrc} />}>
                <Meta title="Claim Rewards" description={strategy.title} />
                <Text type="danger" className="comingSoonText" id={String(strategy.id)}>
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
    background-color: rgb(255 255 255 / 5%);
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

  .comingSoonText {
    float: right;
    transition: opacity 0.2s ease;
    opacity: 0;
    &.visible {
      opacity: 1;
    }
  }
`;

export default StrategyList;
