import { Button, TextArea, Tile } from 'carbon-components-react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  IAsset,
  IDecodedTransaction,
  IError,
  IScheduleAccessKey,
  SentinelAPI
} from 'src/api/SentinelAPI';
import { TokenAPI } from 'src/api/TokenAPI';

import ConditionalAsset from '../Asset/ConditionalAsset';
import DecodedTransaction from '../DecodedTransaction/DecodedTransaction';
import SenderInformation from '../Sender/SenderInformation';

interface ISentinelState extends IDecodedTransaction {
  conditionalAsset?: IAsset;
  conditionalAssetIsValid: boolean;
  sentinelResponse?: IScheduleAccessKey | IError;
  signedTransaction: string;
  signedTransactionIsValid: boolean;
}

const defaultState = {
  conditionalAssetIsValid: true,
  senderNonce: 0,
  sentinelResponse: undefined,
  signedAsset: { address: '', decimals: 0, name: '', amount: '' },
  signedChain: { chainId: 0, chainName: '' },
  signedNonce: 0,
  signedRecipient: '',
  signedSender: '',
  signedTransaction: '',
  signedTransactionIsValid: true,
};

class Schedule extends React.Component<{}, ISentinelState> {
  constructor(props: any) {
    super(props);
    this.state = defaultState;
  }

  public render() {
    const send = this.send.bind(this);
    const decode = this.decode.bind(this);

    const emitConditional = (conditionalAsset: IAsset) => {
      this.setState({
        conditionalAsset
      });
    };

    const onValidationError = (error: string) => {
      this.setState({ conditionalAssetIsValid: !error });
    };

    const response = this.renderResponse();
    const success = this.state.sentinelResponse && (this.state.sentinelResponse as IScheduleAccessKey).id;

    return (
      <div>
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
        <div className="bx--row row-padding bx--type-gamma">Sender</div>
        <SenderInformation {...this.state} skeleton={false} />
        <div className="bx--row row-padding bx--type-gamma">
          Decoded Transaction
        </div>
        <DecodedTransaction {...this.state} skeleton={false} />
        <div className="bx--row row-padding bx--type-gamma">
          Conditional Parameters
        </div>
        <ConditionalAsset
          chainId={this.state.signedChain.chainId}
          disabled={this.state.signedTransaction === ''}
          onChange={emitConditional}
          onValidationError={onValidationError}
        />
        <div className="bx--row row-padding">
          <Button
            onClick={send}
            disabled={
              !this.state.conditionalAssetIsValid ||
              !this.state.signedTransactionIsValid ||
              !this.state.signedTransaction ||
              success
            }
          >
            Schedule
          </Button>
        </div>
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
      const reset = () => this.setState(defaultState);
      const response = this.state.sentinelResponse as IScheduleAccessKey;
      const link = `/view/${response.id}/${response.key}`;
      return (
        <Tile>
          You have successfully scheduled transaction ! <br />
          <br />
          Please save this link: <br />
          <Link to={link}>
            {window.location.href}
            {link}
          </Link>
          <br/><br/>
          <Button onClick={reset}>Schedule another one</Button>
        </Tile>
      );
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
        ...transaction,
        signedTransaction,
        signedTransactionIsValid: true
      });
    }
  }

  private async send() {
    const conditionalAsset =
      this.state.conditionalAsset && this.state.conditionalAsset.amount !== ''
        ? this.state.conditionalAsset
        : this.state.signedAsset;

    const conditionAmount = TokenAPI.withoutDecimals(
      conditionalAsset.amount,
      conditionalAsset.decimals
    ).toString();

    const payload = {
      conditionAmount,
      conditionAsset: conditionalAsset.address,
      signedTransaction: this.state.signedTransaction
    };

    const sentinelResponse = await SentinelAPI.schedule(payload);
    this.setState({ sentinelResponse });
  }
}

export default Schedule;
