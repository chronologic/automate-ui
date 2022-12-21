import styled from 'styled-components';
import { Typography } from 'antd';

import { SCREEN_BREAKPOINT } from '../../constants';
import BatchColumns from './BatchColumns';
import BatchSeparator from './BatchDelimiter';
import BatchAsset from './BatchAsset';
import BatchCsv from './BatchCsv';
import BatchPreview from './BatchPreview';
import BatchTotalAmount from './BatchTotalAmount';
import BatchExecute from './BatchExecute';
import BatchNetwork from './BatchNetwork';

function BatchTx() {
  return (
    <Container>
      <Typography.Title level={3} className="title">
        Batch Schedule
      </Typography.Title>
      <BatchColumns />
      <BatchSeparator />
      <BatchNetwork />
      <BatchAsset />
      <BatchCsv />
      <BatchPreview />
      <BatchTotalAmount />
      <BatchExecute />
    </Container>
  );
}

const Container = styled.div`
  width: ${SCREEN_BREAKPOINT.XL}px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: 0 auto;
  padding: 24px 12px 64px 12px;

  .title {
    text-align: center;
    margin-bottom: 32px;
  }

  > * {
    margin-bottom: 32px;
  }
`;

export default BatchTx;
