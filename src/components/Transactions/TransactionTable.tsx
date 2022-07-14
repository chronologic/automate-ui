import { useCallback, useMemo, useState } from 'react';
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

function TransactionTable({
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
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  const handleStartEditingItem = useCallback(
    (record: IScheduledForUser) => {
      onStartEdit(record);
      if (!expandedRowKeys.includes(record.id)) {
        setExpandedRowKeys([...expandedRowKeys, record.id]);
      }
    },
    [expandedRowKeys, onStartEdit]
  );

  const handleExpandedRowKeysChange = useCallback((keys: string[]) => {
    setExpandedRowKeys(keys);
  }, []);

  const columns = useMemo(() => {
    return [
      cols.status(),
      cols.from(),
      cols.to(),
      cols.method(),
      cols.assetName(),
      cols.assetAmount(),
      cols.nonce(),
      cols.gasPrice(),
      cols.gasPaid(),
      cols.gasSaved(),
      cols.actionsDropdown({
        onStartEdit: handleStartEditingItem,
        onCancelTx,
      }),
    ];
  }, [handleStartEditingItem, onCancelTx]);

  const expandedRowRender = useCallback(
    (record: IScheduledForUser) => {
      const columns = [
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
        cols.extra(),
        cols.actionsInEditMode({
          editingItem,
          onSave,
          onStopEdit,
        }),
      ];

      return <Table columns={columns} dataSource={[record]} pagination={false} rowKey="id" />;
    },
    [assetOptions, editingItem, onOpenAddAssetModal, onSave, onStopEdit, onUpdateEditingItem]
  );

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
        expandable={{
          expandedRowRender,
          expandIconColumnIndex: 0,
          expandedRowKeys,
          onExpandedRowsChange: handleExpandedRowKeysChange as any,
        }}
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

export default TransactionTable;
