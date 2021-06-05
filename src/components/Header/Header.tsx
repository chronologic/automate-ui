import { Layout } from 'antd';
import styled from 'styled-components';

import ConnectionStatus from './ConnectionStatus';
import HeaderMain from './HeaderMain';
import Stats from './Stats';

function Header() {
  return (
    <Layout.Header>
      <Wrapper>
        <ConnectionStatus />
        <HeaderMain />
        <Stats />
      </Wrapper>
    </Layout.Header>
  );
}

const Wrapper = styled.div`
  display: 'flex';
  flex-direction: column;
`;

export default Header;
