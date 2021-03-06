import axios from 'axios';
import { ethers } from 'ethers';
import { BigNumber, Transaction } from 'ethers/utils';

import {
  AssetType,
  IAsset,
  IDecodedTransaction,
  IError,
  PolkadotChainId
} from 'src/models';
import PolkadotAPI from './PolkadotAPI';
import { TokenAPI } from './TokenAPI';

export enum Status {
  Pending,
  Cancelled,
  Completed,
  Error,
  StaleNonce,
  PendingConfirmations,
  PendingPayment,
  PendingPaymentConfirmations,
  PaymentExpired,
  Draft
}

export interface IScheduleRequest {
  assetType: AssetType;
  chainId?: PolkadotChainId;
  conditionAmount: string;
  conditionAsset: string;
  gasPriceAware: boolean;
  paymentEmail: string;
  paymentRefundAddress: string;
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
    IScheduleRequest {
  chainId: number;
  paymentAddress: string;
  paymentTx: string;
}

export interface IScheduleAccessKey {
  id: string;
  key: string;
  createdAt: string;
  paymentAddress: string;
}

export interface ICancelResponse {
  status: Status;
}

export interface IScheduledTransaction extends IScheduledTransactionRaw {
  assetType: AssetType;
  conditionalAsset: IAsset;
  timeCondition: number;
  timeConditionTZ: string;
  paymentAddress: string;
  paymentEmail: string;
  paymentRefundAddress: string;
  paymentTx: string;
  chainId?: number;
}

export interface IScheduledForUser {
  id: string;
  assetType: AssetType;
  signedTransaction: string;
  conditionAsset: string;
  conditionAmount: string;
  status: Status;
  statusName: string;
  transactionHash: string;
  error: string;
  from: string;
  nonce: number;
  chainId: number;
  conditionBlock: number;
  timeCondition: number;
  timeConditionTZ: string;
  gasPriceAware: boolean;
  executionAttempts: number;
  lastExecutionAttempt: string;
  assetName: string;
  assetAmount: number;
  assetValue: number;
  createdAt: string;
  executedAt: string;
  txKey: string;
  notes: string;
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
            response.data.signedTransaction,
            response.data.chainId
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
    assetType: AssetType,
    chainId?: PolkadotChainId
  ): Promise<IDecodedTransaction | IError> {
    let decodedTransaction: Transaction | undefined;

    try {
      switch (assetType) {
        case AssetType.Ethereum: {
          decodedTransaction = ethers.utils.parseTransaction(signedTransaction);
          break;
        }
        case AssetType.Polkadot: {
          return PolkadotAPI.parseTx(
            signedTransaction,
            chainId as PolkadotChainId
          );
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

    const chainName = ethers.utils.getNetwork(decodedTransaction.chainId).name;

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
        decodedTransaction.chainId
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
      baseAssetName: 'ETH',
      chainId: decodedTransaction.chainId,
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
      senderNonce = await this.getProvider(
        decodedTransaction.chainId
      ).getTransactionCount(signedSender);
      // tslint:disable-next-line:no-empty
    } catch (e) {}

    let senderBalance = new BigNumber(0);
    try {
      senderBalance = await this.getProvider(
        decodedTransaction.chainId
      ).getBalance(decodedTransaction.from!);
      // tslint:disable-next-line:no-empty
    } catch (e) {}

    const signedGasLimit = decodedTransaction.gasLimit;
    const signedGasPrice = decodedTransaction.gasPrice;
    const maxTxCost = signedGasPrice.mul(signedGasLimit);

    return {
      maxTxCost,
      senderBalance,
      senderNonce,
      signedAsset,
      signedChain,
      signedGasLimit,
      signedGasPrice,
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

  public static async getList(apiKey: string): Promise<IScheduledForUser[]> {
    const response = await axios.get(`${this.API_URL_LIST}?apiKey=${apiKey}`);

    const items = response.data.items as IScheduledForUser[];

    return items.map(i => {
      i.statusName = Status[i.status];

      return i;
    });
  }

  private static API_URL: string = process.env.REACT_APP_API_URL + '/scheduled';

  private static API_URL_LIST: string =
    process.env.REACT_APP_API_URL + '/scheduleds';

  private static getProvider(chainId: number) {
    return ethers.getDefaultProvider(ethers.utils.getNetwork(chainId));
  }
}
