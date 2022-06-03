import { useBatchConfig } from './useBatchConfig';
import BatchColumns from './BatchColumns';
import BatchSeparator from './BatchSeparator';
import BatchAsset from './BatchAsset';

function BatchTx() {
  const config = useBatchConfig();

  return (
    <div>
      <BatchColumns />
      <BatchSeparator />
      <BatchAsset />
    </div>
  );
}

export default BatchTx;
