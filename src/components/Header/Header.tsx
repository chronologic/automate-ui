import * as React from 'react';
import { Link } from 'react-router-dom';

class Header extends React.Component {
  public render() {
    return (
      <div className="bx--row">
        <Link to="/" style={{ textDecoration: 'none' }}>
            <img src="https://s3.amazonaws.com/chronologic.network/ChronoLogic_logo.svg" width="128px" height="48px"/><div className="bx--type-alpha bx--col-xs-3">Automate</div>
        </Link>
      </div>
    );
  }
}

export default Header;
