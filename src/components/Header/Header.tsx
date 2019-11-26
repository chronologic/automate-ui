import * as React from 'react';
import * as ReactCountUp from 'react-countup';
import { Link } from 'react-router-dom';

import { IStatsDict, StatsAPI } from '../../api/StatsAPI';
import logo from './logo.svg';

const CountUp = (ReactCountUp as any).default;

interface IStatsSummary {
  assets: number;
  count: number;
  value: number;
}

interface IHeaderProps {
  updateCounter: number;
}

interface IHeaderState {
  completed: IStatsSummary;
  pending: IStatsSummary;
  statsLoaded: boolean;
}

class Header extends React.Component<IHeaderProps, IHeaderState> {
  public state = {
    completed: {
      assets: 0,
      count: 0,
      value: 0
    },
    pending: {
      assets: 0,
      count: 0,
      value: 0
    },
    statsLoaded: false
  };

  public componentDidMount() {
    this.updateStats();
  }

  public componentWillReceiveProps() {
    this.updateStats();
  }

  public async updateStats() {
    const stats = await StatsAPI.getStats();
    const completed = this.summarizeStats(stats.completed);
    const pending = this.summarizeStats(stats.pending);

    this.setState({
      completed,
      pending,
      statsLoaded: true
    });
  }

  public summarizeStats(statsDict: IStatsDict): IStatsSummary {
    let count = 0;
    let value = 0;
    let assets = 0;
    Object.keys(statsDict).forEach(key => {
      const item = statsDict[key];
      count += item.count;
      value += item.value;
      assets++;
    });

    return { assets, count, value };
  }

  public render() {
    const { completed, pending, statsLoaded } = this.state;
    return (
      <div className="bx--row carbon--center header">
        {statsLoaded && (
          <div className="header-stats-container">
            Transferred{' '}
            <CountUp
              prefix="$"
              separator=","
              end={completed.value}
              preserveValue={true}
              className="header-countup"
            />{' '}
            in{' '}
            <CountUp
              end={completed.count}
              preserveValue={true}
              className="header-countup"
            />{' '}
            transactions across{' '}
            <CountUp
              end={completed.assets}
              preserveValue={true}
              className="header-countup"
            />{' '}
            assets!
          </div>
        )}
        <Link
          to="/"
          style={{
            display: 'flex',
            flexShrink: 0,
            textDecoration: 'none',
            width: '300px'
          }}
        >
          <img src={logo} />
        </Link>
        {statsLoaded && (
          <div className="header-stats-container">
            Pending{' '}
            <CountUp
              prefix="$"
              separator=","
              end={pending.value}
              preserveValue={true}
              className="header-countup"
            />{' '}
            of transfers in{' '}
            <CountUp
              end={pending.count}
              preserveValue={true}
              className="header-countup"
            />{' '}
            transactions across{' '}
            <CountUp
              end={pending.assets}
              preserveValue={true}
              className="header-countup"
            />{' '}
            assets!
          </div>
        )}
      </div>
    );
  }
}

export default Header;
