import { useBatchConfig } from './useBatchConfig';
import BatchColumns from './BatchColumns';
import BatchSeparator from './BatchDelimiter';
import BatchAsset from './BatchAsset';
import BatchCsv from './BatchCsv';
import BatchPreview from './BatchPreview';

function BatchTx() {
  const config = useBatchConfig();

  return (
    <div>
      <BatchColumns />
      <BatchSeparator />
      <BatchAsset />
      <BatchCsv />
      <BatchPreview />
    </div>
  );
}

export default BatchTx;
