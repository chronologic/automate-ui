import { BigNumber, ethers, utils } from 'ethers';
import { parseUrl } from 'query-string';
import Web3 from 'web3';

import ERC20ABI from './abi/ERC20.json';
import { ChainId, ethereum, MAGIC_ADDRESS, MAGIC_DECIMAL_UNIT } from './constants';

const web3 = new Web3(ethereum as any);
const magicContract = new web3.eth.Contract(ERC20ABI as any, MAGIC_ADDRESS);

const DEFAULT_USER_SOURCE = 'magic';
const USER_SOURCE_STORAGE_KEY = 'source';

export function bigNumberToString(num: BigNumber, decimals = 18, precision = 6): string {
  let str = (num || '').toString();
  let len = str.length;
  if (decimals > 0 && len < decimals + 1) {
    str = '0'.repeat(decimals - len + 1) + str;
    len = str.length;
  }
  if (precision > 0) {
    str = str.slice(0, len - decimals) + '.' + str.slice(-decimals);
    len = str.length;
  }
  str = str.slice(0, len + precision - decimals);

  return str;
}

export function bigNumberToNumber(num: BigNumber, decimals = 18, precision = 6): number {
  return +bigNumberToString(num, decimals, precision);
}

export function numberToBn(num: number, decimals = 18): BigNumber {
  let numStr = num.toString();
  const numDecimals = (numStr.split('.')[1] || '').length;

  if (numDecimals > decimals) {
    const decimalPointIndex = numStr.indexOf('.');
    numStr = numStr.substring(0, decimalPointIndex + decimals + 1);
  }

  return utils.parseUnits(`${numStr}`, decimals);
}

export function convertDecimals(bn: BigNumber, decimalsIn: number, decimalsOut = 18): BigNumber {
  const decimalsDiff = decimalsOut - decimalsIn;

  if (decimalsDiff > 0) {
    return BigNumber.from(bn.toString() + '0'.repeat(decimalsDiff));
  }
  if (decimalsDiff < 0) {
    const bnString = bn.toString();
    return BigNumber.from(bnString.substring(0, bnString.length + decimalsDiff) || '0');
  }

  return bn;
}

export function isTruthy(value: string): boolean {
  // eslint-disable-next-line eqeqeq
  return value === 'true' || value == '1';
}

export function shortAddress(address?: string | null | undefined, chars = 4): string {
  const prefix = (address || '').slice(0, 2);
  const id = (address || '').slice(prefix.length);
  return `${prefix}${shortId(id)}`;
}

export function shortId(id?: string | null | undefined, chars = 4): string {
  const _id = (id || '').toUpperCase();
  return `${_id.slice(0, chars - 1)}...${_id.slice(-chars)}`;
}

export function formatNumber(value: number, decimals = 4, fallbackValue = '-'): string {
  if (value) {
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    return formatter.format(value);
  }

  return fallbackValue;
}

export function formatCurrency(value: number, decimals = 2): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return formatter.format(value || 0);
}

export function calculatePercent(value: number, maxValue: number): number {
  return Math.round((value / maxValue) * 100);
}

export function isEmptyName(value?: string): boolean {
  return !value || value === '_' || value === '-';
}

export function hasNonDefaultUserSource(): boolean {
  return getUserSource() !== DEFAULT_USER_SOURCE;
}

export function getUserSource(): string {
  // let source = (localStorage.getItem(USER_SOURCE_STORAGE_KEY) as string) || DEFAULT_USER_SOURCE;
  let source = DEFAULT_USER_SOURCE;
  const parsed = parseUrl(window.location.href);

  if (parsed.query?.utm_source) {
    source = parsed.query.utm_source as string;
  }

  return setUserSource(source);
}

function setUserSource(name: string): string {
  localStorage.setItem(USER_SOURCE_STORAGE_KEY, name);

  return name;
}

export function capitalizeFirstLetter(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function isValidEthereumAddress(address: string): boolean {
  try {
    utils.getAddress(address);
    return true;
  } catch (e) {
    return false;
  }
}

export function ethereumAddressValidator(address: string): Promise<void> {
  return isValidEthereumAddress(address) ? Promise.resolve() : Promise.reject(new Error(`Invalid Ethereum address`));
}

export async function retryRpcCallOnIntermittentError<T>(fn: () => Promise<any>): Promise<T> {
  try {
    return await fn();
  } catch (e: any) {
    const intermittentRpcError = 'unsupported block number';
    const errorMessage = e?.message || '';
    if (errorMessage.includes(intermittentRpcError)) {
      await sleep(500);
      return await retryRpcCallOnIntermittentError(fn);
    } else {
      throw e;
    }
  }
}

export async function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function getProvider(chainId: ChainId): ethers.providers.BaseProvider {
  switch (chainId) {
    case ChainId.arbitrum: {
      return new ethers.providers.JsonRpcProvider('https://arb1.arbitrum.io/rpc');
    }
  }

  return ethers.getDefaultProvider(ethers.providers.getNetwork(chainId));
}

export async function validateAmount(amount: number, maxAvalible: number): Promise<void> {
  if (amount <= 0) {
    return Promise.reject(new Error('Amount should be greater than 0'));
  }
  if (amount > maxAvalible) {
    return Promise.reject(new Error('Amount cant be greater than total avalible Magic Tokens'));
  }
}

export async function contractApprove(
  spenderAddress: string,
  from: string,
  amount: number | BigNumber
): Promise<string[]> {
  const tx = magicContract.methods.approve(spenderAddress, amount).send({ from: from });
  return tx;
}

export async function contractBalanceOf(account: string): Promise<number[]> {
  const balanceWei = await magicContract.methods.balanceOf(account).call();
  const balanceEth = Number(web3.utils.fromWei(balanceWei, MAGIC_DECIMAL_UNIT));
  return [balanceWei, balanceEth];
}

export async function contractAllowance(from: string, to: string): Promise<number> {
  const balanceWei = await magicContract.methods.allowance(from, to).call();
  return balanceWei;
}

export async function contractTransferFrom(from: string, to: string, amount: number): Promise<string[]> {
  const tx = await magicContract.methods.transferFrom(from, to, numberToBn(amount)).send({ from: to });
  return tx;
}
