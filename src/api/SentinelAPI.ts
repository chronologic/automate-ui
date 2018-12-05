import axios from 'axios';
import { ethers } from 'ethers';
import { Transaction } from 'ethers/utils';
import { TokenAPI } from './TokenAPI';

export enum Status {
  Pending,
  Cancelled,
  Completed
}

export interface IScheduleRequest {
  conditionAmount: string;
  conditionAsset: string;
  signedTransaction: string;
}

export interface IScheduleResponse extends IScheduleRequest {
  id: string;
  transactionHash: string;
  status: Status;
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

export interface IScheduledTransaction {
  conditionalAsset: IAsset;
  id: string;
  transactionHash: string;
  signedTransaction: string;
  status: Status;
}

export interface IAsset {
  address: string;
  amount: string;
  decimals: number;
  name: string;
}

export interface INetwork {
  chainId: number;
  chainName: string;
}

export interface IDecodedTransaction {
  signedAsset: IAsset;
  signedRecipient: string;
  signedSender: string;
  signedChain: INetwork;
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
        errors: e.response
          ? e.response.data.errors
          : ['API seems to be down :(']
      };
    }
  }

  public static async get(
    request: IScheduleAccessKey
  ): Promise<IScheduledTransaction | IError> {
    try {
      const response = await axios.get<IScheduleResponse>(this.API_URL, {
        params: request
      });
      const decodedTransaction = (await this.decode(
        response.data.signedTransaction
      )) as IDecodedTransaction;
      const conditionalAssetInfo = await TokenAPI.tokenInfo(
        response.data.conditionAsset,
        decodedTransaction.signedChain.chainId
      );
      const amount = TokenAPI.withDecimals(
        response.data.conditionAmount,
        conditionalAssetInfo.decimals
      );

      const conditionalAsset = {
        ...conditionalAssetInfo,
        address: response.data.conditionAsset,
        amount
      };

      return {
        ...response.data,
        conditionalAsset
      };
    } catch (e) {
      return {
        errors: e.response
          ? e.response.data.errors
          : ['API seems to be down :(']
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

    const chainId = decodedTransaction.chainId;
    const chainName = ethers.utils.getNetwork(chainId).name;

    let signedRecipient = decodedTransaction.to!;
    let signedAmount = TokenAPI.withDecimals(
      decodedTransaction.value.toString()
    );
    let signedAddress = '';
    let signedAssetName = 'ETH';
    let signedAssetDecimals = 18;

    try {
      const { name, decimals } = await TokenAPI.tokenInfo(
        signedRecipient,
        chainId
      );

      const callDataParameters = '0x' + decodedTransaction.data.substring(10);
      const params = ethers.utils.defaultAbiCoder.decode(
        ['address', 'uint256'],
        callDataParameters
      );

      signedAddress = decodedTransaction.to!;
      signedAssetName = name;
      signedAssetDecimals = decimals;
      signedRecipient = params[0];
      signedAmount = TokenAPI.withDecimals(params[1], decimals);
      // tslint:disable-next-line:no-empty
    } catch (e) {}

    const signedChain = {
      chainId,
      chainName
    };

    const signedAsset = {
      address: signedAddress,
      amount: signedAmount,
      decimals: signedAssetDecimals,
      name: signedAssetName
    };

    return {
      signedAsset,
      signedChain,
      signedRecipient,
      signedSender: decodedTransaction.from!
    };
  }

  public static async cancel(
    request: IScheduleAccessKey
  ): Promise<ICancelResponse | IError> {
    try {
      const response = await axios.delete(this.API_URL, { params: request });
      return response.data as ICancelResponse;
    } catch (e) {
      return {
        errors: e.response
          ? e.response.data.errors
          : ['API seems to be down :(']
      };
    }
  }

  private static API_URL: string = process.env.REACT_APP_API_URL + '/scheduled';
}
