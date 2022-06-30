import styled from 'styled-components';
import { Typography, Form } from 'antd';

import { SCREEN_BREAKPOINT } from '../../constants';
import SweepExecute from './SweepExecute';
import SweepApprove from './SweepApprove';

function Sweep() {
  return (
    <Container>
      <Form name="SweepForm" labelCol={{ span: 6 }} autoComplete="on" size="large">
        <Typography.Title level={3} className="title">
          Sweep Magic
        </Typography.Title>
        <SweepApprove />
        <SweepExecute />
      </Form>
    </Container>
  );
}

const Container = styled.div`
  width: ${SCREEN_BREAKPOINT.MD}px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: 0 auto;
  padding: 24px 12px 64px 12px;

  .title {
    text-align: center;
  }
  .subtitle {
    text-align: center;
  }
`;

export default Sweep;
