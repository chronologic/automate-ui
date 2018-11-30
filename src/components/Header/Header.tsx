import * as React from 'react';
import { Link } from 'react-router-dom';

class Header extends React.Component {
  private names = [
    'Conditional',
    'AutoWorkflow',
    'AutoWorkflows',
    'AutoTrigger',
    'AutoScheduler',
    'Conditional Scheduler',
    'Automated Workflow',
    'Automate',
    'eththen',
    'deIFTTT',
    'deIF',
    'IFTTEth',
    'ifeth',
    'eththen',
    'Blockflow',
    'EthPI',
    'ETHAPI'
  ]

  public render() {
    const name = this.names[Math.floor((Math.random() * this.names.length))];

    const icon = (
      <svg width="45" height="45" viewBox="0 0 21 24">
        <path d="M9.5 1c.9 0 1.5.7 1.5 1.5S10.4 4 9.5 4C8.7 4 8 3.3 8 2.5S8.7 1 9.5 1zm0-1C8.2 0 7 1.1 7 2.5S8.2 5 9.5 5 12 3.9 12 2.5 10.9 0 9.5 0zM17 4l-3 1.7v2.4L10.3 6 5 9v3.6l-2-1.1-3 1.7v3.5l3 1.7 3-1.7v-1.1l4.5 2.4 5-3v-4.9l1.5.9 3-1.7V5.8L17 4zm-6.7 3.2l3.8 2.1-3.5 1.8-4-1.8 3.7-2.1zM5 16.1l-2 1.2-2-1.1v-2.3l2-1.2 2 1.1v2.3zm1-5.9l4 1.8v4.6l-4-2.2v-4.2zm5 6.3V12l3.5-1.8v4.2L11 16.5zm8-7.8l-2 1.2-2-1.2V6.3l2-1.2 2 1.2v2.4zM2.5 4C3.4 4 4 4.7 4 5.5S3.4 7 2.5 7 1 6.3 1 5.5 1.7 4 2.5 4zm0-1C1.1 3 0 4.1 0 5.5S1.1 8 2.5 8 5 6.9 5 5.5 3.9 3 2.5 3zm9 17c.8 0 1.5.7 1.5 1.5s-.6 1.5-1.5 1.5-1.5-.7-1.5-1.5.7-1.5 1.5-1.5zm0-1C10.1 19 9 20.1 9 21.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.1-2.5-2.5-2.5zm7-3c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5.7-1.5 1.5-1.5zm0-1c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.1-2.5-2.5-2.5z" />
      </svg>
    );

    return <Link to="/" style={{ textDecoration: 'none' }}><div className="bx--type-alpha bx--row">{name}{icon}</div></Link>
  }
};

export default Header;