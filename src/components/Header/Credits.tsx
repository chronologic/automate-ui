import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { QuestionCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Typography, Tooltip } from 'antd';

import { useUser } from '../../hooks';
import { MINUTE_MILLIS, SCREEN_BREAKPOINT } from '../../constants';
import { IUserCredits } from '../../types';
import { formatNumber } from '../../utils';
import BuyCreditsModal from './BuyCreditsModal';

function Credits() {
  const { getCredits } = useUser();
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState<IUserCredits>({} as any);

  useEffect(() => {
    let intervalId = setInterval(refreshCredits, 5 * MINUTE_MILLIS);
    refreshCredits();

    async function refreshCredits() {
      try {
        setLoading(true);
        const res = await getCredits();
        setCredits(res);
      } finally {
        setLoading(false);
      }
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [getCredits]);

  return (
    <Container>
      {/* <div className="titleContainer">
        <Typography.Title className="title" level={5}>
          CREDITS:
        </Typography.Title>
      </div> */}
      <div className="statsContainer">
        {/* <div className="stat">
          <span className="label">Community</span>
          <span className="value">{formatNumber(credits.community || 0, 0, '0')}</span>
        </div> */}
        {/* <div className="divider">&nbsp;</div> */}
        <div className="stat">
          <Typography.Title className="title" level={5}>
            CREDITS:
          </Typography.Title>
          <span className="value">{formatNumber(credits.user || 0, 0, '0')}</span>
          <div className="question">
            <Tooltip
              placement="bottom"
              title="Credits are used to schedule transactions. For each transaction 1 credit is deducted from your account."
            >
              <QuestionCircleOutlined />
            </Tooltip>
          </div>
        </div>
      </div>
      <BuyCreditsModal>
        <Typography.Link className="buyCredits">
          <ShoppingCartOutlined /> Buy Credits
        </Typography.Link>
      </BuyCreditsModal>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  .statsContainer {
    border: 1px solid ${(props) => props.theme.colors.border};
    border-radius: 3px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 4px 6px;
  }

  .title {
    font-weight: 300;
    margin: 0;
    margin-right: 8px;
  }

  .stat {
    padding: 8px 4px;
    display: contents;
  }

  .label {
    margin-right: 4px;
  }

  .value {
    color: ${(props) => props.theme.colors.accent};
    /* font-weight: bold; */
    font-size: 1.6rem;
  }

  .divider {
    width: 1px;
    margin: 0 6px;
    align-self: stretch;
    border-left: 1px solid ${(props) => props.theme.colors.border};
  }
  .question {
    margin-left: 5px;
  }

  .buyCredits {
    display: block;
    margin-top: 6px;
  }

  @media (max-width: ${SCREEN_BREAKPOINT.LG}px) {
    .title {
      font-size: 1.2rem;
      margin: 0;
    }

    .statsContainer {
      border: none;
      flex-direction: column;
      padding: 4px;
    }

    .stat {
      padding: 0;
      font-size: 1.2rem;
    }

    .value {
      font-size: 1.2rem;
    }

    .divider {
      display: none;
    }

    .buyCredits {
      display: none;
    }
  }
`;

export default Credits;
