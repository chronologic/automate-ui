import { useCallback, useEffect } from 'react';
import create from 'zustand';
import { parse as parseCsv } from 'csv-parse/dist/esm/sync';

import { IBatchColumnConfig, useBatchConfig } from './useBatchConfig';
import { BatchColumn } from './useBatchConfigStorage';
import { IAssetStorageItem } from '../../hooks';

export type ParsedTx = {
  [name in BatchColumn]?: IParsedColumn;
};

export interface IParsedColumn {
  type: BatchColumn;
  formattedValue: string;
  parsedValue: string;
}

interface IBatchParserState {
  rawInput: string;
  parsedTxs: ParsedTx[];
  isValid: boolean;
  error: string;
}

interface IBatchParserMethods {
  setRawInput: (rawInput: string) => void;
}

interface IBatchParserHook extends IBatchParserState, IBatchParserMethods {}

const defaultState: IBatchParserState = {
  rawInput: '',
  parsedTxs: [],
  isValid: false,
  error: '',
};

const useBatchParserStore = create<IBatchParserState>(() => defaultState);

const useBatchParser = (): IBatchParserHook => {
  const state = useBatchParserStore();
  const { columns, selectedColumns, selectedDelimiter, selectedAsset, isValidConfig } = useBatchConfig();

  const setRawInput = useCallback((rawInput: string) => useBatchParserStore.setState({ rawInput }), []);

  useEffect(() => {
    if (!isValidConfig || !state.rawInput) {
      return useBatchParserStore.setState({ isValid: false, parsedTxs: [], error: '' });
    }

    try {
      const parsedCsv: string[][] = parseCsv(state.rawInput, {
        delimiter: selectedDelimiter!.symbol,
      });

      const parsedTxs = parseTxs({ rows: parsedCsv, selectedColumns, selectedAsset: selectedAsset! });

      useBatchParserStore.setState({ isValid: true, parsedTxs, error: '' });
    } catch (e) {
      useBatchParserStore.setState({ isValid: false, parsedTxs: [], error: (e as any).message || 'Error' });
    }
  }, [columns, isValidConfig, selectedAsset, selectedColumns, selectedDelimiter, state.rawInput]);

  return {
    ...state,
    setRawInput,
  };
};

function parseTxs({
  rows,
  selectedColumns,
  selectedAsset,
}: {
  rows: string[][];
  selectedColumns: IBatchColumnConfig[];
  selectedAsset: IAssetStorageItem;
}): ParsedTx[] {
  const txs: ParsedTx[] = [];

  rows.forEach((row, rowIndex) => {
    if (row.length !== selectedColumns.length) {
      throw new Error(`Expected ${selectedColumns.length} columns in row ${rowIndex + 1}`);
    }

    const tx: ParsedTx = {};

    selectedColumns.forEach((col, colIndex) => {
      const formattedValue = row[colIndex];
      const parsedValue = col.parser(formattedValue, { asset: selectedAsset });

      tx[col.name] = {
        type: col.name,
        formattedValue,
        parsedValue,
      };
    });

    txs.push(tx);
  });

  return txs;
}

export { useBatchParser, useBatchParserStore };
