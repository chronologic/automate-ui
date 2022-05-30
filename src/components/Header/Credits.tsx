import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { useUser } from '../../hooks';
import { MINUTE_MILLIS, SCREEN_BREAKPOINT } from '../../constants';
import { IUserCredits } from '../../types';
import { Typography, Tooltip } from 'antd';
import { formatNumber } from '../../utils';

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
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  .statsContainer {
    display: flex;
    flex-direction: row;
    align-items: center;
    border: 1px solid ${(props) => props.theme.colors.border};
    border-radius: 3px;
    padding: 8px 6px;
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
    margin-left: 5px;
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

  @media (max-width: ${SCREEN_BREAKPOINT.LG}px) {
    flex-direction: column;

    .title {
      margin: 0;
    }

    .statsContainer {
      border: none;
      padding: 4px;
    }

    .stat {
      padding: 0px;
      font-size: 1.6rem;
    }

    /*
    .value {
      font-size: 1.2rem;
    }
    */

    .divider {
      display: none;
    }
  }
`;

export default Credits;
