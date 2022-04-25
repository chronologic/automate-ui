import 'antd/dist/antd.css';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { Spin, Layout, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import { MAINTENANCE_MODE } from './env';
import {
  Auth,
  Scheduleds,
  StrategyList,
  Maintenance,
  Header,
  Footer,
  PrivateRoute,
  Config,
  Transactions,
  CallToAction,
} from './components';
import { Providers } from './Providers';
import GlobalStyle from './GlobalStyle';
import { useEagerConnect, useTheme } from './hooks';

const antIcon = <LoadingOutlined style={{ fontSize: 72 }} spin />;
const LegacyComponent = lazy(() => import('./legacy/Legacy'));

class Wrapper extends React.Component {
  public render() {
    return (
      <Providers>
        <Router>
          <App />
        </Router>
      </Providers>
    );
  }
}

function App() {
  const { theme } = useTheme();
  const location = useLocation();
  useEagerConnect();

  if (MAINTENANCE_MODE) {
    return <Maintenance />;
  }

  return (
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
          <Header />
          <Layout.Content>
            <Switch>
              <PrivateRoute path="/transactions">
                <Transactions />
              </PrivateRoute>
              <PrivateRoute path="/connect">
                <Config />
              </PrivateRoute>
              <Route path="/strategies" component={StrategyList} />
              <Route path="/scheduleds" component={Scheduleds} />
              <Route exact={true} path="/" component={Auth} />
              <Route path="*" component={RouteFallback} />
            </Switch>
          </Layout.Content>
          {location.pathname.startsWith('/connect') && <CallToAction />}
          <Footer />
        </Route>
      </Switch>
      {/* <Header updateCounter={updateCounter} /> */}
    </Suspense>
  );
}

function RouteFallback() {
  const history = useHistory();
  const location = useLocation();

  if (location.pathname.match(/\/view\/[a-z0-9]+/i)) {
    history.replace(`/legacy${location.pathname}`);
  }

  return (
    <NotFound>
      <Typography.Title className="message">Not found</Typography.Title>
    </NotFound>
  );
}

const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const NotFound = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px;
  .message {
    font-weight: 300;
  }
`;

export default Wrapper;
