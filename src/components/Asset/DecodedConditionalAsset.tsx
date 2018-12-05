import * as React from 'react';
import { IAsset } from 'src/api/SentinelAPI';

import Asset from './Asset';

class DecodedConditionalAsset extends React.Component<IAsset, any> {
  public render() {
    return (
      <Asset
        {...this.props}
        amountLabel="Condition asset amount"
        disabled={true}
        label="Condition asset"
      />
    );
  }
}

export default DecodedConditionalAsset;
