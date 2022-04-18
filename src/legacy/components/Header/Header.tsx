import React from 'react';
import { Link } from 'react-router-dom';

import { IStatsItem, StatsAPI } from '../../../api/StatsAPI';
import logo from './logo.svg';

interface IHeaderProps {
  updateCounter: number;
}

interface IHeaderState {
  completed: IStatsItem;
  pending: IStatsItem;
  statsLoaded: boolean;
}

class Header extends React.Component<IHeaderProps, IHeaderState> {
  public state = {
    completed: {
      assetCount: 0,
      txCount: 0,
      value: 0,
    },
    pending: {
      assetCount: 0,
      txCount: 0,
      value: 0,
    },
    statsLoaded: false,
  };

  public componentDidMount() {
    this.updateStats();
  }

  public componentWillReceiveProps() {
    this.updateStats();
  }

  public async updateStats() {
    const { completed, pending } = await StatsAPI.getStats();

    console.log(completed, pending);

    this.setState({
      completed,
      pending,
      statsLoaded: true,
    });
  }

  public render() {
    return (
      <div className="bx--row carbon--center header">
        {/* {statsLoaded && (
          <div className="header-stats-container">
            Transferred{' '}
            <CountUp prefix="$" separator="," end={completed.value} preserveValue={true} className="header-countup" />{' '}
            in <CountUp end={completed.txCount} preserveValue={true} className="header-countup" /> transactions across{' '}
            <CountUp end={completed.assetCount} preserveValue={true} className="header-countup" /> assets!
          </div>
        )} */}
        <Link
          to="/"
          style={{
            display: 'flex',
            flexShrink: 0,
            textDecoration: 'none',
            width: '300px',
          }}
        >
          <img alt="logo" src={logo} />
        </Link>
        {/* {statsLoaded && (
          <div className="header-stats-container">
            Pending{' '}
            <CountUp prefix="$" separator="," end={pending.value} preserveValue={true} className="header-countup" /> of
            transfers in <CountUp end={pending.txCount} preserveValue={true} className="header-countup" /> transactions
            across <CountUp end={pending.assetCount} preserveValue={true} className="header-countup" /> assets!
          </div>
        )} */}
      </div>
    );
  }
}

export default Header;
