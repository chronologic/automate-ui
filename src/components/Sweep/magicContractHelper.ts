import Web3 from 'web3';
import { BigNumber } from 'ethers';

import ERC20ABI from '../../abi/ERC20.json';
import { numberToBn } from '../../utils';
import { ethereum, MAGIC_ADDRESS, MAGIC_DECIMAL_UNIT } from '../../constants';

const web3 = new Web3(ethereum as any);
const magicContract = new web3.eth.Contract(ERC20ABI as any, MAGIC_ADDRESS);

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
