import 'antd/dist/antd.css';
import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import Schedule from './components/Schedule/Schedule';
import Scheduleds from './components/Scheduleds';
import View from './components/View/View';
// import Maintenance from './Maintenance';

interface IAppState {
  updateCounter: number;
}

class App extends React.Component<{}, IAppState> {
  public state = {
    updateCounter: 0
  };

  constructor(props: {}) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  public handleChange() {
    this.setState(state => ({
      updateCounter: state.updateCounter + 1
    }));
  }

  public render() {
    const { updateCounter } = this.state;
    const renderScheduleRoute = () => <Schedule onChange={this.handleChange} />;
    const renderViewRoute = (props: any) => (
      <View {...props} onChange={this.handleChange} />
    );
    const renderScheduledsRoute = () => <Scheduleds />;

    return (
      <Router>
        <div className="bx--grid">
          <Header updateCounter={updateCounter} />
          <Route exact={true} path="/" render={renderScheduleRoute} />
          <Route path="/view/:id/:key" render={renderViewRoute} />
          <Route path="/scheduleds" render={renderScheduledsRoute} />
        </div>
      </Router>
    );
  }
  // public render() {
  //   return <Maintenance />;
  // }
}

export default App;
