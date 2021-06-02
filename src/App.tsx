import 'antd/dist/antd.css';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import { MAINTENANCE_MODE } from './env';
import Auth from './components/Auth/Auth';
import Scheduleds from './components/Scheduleds';
import Maintenance from './components/Maintenance';
import { Providers } from './Providers';
import GlobalStyle from './GlobalStyle';
import { useTheme } from './hooks';

const antIcon = <LoadingOutlined style={{ fontSize: 72 }} spin />;
const LegacyComponent = lazy(() => import('./legacy/Legacy'));

class Wrapper extends React.Component {
  public render() {
    return (
      <Providers>
        <App />
      </Providers>
    );
  }
}

function App() {
  const { theme } = useTheme();

  if (MAINTENANCE_MODE) {
    return <Maintenance />;
  }

  return (
    <Router>
      <Suspense
        fallback={
          <LoaderWrapper>
            <Spin indicator={antIcon} />
          </LoaderWrapper>
        }
      >
        <Switch>
          <Route path="/legacy" render={() => <LegacyComponent />} />
          <Route path="*">
            <GlobalStyle theme={theme} />
            <Switch>
              <Route exact={true} path="/" component={Auth} />
              <Route path="/scheduleds" component={Scheduleds} />
            </Switch>
          </Route>
        </Switch>
      </Suspense>
      {/* <Header updateCounter={updateCounter} /> */}
    </Router>
  );
}

const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export default Wrapper;
