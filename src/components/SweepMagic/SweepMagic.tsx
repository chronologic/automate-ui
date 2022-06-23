import styled from 'styled-components';
import { Typography, Form } from 'antd';

import { SCREEN_BREAKPOINT } from '../../constants';
import SweepFrom from './SweepFrom';
import SweepTo from './SweepTo';

function SweepMagic() {
  return (
    <Container>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="on"
        size="large"
      >
        <Typography.Title level={3} className="title">
          Sweep Magic
        </Typography.Title>
        <Typography.Title level={5} className="subtitle">
          Sweep Magic Tokens From Our Adress To a whitelisted Your Adress.
        </Typography.Title>
        <SweepFrom />
        <SweepTo />
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
    margin-left: 30px;
  }
`;

export default SweepMagic;
