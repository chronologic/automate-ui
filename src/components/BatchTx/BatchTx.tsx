import { useMemo } from 'react';

import { useBatchConfig } from './useBatchConfig';
import BatchColumns from './BatchColumns';

function BatchTx() {
  const config = useBatchConfig();

  return (
    <div>
      <BatchColumns />
    </div>
  );
}

export default BatchTx;
