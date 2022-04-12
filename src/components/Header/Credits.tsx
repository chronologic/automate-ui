import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useUser } from '../../hooks';
import { MINUTE_MILLIS, TABLET_SCREEN_THRESHOLD } from '../../constants';
import { IUserCredits } from '../../types';
import { Typography } from 'antd';
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
      <div className="titleContainer">
        <Typography.Title className="title" level={5}>
          CREDITS:
        </Typography.Title>
      </div>
      <div className="statsContainer">
        <div className="stat">
          <span className="label">Community</span>
          <span className="value">{formatNumber(credits.community || 0, 0, '0')}</span>
        </div>
        <div className="divider">&nbsp;</div>
        <div className="stat">
          <span className="label">Individual</span>
          <span className="value">{formatNumber(credits.user || 0, 0, '0')}</span>
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

  @media (max-width: ${TABLET_SCREEN_THRESHOLD}px) {
    flex-direction: column;

    .title {
      font-size: 1.2rem;
      margin: 0;
    }

    .statsContainer {
      flex-direction: column;
      border: none;
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
  }
`;

export default Credits;