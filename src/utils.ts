// tslint:disable: no-console
import { BigNumber, parseUnits } from 'ethers/utils';

export function bigNumberToString(num: BigNumber, decimals = 18, precision = 6): string {
  let str = num.toString();
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

  return parseUnits(`${numStr}`, decimals);
}

export function formatLongId(id: string): string {
  return id.substring(0, 6) + '...' + id.substring(id.length - 4, id.length);
}
