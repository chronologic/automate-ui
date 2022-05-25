import { useCallback, useMemo, useState } from 'react';
import {
  DeleteOutlined,
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  ExportOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { Button, DatePicker, Dropdown, Input, InputNumber, Menu, Select, Table, TimePicker, Tooltip } from 'antd';
import { BigNumber, ethers } from 'ethers';
import moment from 'moment-timezone';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { bigNumberToNumber, formatCurrency, formatNumber, numberToBn } from '../../utils';
import { ChainId, BlockExplorerUrl, BlockExplorerName } from '../../constants';
import { IScheduleParams, IScheduleRequest } from '../../api/SentinelAPI';
import { IScheduledForUser } from '../../types';
import { IAssetStorageItem } from '../../hooks';
import { BlockExplorerLink } from '../Transactions';
import AssetSymbol from '../AssetSymbol';
import LabelTag from '../LabelTag';
import AssetSymbolLink from './AssetSymbolLink';
import TxStatus from './TxStatus';
import { canEditTx } from './useTxEdit';
import TimeCondition from './TimeCondition';
import ConditionAsset from './ConditionAsset';

interface IProps {
  items: IScheduledForUser[];
  loading: boolean;
  apiKey: string;
  assetOptions: IAssetStorageItem[];
  editing: boolean;
  editingItem: IScheduledForUser | undefined;
  onStartEdit: (tx: IScheduledForUser) => void;
  onStopEdit: () => void;
  onUpdateEditingItem: (partial: Partial<IScheduledForUser>) => void;
  onSetLoading: (loading: boolean) => void;
  onEditTx: ({
    request,
    queryParams,
  }: {
    request: IScheduleRequest;
    queryParams?: IScheduleParams | undefined;
  }) => Promise<IScheduledForUser>;
  onCancelTx: (record: IScheduledForUser) => void;
  onRefresh: () => void;
  onOpenAddAssetModal: () => void;
}

const { TextArea } = Input;

function TransactionTable({
  items,
  loading,
  apiKey,
  assetOptions,
  editing,
  editingItem,
  onStartEdit,
  onStopEdit,
  onUpdateEditingItem,
  onSetLoading,
  onEditTx,
  onCancelTx,
  onRefresh,
  onOpenAddAssetModal,
}: IProps) {
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  const handleStartEditingItem = useCallback(
    (record: IScheduledForUser) => {
      onStartEdit(record);
      if (!expandedRowKeys.includes(record.id)) {
        setExpandedRowKeys([...expandedRowKeys, record.id]);
      }
      // onUpdateEditingItem({
      //   conditionAsset: record.conditionAsset,
      //   conditionAmount: record.conditionAmount,
      //   conditionAssetDecimals: record.conditionAssetDecimals,
      // })
      // setEditedConditionAsset(record.conditionAsset);
      // setEditedConditionAmount();
      // setEditedConditionDecimals();
      // setEditedTimeCondition(record.timeCondition);
      // if (record.timeCondition && record.timeConditionTZ) {
      //   const date = moment.tz(record.timeCondition, record.timeConditionTZ);
      //   setEditedTimeConditionDate(date as any);
      //   setEditedTimeConditionTime(date as any);
      // } else {
      //   setEditedTimeConditionTime(moment().startOf('day') as any);
      // }
      // setEditedTimeConditionTZ(record.timeConditionTZ || moment.tz.guess());
      // setEditedNotes(record.notes);
      // setEditedGasPriceAware(record.gasPriceAware);
    },
    [expandedRowKeys, onStartEdit]
  );

  const handleExpandedRowKeysChange = useCallback((keys: string[]) => {
    setExpandedRowKeys(keys);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      onSetLoading(true);

      await onEditTx({
        request: {
          ...editingItem!,
          paymentEmail: '',
          paymentRefundAddress: '',
        },
        queryParams: {
          apiKey,
        },
      });
      onStopEdit();

      onRefresh();
    } finally {
      onSetLoading(false);
    }
  }, [apiKey, editingItem, onEditTx, onRefresh, onSetLoading, onStopEdit]);

  const columns = useMemo(() => {
    return [
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
          <BlockExplorerLink hash={from} label={record.fromLabel} chainId={record.chainId} type={'address'} />
        ),
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => a.from.localeCompare(b.from),
        title: 'From',
        align: 'center' as any,
      },
      {
        dataIndex: 'to',
        render: (to: string, record: IScheduledForUser) => (
          <BlockExplorerLink hash={to} label={record.toLabel} chainId={record.chainId} type={'address'} />
        ),
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => (a.to || '').localeCompare(b.to || ''),
        title: 'To',
        align: 'center' as any,
      },
      {
        dataIndex: 'method',
        render: (method: string, record: IScheduledForUser) => <LabelTag raw={method} label={record.methodLabel} />,
        sorter: (a: IScheduledForUser, b: IScheduledForUser) =>
          (a.methodLabel || '').localeCompare(b.methodLabel || ''),
        title: 'Method',
        align: 'center' as any,
      },
      {
        dataIndex: 'assetName',
        render: (assetName: string, record: IScheduledForUser) => {
          return (
            <AssetSymbolLink assetName={assetName} assetContract={record.assetContract} chainId={record.chainId} />
          );
        },
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => (a.assetName || '').localeCompare(b.assetName || ''),
        title: 'Asset',
        align: 'center' as any,
      },
      {
        dataIndex: 'assetAmount',
        render: (assetAmount: number) => formatNumber(assetAmount),
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => (a.assetAmount || 0) - (b.assetAmount || 0),
        title: 'Amount',
        align: 'right' as any,
      },
      {
        dataIndex: 'nonce',
        render: (nonce: string) => nonce,
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => a.nonce - b.nonce,
        title: 'Nonce',
        align: 'right' as any,
      },
      {
        dataIndex: 'gasPrice',
        render: (gasPrice: any) => formatNumber(bigNumberToNumber(gasPrice, 9), 0),
        sorter: (a: IScheduledForUser, b: IScheduledForUser) =>
          BigNumber.from(a.gasPrice || '0').gte(BigNumber.from(b.gasPrice || '0')) as any,
        title: 'Gas Price',
        align: 'right' as any,
      },

      {
        dataIndex: 'gasPaid',
        render: (gasPaid: number, record: IScheduledForUser) => {
          let info = <div />;
          if (!['Completed'].includes(record.statusName)) {
            info = (
              <Tooltip title="Estimated value">
                <InfoCircleOutlined />
              </Tooltip>
            );
          }
          return (
            <div>
              {info} {formatCurrency(gasPaid)}
            </div>
          );
        },
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => (a.gasPaid || 0) - (b.gasPaid || 0),
        title: 'Gas Paid',
        align: 'right' as any,
      },
      {
        dataIndex: 'gasSaved',
        render: (gasSaved: number, record: IScheduledForUser) => {
          let info = <div />;
          if (!['Completed'].includes(record.statusName)) {
            info = (
              <Tooltip title="Estimated value">
                <InfoCircleOutlined />
              </Tooltip>
            );
          }
          return (
            <div>
              {info} {formatCurrency(gasSaved)}
            </div>
          );
        },
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => (a.gasSaved || 0) - (b.gasSaved || 0),
        title: 'Gas Saved',
        align: 'right' as any,
      },
      {
        dataIndex: 'id',
        render: (id: string, record: IScheduledForUser) => {
          const handleEdit = () => handleStartEditingItem(record);
          const handleCancel = () => onCancelTx(record);

          const showCancel = canEditTx(record.statusName);
          const showEtherscan = !['Draft', 'Pending', 'Cancelled'].includes(record.statusName);
          const networkName: string = ChainId[record.chainId];
          const networkExplorerName: string = ' ' + BlockExplorerName[networkName as keyof typeof BlockExplorerUrl];

          const menu = (
            <Menu>
              <Menu.Item key="0" onClick={handleEdit}>
                <EditOutlined /> Edit
              </Menu.Item>
              <Menu.Item key="1">
                <Link to={`/legacy/view/${record.id}/${record.txKey}`} target="_blank">
                  <FileTextOutlined /> Details
                </Link>
              </Menu.Item>
              {showEtherscan && (
                <Menu.Item key="2">
                  <BlockExplorerLink hash={record.transactionHash} chainId={record.chainId} type={'tx'}>
                    <ExportOutlined />
                    {networkExplorerName}
                  </BlockExplorerLink>
                </Menu.Item>
              )}
              {showCancel && (
                <>
                  <Menu.Divider />
                  <Menu.Item key="3" onClick={handleCancel}>
                    <DeleteOutlined /> Cancel
                  </Menu.Item>
                </>
              )}
            </Menu>
          );

          return (
            <Dropdown overlay={menu} trigger={['click']}>
              <Actions>
                <MoreOutlined />
              </Actions>
            </Dropdown>
          );
        },
        title: '',
        align: 'center' as any,
      },
    ];
  }, [handleStartEditingItem, onCancelTx]);

  const expandedRowRender = useCallback(
    (record: IScheduledForUser) => {
      const columns = [
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
          key: 'extra',
          dataIndex: 'id',
          render: (id: string, record: IScheduledForUser) => {
            const extra = [];
            // eslint-disable-next-line eqeqeq
            if (record.chainId != 1) {
              extra.push(`chain id ${record.chainId}`);
            }
            if (!record.gasPriceAware) {
              extra.push(`not gas price aware`);
            }

            return extra.join(', ');
          },
          title: 'Extra',
          align: 'right' as any,
        },
        {
          key: 'actions',
          dataIndex: 'id',
          render: (id: string, record: IScheduledForUser) => {
            if (id === editingItem?.id) {
              return (
                <div>
                  <Button type="primary" color="green" onClick={handleSave}>
                    Save
                  </Button>
                  <br />
                  <br />
                  <Button color="orange" onClick={onStopEdit}>
                    Cancel
                  </Button>
                </div>
              );
            }

            return '';
          },
          title: '',
          align: 'center' as any,
        },
      ];

      return <Table columns={columns} dataSource={[record]} pagination={false} rowKey="id" />;
    },
    [
      assetOptions,
      editingItem?.conditionAsset,
      editingItem?.id,
      handleSave,
      onOpenAddAssetModal,
      onStopEdit,
      onUpdateEditingItem,
    ]
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
  max-width: 1220px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;

  .table {
    width: 100%;
  }
`;

const Actions = styled.div`
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.colors.accent};
  }

  .anticon {
    font-size: 2.6rem;
  }
`;

export default TransactionTable;
