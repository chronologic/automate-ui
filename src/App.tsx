import './App.css';

import { Button, Form, NumberInput, TextArea, TextInput } from 'carbon-components-react';
import { ethers } from 'ethers';
import * as React from 'react';

// import * as Bb from 'bluebird';
declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    ethereum: any;
    web3: any;
  }
}

interface ISentinelState {
  asset: string;
  recipient: string;
  amount: number;
  tokenCondition: number;
  signedTransaction: string;
  signedTransactionIsValid: boolean;
  decodedTransaction: string;
  debug: string;
}

class App extends React.Component<{}, ISentinelState> {
  constructor(props: any) {
    super(props);
    this.state = {
      amount: 10 * 10 ** 18,
      asset: '0x5a6B5c6387196bd4eA264f627792Af9d09096876',
      debug: '',
      decodedTransaction: '',
      recipient: '0x59148f32ed5093C9a844CFe1A8dA6D4B4206c5a2',
      signedTransaction: '0xf8aa40851176592e00830249f0945a6b5c6387196bd4ea264f627792af9d0909687680b844a9059cbb00000000000000000000000089174a102f1adba064db5324198902b2ee7952eb00000000000000000000000000000000000000000000021e19e0c9bab240000078a0513127dad26662eb8697c1ab0fc3ce17595ffbf557f2c54e8558ae1df3acbb35a03c410210d001b7cf2ab558eb74af34c84b1f1c281c710bcf7041728fd32bedac',
      signedTransactionIsValid: true,
      tokenCondition: 100
    };
  }

  public render() {
    const send = this.send.bind(this);
    const decode = this.decode.bind(this);

    return (
      <div className="bx--grid">
        <div className="bx--type-alpha bx--row">Sentinel</div>
        <div className="bx--row space" />
        <Form>
          <div className="bx--row row-padding">
            <TextArea
              id="SignedTx"
              className="bx--col-xs-6"
              labelText="Signed transaction"
              rows={10}
              value={this.state.signedTransaction}
              onChange={decode}
              invalid={!this.state.signedTransactionIsValid}
              invalidText="Signed transaction is invalid"
            />
            <TextArea
              id="DecodedTx"
              className="bx--col-xs-6"
              labelText="Decoded transaction"
              rows="10"
              value={this.state.decodedTransaction}
            />
          </div>
          <div className="bx--row row-padding">
            <TextInput
              className="bx--col-xs-6"
              labelText="Token address"
              value={this.state.asset}
              // tslint:disable-next-line:jsx-no-lambda
              onChange={(e: any) => {this.setState({asset: e.target.value})}}
            />
          </div>
          <div className="bx--row row-padding">
            <div className="bx--col-xs-6">
              <NumberInput
                invalidText="Wrong input"
                label="Amount"
                min="0"
                value={this.state.amount}
                // tslint:disable-next-line:jsx-no-lambda
                onChange={(e: any) => {this.setState({amount: e.target.value})}}
              />
            </div>
          </div>
          <div className="bx--row row-padding">
            <div className="bx--col-xs-6">
              <TextInput
                invalidText="Wrong input"
                labelText="Recipient"
                value={this.state.recipient}
                // tslint:disable-next-line:jsx-no-lambda
                onChange={(e: any) => {this.setState({recipient: e.target.value})}}
              />
            </div>
          </div>
          <div className="bx--row row-padding">
            <div className="bx--col-xs-6">
              <NumberInput
                invalidText="Wrong input"
                label="Transfer when amount is greater than"
                value={this.state.tokenCondition}
                // tslint:disable-next-line:jsx-no-lambda
                onChange={(e: any) => {this.setState({tokenCondition: e.target.value})}}
              />
            </div>
          </div>
          <div className="bx--row row-padding">
            <Button onClick={send}>Send</Button>
          </div>
          <div>{this.state.debug}</div>
        </Form>
      </div>
    );
  }

  private decode(e: any) {
    const signedTransaction = e.target.value;
    let signedTransactionIsValid = true;
    let decodedTransaction = '';

    try {
      decodedTransaction = JSON.stringify(ethers.utils.parseTransaction(signedTransaction));
    } catch(e) {
      signedTransactionIsValid = false;
    } 
    
    this.setState({ decodedTransaction, signedTransaction, signedTransactionIsValid });
  }

  private async send() {
    const parsed = ethers.utils.parseTransaction(this.state.signedTransaction);

    this.setState({ debug: JSON.stringify(parsed) });
  }
}

export default App;
