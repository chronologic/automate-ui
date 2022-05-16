import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Row, Col, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import { IStrategy } from './../../types';
import { strategyPathKey } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { strategies } from './strategyData';

const { Meta } = Card;
const { Text } = Typography;

function StrategyList() {
  const history = useHistory();
  const { user } = useAuth();

  const checkUserLoggedIn = (strategyUrl: string) => {
    if (user.apiKey) {
      sessionStorage.setItem(strategyPathKey, 'strategies/' + strategyUrl);
      history.push('/strategies/' + strategyUrl);
    } else {
      sessionStorage.setItem(strategyPathKey, 'strategies/' + strategyUrl);
      history.push('/login/');
    }
  };

  const strategyClick = useCallback(
    (strategy: IStrategy) => {
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
        checkUserLoggedIn(strategy.url);
      }
    },
    [history]
  );

  return (
    <Container>
      <Row gutter={[24, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
        {strategies.map((strategy) => (
          <Col span={24} md={12} lg={8} key={strategy.id}>
            <div onClick={() => strategyClick(strategy)}>
              <Card hoverable cover={<img alt={strategy.title} src={strategy.imageSrc} />}>
                <Meta title={strategy.title} description={strategy.subtitle} />
                <Text type="danger" strong className="comingSoonText" id={String(strategy.id)}>
                  COMING SOON!
                </Text>
              </Card>
            </div>
          </Col>
        ))}
        <Col span={24} md={12} lg={8}>
          <Create>
            <div
              data-tf-popup="qL2sZQN7"
              data-tf-auto-close="2000"
              data-tf-iframe-props="title=Automate ideas"
              data-tf-medium="snippet"
            >
              <Card className="antcard" hoverable>
                <PlusOutlined />
                <Meta description="Create your own!" />
              </Card>
            </div>
          </Create>
        </Col>
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
    vertical-align: middle;

    &.visible {
      opacity: 1;
    }
  }
`;

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

export default StrategyList;
