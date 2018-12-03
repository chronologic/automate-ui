import { TextInput } from 'carbon-components-react';
import { ethers } from 'ethers';
import * as React from 'react';
import { IDecodedTransaction } from 'src/api/SentinelAPI';
import { TokenAPI } from 'src/api/TokenAPI';

import Asset from '../Asset/Asset';
import Skeleton from '../Skeleton/Skeleton';

interface IDecodedTransactionView extends IDecodedTransaction {
  skeleton: boolean;
}

class DecodedTransaction extends React.Component<IDecodedTransactionView, any> {
  public render() {
    if (this.props.skeleton && !this.props.signedSender) {
      return <Skeleton />;
    }

    const signedAmount = TokenAPI.withDecimals(
      this.props.signedAmount,
      this.props.signedAssetDecimals
    );

    const signedETHAmount = ethers.utils.formatEther(
      this.props.signedETHAmount
    );

    return (
      <div>
        <Asset
          label="Transaction asset"
          disabled={true}
          address={this.props.signedAsset}
          chainId={this.props.signedChainId}
          name={this.props.signedAssetName}
        />
        <div className="bx--row row-padding">
          <div className="bx--col-xs-6">
            <TextInput
              labelText="Transaction receiver"
              disabled={true}
              value={this.props.signedRecipient}
            />
          </div>
        </div>
        <div className="bx--row row-padding">
          <div className="bx--col-xs-6">
            <TextInput
              invalidText="Wrong input"
              labelText="Transaction amount"
              disabled={true}
              value={signedAmount}
            />
          </div>
        </div>
        <div className="bx--row row-padding">
          <div className="bx--col-xs-6">
            <TextInput
              invalidText="Wrong input"
              labelText="Transaction ETH amount"
              disabled={true}
              value={signedETHAmount}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default DecodedTransaction;
