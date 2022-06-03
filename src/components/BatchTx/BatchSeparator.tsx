import { useCallback } from 'react';
import { Radio } from 'antd';
import styled from 'styled-components';

import { useBatchConfig } from './useBatchConfig';

function BatchSeparator() {
  const { selectSeparator, selectedSeparator, separators } = useBatchConfig();

  const handleChange = useCallback(
    (e) => {
      selectSeparator(e.target.value);
    },
    [selectSeparator]
  );

  return (
    <Container>
      <Radio.Group value={selectedSeparator} onChange={handleChange}>
        {separators.map((item) => (
          <Radio key={item.name} value={item.name}>
            {item.label}
          </Radio>
        ))}
      </Radio.Group>
    </Container>
  );
}

const Container = styled.div``;

export default BatchSeparator;
