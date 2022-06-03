import { useMemo } from 'react';

import { useBatchConfig } from './useBatchConfig';
import BatchColumns from './BatchColumns';
import BatchSeparator from './BatchSeparator';

function BatchTx() {
  const config = useBatchConfig();

  return (
    <div>
      <BatchColumns />
      <BatchSeparator />
    </div>
  );
}

export default BatchTx;
