import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import styled from 'styled-components';

import { IStatsItem, StatsAPI } from '../../api/StatsAPI';
import { IThemeProps } from '../../types';

function Stats() {
  const [pending, setPending] = useState<IStatsItem>({
    assetCount: 0,
    txCount: 0,
    value: 0,
  });
  const [completed, setCompleted] = useState<IStatsItem>({
    assetCount: 0,
    txCount: 0,
    value: 0,
  });

  useEffect(() => {
    async function updateStats() {
      const stats = await StatsAPI.getStats();
      setCompleted(stats.completed);
      setPending(stats.pending);
    }
    updateStats();
  }, []);

  return (
    <Container>
      <StatsElement>
        Transferred{' '}
        <CountUp prefix="$" separator="," end={completed.value} preserveValue={true} className="header-countup" /> in{' '}
        <CountUp end={completed.txCount} preserveValue={true} className="header-countup" /> tx
        {/* <CountUp end={completed.assetCount} preserveValue={true} className="header-countup" /> assets! */}
      </StatsElement>

      <StatsElement>
        Pending <CountUp prefix="$" separator="," end={pending.value} preserveValue={true} className="header-countup" />{' '}
        in <CountUp end={pending.txCount} preserveValue={true} className="header-countup" /> tx
        {/* across <CountUp end={pending.assetCount} preserveValue={true} className="header-countup" /> assets! */}
      </StatsElement>
    </Container>
  );
}

const Container = styled.div`
  background-color: ${(props: IThemeProps) => props.theme.colors.accent};
  color: ${(props: IThemeProps) => props.theme.colors.textAccent};
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 8px 48px;
  font-size: 1.2rem;
  font-weight: 300;
`;

const StatsElement = styled.div`
  .header-countup {
    font-size: 2.4rem;
    font-weight: normal;
  }
`;

export default Stats;
