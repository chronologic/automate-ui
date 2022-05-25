import { useMemo } from 'react';
import { Button, Checkbox, Input, InputNumber, Table } from 'antd';
import { BigNumber, ethers } from 'ethers';
import styled from 'styled-components';

import { bigNumberToNumber, formatNumber, shortAddress } from '../../utils';
import { IScheduledForUser } from '../../types';
import { IAssetStorageItem } from '../../hooks';
import { BlockExplorerLink } from '../Transactions';
import TxStatus from './TxStatus';
import { canEditTx } from './useTxEdit';
import TimeCondition from './TimeCondition';
import ConditionAsset from './ConditionAsset';

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

const { TextArea } = Input;

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
      {
        dataIndex: 'id',
        render: (id: string, record: IScheduledForUser) => (
          <a href={`${window.location.origin}/view/${id}/${record.txKey}`} target="_blank" rel="noopener noreferrer">
            {shortAddress(id)}
          </a>
        ),
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => a.id.localeCompare(b.id),
        title: 'ID',
      },
      {
        dataIndex: 'statusName',
        render: (status: string, record: IScheduledForUser) => {
          return <TxStatus status={status} txHash={record.transactionHash} />;
        },
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => a.statusName.localeCompare(b.statusName),
        title: 'Status',
        align: 'center' as any,
      },
      {
        dataIndex: 'from',
        render: (from: string, record: IScheduledForUser) => (
          <BlockExplorerLink hash={from} chainId={record.chainId} type={'address'} />
        ),
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => a.from.localeCompare(b.from),
        title: 'From',
      },
      {
        dataIndex: 'to',
        render: (to: string, record: IScheduledForUser) => (
          <BlockExplorerLink hash={to} chainId={record.chainId} type={'address'} />
        ),
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => (a.to || '').localeCompare(b.to || ''),
        title: 'To',
      },
      {
        dataIndex: 'assetName',
        render: (assetName: string, record: IScheduledForUser) => {
          const name = (assetName || '').toUpperCase();

          if (record.assetContract) {
            return (
              <BlockExplorerLink hash={record.assetContract} chainId={record.chainId} type={'address'}>
                {name}
              </BlockExplorerLink>
            );
          }

          return name;
        },
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => (a.assetName || '').localeCompare(b.assetName || ''),
        title: 'Asset',
      },
      {
        dataIndex: 'assetAmount',
        render: (assetAmount: string) => assetAmount,
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => (a.assetAmount || 0) - (b.assetAmount || 0),
        title: 'Amount',
      },
      {
        dataIndex: 'chainId',
        render: (chainId: string) => chainId,
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => a.chainId - b.chainId,
        title: 'Chain ID',
      },
      {
        dataIndex: 'nonce',
        render: (nonce: string) => nonce,
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => a.nonce - b.nonce,
        title: 'Nonce',
      },
      {
        dataIndex: 'gasPrice',
        render: (gasPrice: any) => bigNumberToNumber(gasPrice, 9),
        sorter: (a: IScheduledForUser, b: IScheduledForUser) =>
          BigNumber.from(a.gasPrice || '0').gte(BigNumber.from(b.gasPrice || '0')) as any,
        title: 'Gas Price',
      },
      {
        key: 'conditionAsset',
        dataIndex: 'conditionAsset',
        render: (conditionAsset: string, record: IScheduledForUser) => {
          const isEditing = record.id === editingItem?.id;
          const canEdit = canEditTx(record.statusName);

          const changeHandler = ({
            conditionAsset,
            conditionAssetName,
            conditionAssetDecimals,
          }: {
            conditionAsset: string;
            conditionAssetName: string;
            conditionAssetDecimals: number;
          }) => {
            onUpdateEditingItem({ conditionAsset, conditionAssetName, conditionAssetDecimals });
          };

          return (
            <ConditionAsset
              editing={isEditing}
              canEdit={canEdit}
              assetType={record.assetType}
              chainId={record.chainId}
              address={isEditing ? editingItem?.conditionAsset : conditionAsset}
              name={record.conditionAssetName}
              assetOptions={assetOptions}
              onOpenAddAssetModal={onOpenAddAssetModal}
              onChange={changeHandler}
            />
          );
        },
        title: 'Condition Asset',
        align: 'center' as any,
      },
      {
        key: 'conditionAmount',
        dataIndex: 'conditionAmount',
        render: (amount: string, record: IScheduledForUser) => {
          const isEditing = record.id === editingItem?.id;
          const canEdit = canEditTx(record.statusName);

          const num = amount ? Number(ethers.utils.formatUnits(amount as any, record.conditionAssetDecimals)) : '';

          if (isEditing && canEdit) {
            const changeHandler = (val: any) => {
              const newAmount = amount
                ? ethers.utils.parseUnits(`${val || 0}`, record.conditionAssetDecimals).toString()
                : '';
              onUpdateEditingItem({ conditionAmount: newAmount });
            };
            return <InputNumber min={0} defaultValue={num} onChange={changeHandler} />;
          }

          return formatNumber(num || 0);
        },
        title: 'Condition Amount',
        align: 'right' as any,
      },
      {
        key: 'timeCondition',
        dataIndex: 'timeCondition',
        render: (timeCondition: number, record: IScheduledForUser) => {
          const isEditing = record.id === editingItem?.id;
          const canEdit = canEditTx(record.statusName);

          const changeHandler = ({ timeCondition, timeConditionTZ }: any) =>
            onUpdateEditingItem({ timeCondition, timeConditionTZ });

          return (
            <TimeCondition
              editing={isEditing}
              canEdit={canEdit}
              timeCondition={timeCondition}
              timeConditionTZ={record.timeConditionTZ}
              onChange={changeHandler}
            />
          );
        },
        title: 'Time Condition',
        align: 'right' as any,
      },
      {
        dataIndex: 'gasPriceAware',
        render: (aware: boolean, record: IScheduledForUser) => {
          const isEditing = record.id === editingItem?.id;

          const changeHandler = (e: any) => onUpdateEditingItem({ gasPriceAware: e.target.checked });
          return <Checkbox defaultChecked={aware} disabled={!isEditing} onChange={changeHandler} />;
        },
        sorter: (a: IScheduledForUser, b: IScheduledForUser) =>
          (a.gasPriceAware ? a.gasPriceAware : b.gasPriceAware) as any,
        title: 'Gas Price Aware?',
      },
      {
        key: 'notes',
        dataIndex: 'notes',
        render: (notes: string, record: IScheduledForUser) => {
          const isEditing = record.id === editingItem?.id;

          if (isEditing) {
            const changeHandler = (e: any) => onUpdateEditingItem({ notes: e.target.value });
            return <TextArea defaultValue={notes} onChange={changeHandler} />;
          }

          return notes;
        },
        title: 'Notes',
        align: 'right' as any,
      },
      {
        dataIndex: 'id',
        render: (id: string, record: IScheduledForUser) => {
          if (id === editingItem?.id) {
            return (
              <div>
                <Button type="primary" size="small" color="green" onClick={onSave}>
                  Save
                </Button>
                <Button size="small" color="orange" onClick={onStopEdit}>
                  Cancel
                </Button>
              </div>
            );
          }
          const clickHandler = () => onStartEdit(record);
          return (
            <Button type="primary" size="small" color="blue" onClick={clickHandler}>
              Edit
            </Button>
          );
        },
        title: '',
      },
    ];
  }, [
    editingItem?.id,
    editingItem?.conditionAsset,
    assetOptions,
    onOpenAddAssetModal,
    onUpdateEditingItem,
    onSave,
    onStopEdit,
    onStartEdit,
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
