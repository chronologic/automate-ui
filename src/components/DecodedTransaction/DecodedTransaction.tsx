import { TextInput } from 'carbon-components-react';
import * as React from 'react';
import { IDecodedTransaction } from 'src/models';
import { bigNumberToString } from 'src/utils';

import DecodedAsset from '../Asset/DecodedAsset';
import Skeleton from '../Skeleton/Skeleton';

interface IDecodedTransactionView extends IDecodedTransaction {
  skeleton: boolean;
  assetName?: string;
}

class DecodedTransaction extends React.Component<IDecodedTransactionView, any> {
  public render() {
    if (this.props.skeleton && !this.props.signedSender) {
      return <Skeleton />;
    }

    const network = this.props.signedChain.chainId
      ? `${this.props.signedChain.chainName} [id: ${this.props.signedChain.chainId}]`
      : '';

    return (
      <div>
        <DecodedAsset {...this.props.signedAsset} />
        <div className="bx--row row-padding">
          <div className="bx--col-xs-12">
            <TextInput
              labelText="Transaction receiver"
              helperText="Recipient of the transaction or token recipient in case of ERC20 token transfer"
              disabled={true}
              value={this.props.signedRecipient}
            />
          </div>
        </div>
        <div className="bx--row row-padding">
          <div className="bx--col-xs-12">
            <TextInput
              labelText="Transaction nonce"
              helperText="Transaction will be executed only when Transaction nonce equals Sender nonce"
              disabled={true}
              value={
                isNaN(this.props.signedNonce) ? '' : this.props.signedNonce
              }
            />
          </div>
        </div>
        {this.props.assetName === 'Ethereum' && (
          <div className="bx--row row-padding">
            <div className="bx--col-xs-12">
              <TextInput
                labelText="Transaction gas price"
                helperText="Gas price for this transaction"
                disabled={true}
                value={
                  bigNumberToString(this.props.signedGasPrice, 9, 0) + ' Gwei'
                }
              />
            </div>
          </div>
        )}
        {this.props.assetName === 'Ethereum' && (
          <div className="bx--row row-padding">
            <div className="bx--col-xs-12">
              <TextInput
                labelText="Transaction gas limit"
                helperText="Gas limit for this transaction"
                disabled={true}
                value={bigNumberToString(this.props.signedGasLimit, 0, 0)}
              />
            </div>
          </div>
        )}
        <div className="bx--row row-padding">
          <div className="bx--col-xs-12">
            <TextInput
              labelText="Network"
              disabled={true}
              value={network}
              helperText="Name and id of the network from Signed Transaction"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default DecodedTransaction;
