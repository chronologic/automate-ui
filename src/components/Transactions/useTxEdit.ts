import create from 'zustand';
import { BigNumber } from 'ethers';

import { IScheduledForUser } from '../../types';
import { convertDecimals } from '../../utils';

interface ITxEditStoreState {
  editing: boolean;
  tx: IScheduledForUser | undefined;
}

export type UpdateTx = (partialTx: Partial<IScheduledForUser>) => void;

interface ITxEditStoreMethods {
  startEdit: (tx: IScheduledForUser) => void;
  stopEdit: () => void;
  updateTx: UpdateTx;
}

interface ITxEditHook extends ITxEditStoreState, ITxEditStoreMethods {}

const defaultState: ITxEditStoreState = {
  editing: false,
  tx: undefined,
};

const useTxEditStore = create<ITxEditStoreState>(() => defaultState);

function startEdit(tx: IScheduledForUser) {
  useTxEditStore.setState({
    editing: true,
    tx,
  });
}

function stopEdit() {
  useTxEditStore.setState(defaultState);
}

function updateTx(partial: Partial<IScheduledForUser>) {
  const { tx }: ITxEditStoreState = useTxEditStore.getState();

  const oldDecimals = tx?.conditionAssetDecimals || 18;
  const newDecimals = partial.conditionAssetDecimals || 18;

  if (newDecimals !== oldDecimals) {
    const newAmount = convertDecimals(
      BigNumber.from(partial.conditionAmount || tx?.conditionAmount || '0'),
      oldDecimals,
      newDecimals
    ).toString();

    partial.conditionAmount = newAmount;
  }

  useTxEditStore.setState({
    tx: {
      ...tx,
      ...partial,
    } as IScheduledForUser,
  });
}

const useTxEdit = (): ITxEditHook => {
  const state = useTxEditStore();

  return {
    ...state,
    startEdit,
    stopEdit,
    updateTx,
  };
};

function canEditTx(statusName: string): boolean {
  return ['Draft', 'Pending'].includes(statusName);
}

export { useTxEdit, useTxEditStore, canEditTx };
