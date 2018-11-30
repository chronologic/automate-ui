import {
  Button,
  Form,
  TextArea,
  TextInput,
  Tile
} from 'carbon-components-react';
import { ethers } from 'ethers';
import { BigNumber } from 'ethers/utils';
import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  IDecodedTransaction,
  IError,
  IScheduleAccessKey,
  SentinelAPI
} from 'src/api/SentinelAPI';
import { TokenAPI } from 'src/api/TokenAPI';

import DecodedTransaction from '../DecodedTransaction/DecodedTransaction';

interface ISentinelState extends IDecodedTransaction {
  conditionAssetAmount: string;
  conditionAsset: string;
  conditionAssetDecimals: number;
  conditionAssetName: string;
  conditionAssetValidationError: string;
  sentinelResponse: IScheduleAccessKey | IError | undefined;
  signedTransaction: string;
  signedTransactionIsValid: boolean;
}

class Schedule extends React.Component<{}, ISentinelState> {
  constructor(props: any) {
    super(props);
    this.state = {
      conditionAsset: '',
      conditionAssetAmount: '',
      conditionAssetDecimals: 1,
      conditionAssetName: '',
      conditionAssetValidationError: '',
      sentinelResponse: undefined,
      signedAmount: '',
      signedAsset: '',
      signedAssetDecimals: 1,
      signedAssetName: '',
      signedChainId: 0,
      signedRecipient: '',
      signedSender: '',
      signedTransaction: '',
      signedTransactionIsValid: true
    };
  }

  public render() {
    const send = this.send.bind(this);
    const decode = this.decode.bind(this);
    const resolveToken = this.resolveToken.bind(this);
    const parseConditionalAssetAmount = this.parseConditionalAssetAmount.bind(this);

    const conditionAssetAmount = TokenAPI.withDecimals(
      this.state.conditionAssetAmount,
      this.state.conditionAssetDecimals
    ).toString();
 
    const response = this.renderResponse();

    return (
      <div>
        <Form>
          <div className="bx--row row-padding">
            <div className="bx--col-xs-6">
              <TextArea
                id="SignedTx"
                labelText="Signed transaction"
                rows={7}
                value={this.state.signedTransaction}
                // tslint:disable-next-line:jsx-no-lambda
                onChange={(e: any) => decode(e.target.value)}
                invalid={!this.state.signedTransactionIsValid}
                invalidText="Signed transaction is invalid"
              />
            </div>
          </div>
          <div className="bx--row row-padding bx--type-gamma">
            Decoded Transaction
          </div>
          <DecodedTransaction {...this.state} skeleton={false} />
          <div className="bx--row row-padding bx--type-gamma">
            Conditional Parameters
          </div>
          <div className="bx--row row-padding">
            <div className="bx--col-xs-6">
              <TextInput
                id="ConditionalAsset"
                labelText="Conditional asset"
                value={this.state.conditionAsset}
                // tslint:disable-next-line:jsx-no-lambda
                onChange={(e: any) => resolveToken(e.target.value)}
                disabled={this.state.signedTransaction === ''}
                invalid={this.state.conditionAssetValidationError !== ''}
                invalidText={this.state.conditionAssetValidationError}
              />
            </div>
            <div className="bx--col-xs-2">
              <TextInput
                id="ConditionalAssetName"
                className="bx--col-xs-6"
                labelText="Asset name"
                value={this.state.conditionAssetName}
                disabled={true}
              />
            </div>
          </div>
          <div className="bx--row row-padding">
            <div className="bx--col-xs-6">
              <TextInput
                id="ConditionalAssetAmount"
                labelText="Conditional asset amount (transfer when balance >= condition) [transaction amount when empty]"
                value={conditionAssetAmount}
                // tslint:disable-next-line:jsx-no-lambda
                onChange={(e: any) =>
                  parseConditionalAssetAmount(e.target.value)
                }
                disabled={this.state.conditionAsset === '' || this.state.conditionAssetValidationError !== ''}
              />
            </div>
          </div>
          <div className="bx--row row-padding">
            <Button onClick={send}>Schedule</Button>
          </div>
        </Form>
        {response}
      </div>
    );
  }

  private renderResponse() {
    if (!this.state.sentinelResponse) {
      return <div />;
    } else if ((this.state.sentinelResponse as any).errors) {
      const error = this.state.sentinelResponse as IError;
      return <Tile>{error.errors.join('\n')}</Tile>;
    } else {
      const response = this.state.sentinelResponse as IScheduleAccessKey;
      const link = `/view/${response.id}/${response.key}`;
      return (
        <Tile>
          <Link to={link}>
            ${window.location.href}
            {link}
          </Link>
        </Tile>
      );
    }
  }

  private async parseConditionalAssetAmount(amount: string) {
    try {
      const parsed = TokenAPI.withoutDecimals(amount, this.state.conditionAssetDecimals);

      if (parsed.gte(0)) {
        this.setState({conditionAssetAmount: parsed.toString()})
      } 
    // tslint:disable-next-line:no-empty
    } catch(e) {

    }
  }

  private async resolveToken(asset: string) {
    try {
      ethers.utils.getAddress(asset);
    } catch (e) {
      this.setState({
        conditionAsset: asset,
        conditionAssetValidationError: 'Wrong asset address'
      });
      return;
    }

    try {
      const { name, decimals } = await TokenAPI.tokenInfo(
        asset,
        this.state.signedChainId
      );
      this.setState({
        conditionAsset: asset,
        conditionAssetDecimals: decimals,
        conditionAssetName: name,
        conditionAssetValidationError: ''
      });
    } catch (e) {
      this.setState({
        conditionAsset: asset,
        conditionAssetValidationError: 'Asset is not ERC-20 compatible'
      });
    }
  }

  private async decode(signedTransaction: string) {
    const scheduledTransaction = await SentinelAPI.decode(signedTransaction);
    if ((scheduledTransaction as any).errors) {
      this.setState({
        signedTransaction,
        signedTransactionIsValid: false
      });
    } else {
      const transaction = scheduledTransaction as IDecodedTransaction;
      this.setState({
        // conditionAsset: transaction.signedAsset,
        // conditionAssetAmount: transaction.signedAmount,
        // conditionAssetDecimals: transaction.signedAssetDecimals,
        // conditionAssetName: transaction.signedAssetName,
        signedAmount: transaction.signedAmount,
        signedAsset: transaction.signedAsset,
        signedAssetDecimals: transaction.signedAssetDecimals,
        signedAssetName: transaction.signedAssetName,
        signedChainId: transaction.signedChainId,
        signedRecipient: transaction.signedRecipient,
        signedSender: transaction.signedSender,
        signedTransaction,
        signedTransactionIsValid: true
      });
    }
  }

  private async send() {
    const dec = new BigNumber(10).pow(this.state.conditionAssetDecimals);
    const conditionAmount =
      this.state.conditionAssetAmount !== ''
        ? new BigNumber(this.state.conditionAssetAmount).mul(dec).toString()
        : this.state.signedAmount;

    const payload = {
      conditionAmount,
      conditionAsset: this.state.conditionAsset,
      signedTransaction: this.state.signedTransaction
    };

    const sentinelResponse = await SentinelAPI.schedule(payload);
    this.setState({ sentinelResponse });
  }
}

export default Schedule;
