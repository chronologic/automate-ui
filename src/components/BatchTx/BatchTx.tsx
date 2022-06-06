import styled from 'styled-components';

import { useBatchConfig } from './useBatchConfig';
import BatchColumns from './BatchColumns';
import BatchSeparator from './BatchDelimiter';
import BatchAsset from './BatchAsset';
import BatchCsv from './BatchCsv';
import BatchPreview from './BatchPreview';
import BatchExecute from './BatchExecute';
import { SCREEN_BREAKPOINT } from '../../constants';

function BatchTx() {
  return (
    <Container>
      <BatchColumns />
      <BatchSeparator />
      <BatchAsset />
      <BatchCsv />
      <BatchPreview />
      <BatchExecute />
    </Container>
  );
}

const Container = styled.div`
  width: ${SCREEN_BREAKPOINT.XL}px;
`;

export default BatchTx;
