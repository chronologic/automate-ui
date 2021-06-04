import { useCallback, useState } from 'react';
import { Button, Checkbox, Typography, Slider } from 'antd';
import styled from 'styled-components';

import PageTitle from '../PageTitle';
import { useAuth } from '../../hooks';

const sliderMarks = {
  0: {
    label: <div>Immediate</div>,
  },
  1: {
    label: <div>24 hours (recommended)</div>,
  },
  2: {
    label: <div>3 days</div>,
  },
  3: {
    label: <div>5 days</div>,
  },
};

function Config() {
  return (
    <Container>
      <PageTitle />
      <Typography.Title level={3} className="title">
        Connection Settings
      </Typography.Title>
      <Checkboxes>
        <CheckboxSection>
          <Checkbox>Gas price aware</Checkbox>
          <p>
            Once the network gas price falls below the gas cost specified in the transaction, it will be broadcast to
            the network.
          </p>
        </CheckboxSection>
        <CheckboxSection>
          <Checkbox>Draft mode (Advanced)</Checkbox>
          <p>
            No transaction will be broadcast to the Ethereum network until you go to the Transaction list and specify
            additional conditions.
          </p>
        </CheckboxSection>
      </Checkboxes>
      <SliderContainer>
        <Slider marks={sliderMarks} step={1} defaultValue={1} min={0} max={3} tooltipVisible={false} />
      </SliderContainer>
      <Button type="primary" size="large">
        Connect to Automate
      </Button>
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
  padding: 60px 20px 20px 20px;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    font-weight: 300;
    margin-bottom: 30px;
  }
`;

const Checkboxes = styled.div`
  display: flex;
  flex-direction: row;
`;

const CheckboxSection = styled.div`
  flex: 1;
`;

const SliderContainer = styled.div`
  width: 100%;
`;

export default Config;
