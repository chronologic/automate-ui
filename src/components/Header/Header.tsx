import * as React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.svg';

class Header extends React.Component {
  public render() {
    return (
      <div className="bx--row carbon--center">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', width: '300px' }}>
          <img src={logo}/>
        </Link>
      </div>
    );
  }
}

export default Header;
