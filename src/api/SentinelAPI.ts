import axios from 'axios';
import { ethers } from 'ethers';
import { Transaction } from 'ethers/utils';
import { TokenAPI } from './TokenAPI';

export enum Status {
  Pending, Cancelled, Completed
}

export interface IScheduleRequest {
  conditionAmount: string;
  conditionAsset: string;
  signedTransaction: string;
}

export interface IScheduleAccessKey {
  id: string;
  key: string;
}

export interface IError {
  errors: string[];
}

export interface ICancelResponse {
  status: Status;
}

export interface IScheduledTransaction extends IScheduleRequest {
  id: string;
  transactionHash: string;
  status: Status;
}

export interface IDecodedTransaction {
  signedAsset: string;
  signedRecipient: string;
  signedAmount: string;
  signedAssetDecimals: number;
  signedAssetName: string;
  signedETHAmount: string;
  signedSender: string;
  signedChainId: number;
}

export class SentinelAPI {
  public static async schedule(
    request: IScheduleRequest
  ): Promise<IScheduleAccessKey | IError> {
    try {
      const response = await axios.post(this.API_URL, request);
      return response.data as IScheduleAccessKey;
    } catch (e) {
      return {
        errors: e.response ? e.response.data.errors : ['API seems to be down :(']
      };
    }
  }

  public static async get(
    request: IScheduleAccessKey
  ): Promise<IScheduledTransaction | IError> {
    try {
      const response = await axios.get(this.API_URL, { params: request });
      return response.data as IScheduledTransaction;
    } catch (e) {
      return {
        errors: e.response ? e.response.data.errors : ['API seems to be down :(']
      };
    }
  }

  public static async decode(
    signedTransaction: string
  ): Promise<IDecodedTransaction | IError> {
    let decodedTransaction: Transaction | undefined;

    try {
      decodedTransaction = ethers.utils.parseTransaction(signedTransaction);
      // tslint:disable-next-line:no-empty
    } catch (e) {
      return { errors: ['Unable to decode signed transaction'] } as IError;
    }
    
    const signedChainId = decodedTransaction.chainId;
    let signedRecipient = decodedTransaction.to!;
    const signedETHAmount = decodedTransaction.value.toString();
    let signedAmount = '';
    let signedAsset = '';
    let signedAssetName = 'ETH';
    let signedAssetDecimals = 0;
    
    try {
      const { name, decimals } = await TokenAPI.tokenInfo(
        signedRecipient,
        signedChainId
      );

      const callDataParameters = '0x' + decodedTransaction.data.substring(10);
      const params = ethers.utils.defaultAbiCoder.decode(
        ['address', 'uint256'],
        callDataParameters
      );

      signedAsset = decodedTransaction.to!;
      signedAssetName = name;
      signedAssetDecimals = decimals;
      signedRecipient = params[0];
      signedAmount = params[1];
    // tslint:disable-next-line:no-empty
    } catch(e) {

    }

    return {
      signedAmount,
      signedAsset,
      signedAssetDecimals,
      signedAssetName,
      signedChainId,
      signedETHAmount,
      signedRecipient,
      signedSender: decodedTransaction.from!
    };
  }

  public static async cancel(request: IScheduleAccessKey) : Promise<ICancelResponse | IError> {
    try {
      const response = await axios.delete(this.API_URL, { params: request });
      return response.data as ICancelResponse;
    } catch (e) {
      return {
        errors: e.response ? e.response.data.errors : ['API seems to be down :(']
      };
    }
  }

  private static API_URL: string = process.env.REACT_APP_API_URL + '/scheduled';
}
