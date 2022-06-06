import { useCallback } from 'react';
import { Radio } from 'antd';
import styled from 'styled-components';

import { useBatchConfig } from './useBatchConfig';

function BatchDelimiter() {
  const { selectDelimiter, selectedDelimiter, delimiters } = useBatchConfig();

  const handleChange = useCallback(
    (e) => {
      selectDelimiter(e.target.value);
    },
    [selectDelimiter]
  );

  return (
    <Container>
      <Radio.Group value={selectedDelimiter?.name} onChange={handleChange}>
        {delimiters.map((item) => (
          <Radio key={item.name} value={item.name}>
            {item.label}
          </Radio>
        ))}
      </Radio.Group>
    </Container>
  );
}

const Container = styled.div``;

export default BatchDelimiter;
