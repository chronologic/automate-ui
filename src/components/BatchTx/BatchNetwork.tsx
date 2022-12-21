import { useCallback } from 'react';
import { Radio, Typography } from 'antd';
import styled from 'styled-components';

import { useBatchConfig } from './useBatchConfig';

function BatchNetwork() {
  const { selectNetwork, selectedNetwork, networks } = useBatchConfig();

  const handleChange = useCallback(
    (e) => {
      selectNetwork(e.target.value);
    },
    [selectNetwork]
  );

  return (
    <Container>
      <Typography.Title level={4}>Select network</Typography.Title>
      <Radio.Group value={selectedNetwork?.name} onChange={handleChange}>
        {networks.map((item) => (
          <Radio key={item.name} value={item.name}>
            {item.icon} {item.label}
          </Radio>
        ))}
      </Radio.Group>
    </Container>
  );
}

const Container = styled.div`
  .ant-radio-wrapper {
    transition: filter 1s ease;
    &:not(.ant-radio-wrapper-checked) {
      filter: grayscale(1);
    }
  }
`;

export default BatchNetwork;
