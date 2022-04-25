import { Layout } from 'antd';
import styled from 'styled-components';

function StrategyList() {
  return (
    <Layout.Header>
      <Wrapper></Wrapper>
    </Layout.Header>
  );
}

const Wrapper = styled.div`
  display: 'flex';
  flex-direction: column;
`;

export default StrategyList;
