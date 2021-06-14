import { BigNumber, utils } from 'ethers';

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

  return utils.parseUnits(`${numStr}`, decimals);
}

export function formatLongId(id: string): string {
  return id.substring(0, 6) + '...' + id.substring(id.length - 4, id.length);
}

export function normalizeBigNumber(bn: BigNumber, decimalsIn: number, decimalsOut = 18): BigNumber {
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

export function shortAddress(address?: string | null | undefined): string {
  const addr = (address || '').toUpperCase();
  return `0x${addr.substr(2, 4)}...${addr.substr(-4)}`;
}

export function formatNumber(value: number, decimals = 4): string {
  if (value) {
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    return formatter.format(value);
  }

  return '-';
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
