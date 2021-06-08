import { useCallback, useState } from 'react';
import { Route, Switch } from 'react-router-dom';

import './legacy.css';
import Header from './components/Header/Header';
import Schedule from './components/Schedule/Schedule';
import View from './components/View/View';

function LegacyApp() {
  const [updateCounter, setUpdateCounter] = useState(0);
  const handleChange = useCallback(() => {
    setUpdateCounter(updateCounter + 1);
  }, [updateCounter]);

  const renderScheduleRoute = () => <Schedule onChange={handleChange} />;
  const renderViewRoute = (props: any) => <View {...props} onChange={handleChange} />;

  return (
    <div className="bx--grid">
      <Header updateCounter={updateCounter} />
      <Switch>
        <Route path="/legacy/view/:id/:key" render={renderViewRoute} />
        <Route path="/legacy" render={renderScheduleRoute} />
      </Switch>
    </div>
  );
}

export default LegacyApp;
