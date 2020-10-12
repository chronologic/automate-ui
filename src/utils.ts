// tslint:disable: no-console
import { BigNumber } from 'ethers/utils';

export function bigNumberToString(
  num: BigNumber,
  decimals = 18,
  precision = 6
): string {
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
  console.log(str);
  str = str.slice(0, len + precision - decimals);
  console.log(str);

  return str;
}

export function bigNumberToNumber(
  num: BigNumber,
  decimals = 18,
  precision = 6
): number {
  return +bigNumberToString(num, decimals, precision);
}
