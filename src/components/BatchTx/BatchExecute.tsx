import { Button } from 'antd';
import styled from 'styled-components';

import { useBatchExecute } from './useBatchExecute';
import { useBatchParser } from './useBatchParser';

function BatchExecute() {
  const { isValid } = useBatchParser();
  const { loading, onSubmit } = useBatchExecute();

  return (
    <Container>
      <Button type="primary" disabled={!isValid} loading={loading} onClick={onSubmit}>
        Schedule
      </Button>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

export default BatchExecute;
