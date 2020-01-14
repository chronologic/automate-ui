import axios from 'axios';
import { ethers } from 'ethers';
import { Transaction } from 'ethers/utils';

import { AssetType, IAsset, IDecodedTransaction, IError } from 'src/models';
import PolkadotAPI from './PolkadotAPI';
import { TokenAPI } from './TokenAPI';

export enum Status {
  Pending,
  Cancelled,
  Completed,
  Error
}

export interface IScheduleRequest {
  assetType: AssetType;
  conditionAmount: string;
  conditionAsset: string;
  signedTransaction: string;
  timeCondition: number;
  timeConditionTZ: string;
}

interface IScheduledTransactionRaw {
  id: string;
  error: string;
  signedTransaction: string;
  status: Status;
  transactionHash?: string;
}

export interface IScheduleResponse
  extends IScheduledTransactionRaw,
    IScheduleRequest {}

export interface IScheduleAccessKey {
  id: string;
  key: string;
}

export interface ICancelResponse {
  status: Status;
}

export interface IScheduledTransaction extends IScheduledTransactionRaw {
  assetType: AssetType;
  conditionalAsset: IAsset;
  timeCondition: number;
  timeConditionTZ: string;
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
      switch (response.data.assetType) {
        case AssetType.Ethereum: {
          const decodedTransaction = (await this.decode(
            response.data.signedTransaction,
            AssetType.Ethereum
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
        }
        case AssetType.Polkadot: {
          const parsed = await PolkadotAPI.parseTx(
            response.data.signedTransaction
          );

          return {
            ...response.data,
            ...parsed
          } as any;
        }
      }
    } catch (e) {
      return {
        errors: e.response
          ? e.response.data.errors
          : ['API seems to be down :(']
      };
    }
  }

  public static async decode(
    signedTransaction: string,
    assetType: AssetType
  ): Promise<IDecodedTransaction | IError> {
    let decodedTransaction: Transaction | undefined;

    try {
      switch (assetType) {
        case AssetType.Ethereum: {
          decodedTransaction = ethers.utils.parseTransaction(signedTransaction);
          break;
        }
        case AssetType.Polkadot: {
          return PolkadotAPI.parseTx(signedTransaction);
          // const parsed = (await PolkadotAPI.parseTx(
          //   signedTransaction
          // )) as IDecodedTransaction;
          // decodedTransaction = {
          //   chainId: parsed.signedChain.chainId,
          //   data: signedTransaction,
          //   from: parsed.signedSender,
          //   gasLimit: new BigNumber('0'),
          //   gasPrice: new BigNumber('0'),
          //   hash: parsed.hash,
          //   nonce: parsed.senderNonce,
          //   to: parsed.signedRecipient,
          //   value: new BigNumber(parsed.signedAsset.amount)
          // };
          // break;
        }
      }
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
    const signedNonce = decodedTransaction.nonce;

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

    const signedSender = decodedTransaction.from!;

    let senderNonce = NaN;
    try {
      senderNonce = await this.getProvider(chainId).getTransactionCount(
        signedSender
      );
      // tslint:disable-next-line:no-empty
    } catch (e) {}

    return {
      senderNonce,
      signedAsset,
      signedChain,
      signedNonce,
      signedRecipient,
      signedSender
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

  private static getProvider(chainId: number) {
    return ethers.getDefaultProvider(ethers.utils.getNetwork(chainId));
  }
}
