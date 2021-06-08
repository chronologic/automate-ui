import * as React from 'react';

import { IAsset } from '../../../types';
import Asset from './Asset';

class DecodedAsset extends React.Component<IAsset, any> {
  public render() {
    return <Asset {...this.props} amountLabel="Transaction asset amount" disabled={true} label="Transaction asset" />;
  }
}

export default DecodedAsset;
