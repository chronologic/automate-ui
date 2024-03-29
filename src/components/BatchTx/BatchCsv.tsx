import { useCallback } from 'react';
import { Input, Typography } from 'antd';
import styled from 'styled-components';

import { useBatchParser } from './useBatchParser';
import { useBatchConfig } from './useBatchConfig';

const { TextArea } = Input;

function BatchCsv() {
  const { rawInput, setRawInput } = useBatchParser();
  const { selectedDelimiter } = useBatchConfig();

  const handleChange = useCallback(
    (e) => {
      setRawInput(e.target.value);
    },
    [setRawInput]
  );

  return (
    <Container>
      <Typography.Title level={4}>Paste {selectedDelimiter?.fileType || ''} data</Typography.Title>
      <TextArea rows={5} placeholder="Paste transactions here" value={rawInput} onChange={handleChange} />
    </Container>
  );
}

const Container = styled.div``;

export default BatchCsv;
