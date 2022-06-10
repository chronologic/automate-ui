import { useCallback, useEffect } from 'react';
import create from 'zustand';
import { parse as parseCsv } from 'csv-parse/dist/esm/sync';
import debounce from 'lodash/debounce';
import { notification } from 'antd';

import { IAssetStorageItem } from '../../hooks';
import { IBatchColumnConfig, useBatchConfig } from './useBatchConfig';
import { BatchColumn } from './useBatchConfigStorage';

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
}

interface IBatchParserMethods {
  setRawInput: (rawInput: string) => void;
}

interface IBatchParserHook extends IBatchParserState, IBatchParserMethods {}

const debouncedErrorNotification = debounce(notification.error, 200);

const defaultState: IBatchParserState = {
  rawInput: '',
  parsedTxs: [],
  isValid: false,
};

const useBatchParserStore = create<IBatchParserState>(() => defaultState);

const useBatchParser = (): IBatchParserHook => {
  const state = useBatchParserStore();
  const { columns, selectedColumns, selectedDelimiter, selectedAsset, isValidConfig } = useBatchConfig();

  const setRawInput = useCallback((rawInput: string) => useBatchParserStore.setState({ rawInput }), []);

  useEffect(() => {
    if (!isValidConfig || !state.rawInput) {
      return useBatchParserStore.setState({ isValid: false, parsedTxs: [] });
    }

    try {
      const parsedCsv: string[][] = parseCsv(state.rawInput, {
        delimiter: selectedDelimiter!.symbol,
      });
      const parsedTxs = parseTxs({ rows: parsedCsv, selectedColumns, selectedAsset: selectedAsset! });

      useBatchParserStore.setState({ isValid: true, parsedTxs });
    } catch (e) {
      console.error(e);
      useBatchParserStore.setState({ isValid: false, parsedTxs: [] });
      const error = (e as any)?.message || 'Error';
      debouncedErrorNotification({ message: error });
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
      throw new Error(`Expected ${selectedColumns.length} columns in row ${rowIndex + 1}, got ${row.length}`);
    }

    const tx: ParsedTx = {};

    selectedColumns.forEach((col, colIndex) => {
      const formattedValue = row[colIndex].split(',').join('');
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
