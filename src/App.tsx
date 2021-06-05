import 'antd/dist/antd.css';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Spin, Layout } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import { MAINTENANCE_MODE } from './env';
import { Auth, Scheduleds, Maintenance, Header, Footer, PrivateRoute, Config, Transactions } from './components';
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
              <Route path="/scheduleds" component={Scheduleds} />
              <Route exact={true} path="/" component={Auth} />
            </Switch>
          </Layout.Content>
          <Footer />
        </Route>
      </Switch>
      {/* <Header updateCounter={updateCounter} /> */}
    </Suspense>
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
