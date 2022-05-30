import { useMemo } from 'react';
import { Table } from 'antd';
import styled from 'styled-components';

import { IScheduledForUser } from '../../types';
import { IAssetStorageItem } from '../../hooks';
import * as cols from './tableColumns';

interface IProps {
  items: IScheduledForUser[];
  loading: boolean;
  assetOptions: IAssetStorageItem[];
  editingItem: IScheduledForUser | undefined;
  onStartEdit: (tx: IScheduledForUser) => void;
  onStopEdit: () => void;
  onUpdateEditingItem: (partial: Partial<IScheduledForUser>) => void;
  onSave: () => void;
  onCancelTx: (record: IScheduledForUser) => void;
  onOpenAddAssetModal: () => void;
}

function TransactionTableWide({
  items,
  loading,
  assetOptions,
  editingItem,
  onStartEdit,
  onStopEdit,
  onUpdateEditingItem,
  onSave,
  onCancelTx,
  onOpenAddAssetModal,
}: IProps) {
  const columns = useMemo(() => {
    return [
      cols.id(),
      cols.status(),
      cols.from(),
      cols.to(),
      cols.method(),
      cols.assetName(),
      cols.assetAmount(),
      cols.chainId(),
      cols.nonce(),
      cols.gasPrice(),
      cols.gasPriceAware({
        editingItem,
        onUpdateEditingItem,
      }),
      cols.conditionAsset({
        assetOptions,
        editingItem,
        onOpenAddAssetModal,
        onUpdateEditingItem,
      }),
      cols.conditionAmount({
        editingItem,
        onUpdateEditingItem,
      }),
      cols.timeCondition({
        editingItem,
        onUpdateEditingItem,
      }),
      cols.notes({
        editingItem,
        onUpdateEditingItem,
      }),
      cols.gasPaid(),
      cols.gasSaved(),
      cols.actionButtons({
        editingItem,
        onCancelTx,
        onSave,
        onStartEdit,
        onStopEdit,
      }),
    ];
  }, [
    editingItem,
    onUpdateEditingItem,
    assetOptions,
    onOpenAddAssetModal,
    onCancelTx,
    onSave,
    onStartEdit,
    onStopEdit,
  ]);

  return (
    <Container>
      <Table
        className="table"
        size="small"
        footer={
          (() => {
            ('');
          }) as any
        }
        rowKey="id"
        columns={columns}
        dataSource={items}
        loading={loading}
        pagination={{ defaultPageSize: 100, showSizeChanger: false }}
      />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;

  .table {
    width: 100%;
  }
`;

export default TransactionTableWide;
