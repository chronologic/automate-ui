import './App.css';

import axios from 'axios';
import {
  Button,
  Form,
  TextArea,
  TextInput,
  Tile
} from 'carbon-components-react';
import { ethers } from 'ethers';
import { BigNumber, Transaction } from 'ethers/utils';
import * as React from 'react';

import { ERC20 } from './erc20';

// import * as Bb from 'bluebird';
declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    ethereum: any;
    web3: any;
  }
}

interface ISentinelState {
  conditionAmount: string;
  conditionAsset: string;
  conditionAssetDecimals: number;
  conditionAssetName: string;
  sentinelResponse: string;
  signedRecipient: string;
  signedAmount: string;
  signedAsset: string;
  signedAssetDecimals: number;
  signedAssetName: string;
  signedChainId: number;
  signedSender: string;
  signedTransaction: string;
  signedTransactionIsValid: boolean;
}

const API_URL = process.env.REACT_APP_API_URL + '/scheduled';

class App extends React.Component<{}, ISentinelState> {
  constructor(props: any) {
    super(props);
    this.state = {
      conditionAmount: '',
      conditionAsset: '',
      conditionAssetDecimals: 1,
      conditionAssetName: '',
      sentinelResponse: '',
      signedAmount: '',
      signedAsset: '',
      signedAssetDecimals: 1,
      signedAssetName: '',
      signedChainId: 1,
      signedRecipient: '',
      signedSender: '',
      signedTransaction: '',
      signedTransactionIsValid: true
    };
  }

  public render() {
    const send = this.send.bind(this);
    const decode = this.decode.bind(this);
    const setDefaults = this.setDefaults.bind(this);

    const conditionalAsset = `${this.state.conditionAsset} [ERC-20: ${
      this.state.conditionAssetName
    }]`;

    const signedAsset = `${this.state.signedAsset} [ERC-20: ${
      this.state.signedAssetName
    }]`;

    const dec = new BigNumber(10).pow(this.state.signedAssetDecimals);
    const signedAmount = new BigNumber(this.state.signedAmount).div(dec);

    const tile =
      this.state.sentinelResponse !== '' ? (
        <Tile>Sentinel {this.state.sentinelResponse} has been created</Tile>
      ) : (
        ''
      );

    const icon = (
      <svg width="21" height="24" viewBox="0 0 21 24">
        <path d="M9.5 1c.9 0 1.5.7 1.5 1.5S10.4 4 9.5 4C8.7 4 8 3.3 8 2.5S8.7 1 9.5 1zm0-1C8.2 0 7 1.1 7 2.5S8.2 5 9.5 5 12 3.9 12 2.5 10.9 0 9.5 0zM17 4l-3 1.7v2.4L10.3 6 5 9v3.6l-2-1.1-3 1.7v3.5l3 1.7 3-1.7v-1.1l4.5 2.4 5-3v-4.9l1.5.9 3-1.7V5.8L17 4zm-6.7 3.2l3.8 2.1-3.5 1.8-4-1.8 3.7-2.1zM5 16.1l-2 1.2-2-1.1v-2.3l2-1.2 2 1.1v2.3zm1-5.9l4 1.8v4.6l-4-2.2v-4.2zm5 6.3V12l3.5-1.8v4.2L11 16.5zm8-7.8l-2 1.2-2-1.2V6.3l2-1.2 2 1.2v2.4zM2.5 4C3.4 4 4 4.7 4 5.5S3.4 7 2.5 7 1 6.3 1 5.5 1.7 4 2.5 4zm0-1C1.1 3 0 4.1 0 5.5S1.1 8 2.5 8 5 6.9 5 5.5 3.9 3 2.5 3zm9 17c.8 0 1.5.7 1.5 1.5s-.6 1.5-1.5 1.5-1.5-.7-1.5-1.5.7-1.5 1.5-1.5zm0-1C10.1 19 9 20.1 9 21.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.1-2.5-2.5-2.5zm7-3c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5.7-1.5 1.5-1.5zm0-1c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.1-2.5-2.5-2.5z" />
      </svg>
    );

    return (
      <div className="bx--grid">
        <div className="bx--type-alpha bx--row">Sentinel {icon}</div>
        <div className="bx--row space" />
        <Form>
          <div className="bx--row row-padding">
            <TextArea
              id="SignedTx"
              className="bx--col-xs-6"
              labelText="Signed transaction"
              rows={10}
              value={this.state.signedTransaction}
              // tslint:disable-next-line:jsx-no-lambda
              onChange={(e: any) => decode(e.target.value)}
              invalid={!this.state.signedTransactionIsValid}
              invalidText="Signed transaction is invalid"
            />
          </div>
          <div className="bx--row row-padding">
            <TextInput
              className="bx--col-xs-6"
              labelText="Transaction asset"
              disabled={true}
              value={signedAsset}
            />
          </div>
          <div className="bx--row row-padding">
            <TextInput
              className="bx--col-xs-6"
              labelText="Transaction receiver"
              disabled={true}
              value={this.state.signedRecipient}
            />
          </div>
          <div className="bx--row row-padding">
            <TextInput
              className="bx--col-xs-6"
              invalidText="Wrong input"
              labelText="Transaction amount"
              disabled={true}
              value={signedAmount}
            />
          </div>
          <div className="bx--row row-padding">
            <TextInput
              className="bx--col-xs-6"
              labelText="Conditional asset"
              disabled={true}
              value={conditionalAsset}
            />
          </div>
          <div className="bx--row row-padding">
            <TextInput
              className="bx--col-xs-6"
              labelText="Conditional asset amount (transfer when balance >= condition) [transaction amount when empty]"
              value={this.state.conditionAmount}
              required={true}
              // tslint:disable-next-line:jsx-no-lambda
              onChange={(e: any) =>
                this.setState({ conditionAmount: e.target.value })
              }
            />
          </div>
          <div className="bx--row row-padding">
            <div className="row-padding">
              <Button onClick={setDefaults}>Set default values</Button>
            </div>
            <div className="row-padding">
              <Button onClick={send}>Send</Button>
            </div>
          </div>
        </Form>
        <div>{tile}</div>
      </div>
    );
  }

