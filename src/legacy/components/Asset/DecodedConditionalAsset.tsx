import * as React from 'react';

import { IAsset } from '../../../types';
import Asset from './Asset';

class DecodedConditionalAsset extends React.Component<IAsset, any> {
  public render() {
    return (
      <Asset
        {...this.props}
        amountLabel="Minimum balance of the Sender for conditional asset"
        disabled={true}
        label="Condition asset"
      />
    );
  }
}

export default DecodedConditionalAsset;
