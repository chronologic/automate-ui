import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import Schedule from './components/Schedule/Schedule';
import View from './components/View/View';

class App extends React.Component {
  public render() {
    return (
      <Router>
        <div className="bx--grid">
          <Header />
          <div className="bx--row space" />
          <Route exact={true} path="/" component={Schedule} />
          <Route path="/view/:id/:key" component={View} />
        </div>
      </Router>
    );
  }
}

export default App;