  private setDefaults() {
    const signedTransaction =
      '0xf8aa40851176592e00830249f0945a6b5c6387196bd4ea264f627792af9d0909687680b844a9059cbb00000000000000000000000089174a102f1adba064db5324198902b2ee7952eb00000000000000000000000000000000000000000000021e19e0c9bab240000078a0513127dad26662eb8697c1ab0fc3ce17595ffbf557f2c54e8558ae1df3acbb35a03c410210d001b7cf2ab558eb74af34c84b1f1c281c710bcf7041728fd32bedac';

    this.setState({
      signedTransaction
    });

    this.decode(signedTransaction);
  }

  private async decode(signedTransaction: string) {
    let decodedTransaction: Transaction | undefined;

    try {
      decodedTransaction = ethers.utils.parseTransaction(signedTransaction);
      // tslint:disable-next-line:no-empty
    } catch (e) {}

    if (!decodedTransaction) {
      this.setState({
        signedTransaction,
        signedTransactionIsValid: !!decodedTransaction
      });
    } else {
      const signedAsset = decodedTransaction.to!;
      const signedChainId = decodedTransaction.chainId;
      const { name, decimals } = await this.readTokenInfo(
        signedAsset,
        signedChainId
      );
      const callDataParameters = '0x' + decodedTransaction.data.substring(10);
      const params = ethers.utils.defaultAbiCoder.decode(
        ['address', 'uint256'],
        callDataParameters
      );
      const signedRecipient = params[0];
      const signedAmount = params[1];

      this.setState({
        conditionAsset: signedAsset,
        conditionAssetDecimals: decimals,
        conditionAssetName: name,
        signedAmount,
        signedAsset,
        signedAssetDecimals: decimals,
        signedAssetName: name,
        signedChainId,
        signedRecipient,
        signedSender: decodedTransaction.from!,
        signedTransaction,
        signedTransactionIsValid: true
      });
    }
  }

  private async readTokenInfo(asset: string, chainId: number) {
    const token = new ethers.Contract(
      asset,
      ERC20,
      ethers.getDefaultProvider(ethers.utils.getNetwork(chainId))
    );
    const name = await token.name();
    const decimals = await token.decimals();

    return { name, decimals };
  }

  private async send() {
    const dec = new BigNumber(10).pow(this.state.conditionAssetDecimals);
    const conditionAmount =
      this.state.conditionAmount !== ''
        ? new BigNumber(this.state.conditionAmount).mul(dec).toString()
        : this.state.signedAmount;

    const payload = {
      conditionAmount,
      conditionAsset: this.state.conditionAsset,
      signedTransaction: this.state.signedTransaction
    };

    const response = await axios.post(
      API_URL,
      payload
    );
    if (response.data._id) {
      this.setState({ sentinelResponse: response.data._id });
    }
  }
}

export default App;
