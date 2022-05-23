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
import {
  Button,
  DatePicker,
  Dropdown,
  Input,
  InputNumber,
  Menu,
  Modal,
  Select,
  Table,
  TimePicker,
  Tooltip,
} from 'antd';
import { BigNumber } from 'ethers';
import moment from 'moment-timezone';
import queryString from 'query-string';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { TokenAPI } from '../../api/TokenAPI';
import { bigNumberToNumber, formatCurrency, formatNumber, normalizeBigNumber, numberToBn } from '../../utils';
import { ChainId, BlockExplorerUrl, BlockExplorerName } from '../../constants';
import { IScheduleParams, IScheduleRequest } from '../../api/SentinelAPI';
import { IScheduledForUser } from '../../types';
import { BlockExplorerLink } from '../Transactions';
import AssetSymbol from '../AssetSymbol';
import { IAssetStorageItem } from './assetStorage';
import assetStorage from './assetStorage';
import AssetSymbolLink from './AssetSymbolLink';
import TxStatus from './TxStatus';

interface IProps {
  items: IScheduledForUser[];
  loading: boolean;
  assetOptions: IAssetStorageItem[];
  onSetLoading: (loading: boolean) => void;
  onEditTx: (request: IScheduleRequest, queryParams?: IScheduleParams | undefined) => Promise<IScheduledForUser>;
  onCancelTx: (record: IScheduledForUser) => void;
  onRefresh: () => void;
  onUpdateAssetOptions: (newItems?: IScheduledForUser[]) => void;
}

const queryParams = queryString.parseUrl(window.location.href);
const apiKey = queryParams.query.apiKey as string;

const { TextArea } = Input;

function TransactionTable({
  items,
  loading,
  assetOptions,
  onSetLoading,
  onEditTx,
  onCancelTx,
  onRefresh,
  onUpdateAssetOptions,
}: IProps) {
  const [editingItem, setEditingItem] = useState<IScheduledForUser>({} as any);
  const [editedConditionAsset, setEditedConditionAsset] = useState('');
  const [editedConditionAmount, setEditedConditionAmount] = useState('');
  const [editedConditionDecimals, setEditedConditionDecimals] = useState(18);
  const [editedTimeConditionDate, setEditedTimeConditionDate] = useState();
  const [editedTimeConditionTime, setEditedTimeConditionTime] = useState();
  const [editedTimeCondition, setEditedTimeCondition] = useState(0);
  const [editedTimeConditionTZ, setEditedTimeConditionTZ] = useState('');
  const [editedGasPriceAware, setEditedGasPriceAware] = useState(false);
  const [editedNotes, setEditedNotes] = useState<string>('');
  const [addAssetModalVisible, setAddAssetModalVisible] = useState(false);
  const [addAssetAddress, setAddAssetAddress] = useState('');
  const [addAssetName, setAddAssetName] = useState('');
  const [addAssetDecimals, setAddAssetDecimals] = useState(18);
  const [addAssetError, setAddAssetError] = useState('');
  const [fetchingAsset, setFetchingAsset] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  const handleStartEditingItem = useCallback(
    (record: IScheduledForUser) => {
      setEditingItem(record);
      if (!expandedRowKeys.includes(record.id)) {
        setExpandedRowKeys([...expandedRowKeys, record.id]);
      }
      setEditedConditionAsset(record.conditionAsset);
      setEditedConditionAmount(record.conditionAmount);
      setEditedConditionDecimals(record.conditionAssetDecimals);
      setEditedTimeCondition(record.timeCondition);
      if (record.timeCondition && record.timeConditionTZ) {
        const date = moment.tz(record.timeCondition, record.timeConditionTZ);
        setEditedTimeConditionDate(date as any);
        setEditedTimeConditionTime(date as any);
      } else {
        setEditedTimeConditionTime(moment().startOf('day') as any);
      }
      setEditedTimeConditionTZ(record.timeConditionTZ || moment.tz.guess());
      setEditedNotes(record.notes);
      setEditedGasPriceAware(record.gasPriceAware);
    },
    [expandedRowKeys]
  );

  const handleOpenAddAssetModal = useCallback(() => {
    setAddAssetModalVisible(true);
  }, []);

  const handleExpandedRowKeysChange = useCallback((keys: string[]) => {
    setExpandedRowKeys(keys);
  }, []);

  const handleStopEditingItem = useCallback(() => {
    setEditingItem({} as any);
  }, []);

  const handleConditionAmountChange = useCallback(
    (amount) => {
      const newAmount = amount ? numberToBn(amount, editedConditionDecimals).toString() : '';
      setEditedConditionAmount(newAmount);
    },
    [editedConditionDecimals]
  );

  const handleConditionAssetChange = useCallback(
    (contractAddress: string, newAsset?: IAssetStorageItem) => {
      const asset = newAsset || assetOptions.find((a) => a.address === contractAddress);
      setEditedConditionAsset(contractAddress);
      const oldDecimals = editedConditionDecimals;
      const newDecimals = asset?.decimals || 18;
      setEditedConditionDecimals(newDecimals);

      if (newDecimals !== oldDecimals) {
        const newAmount = normalizeBigNumber(
          BigNumber.from(editedConditionAmount),
          oldDecimals,
          newDecimals
        ).toString();
        setEditedConditionAmount(newAmount);
      }
    },
    [assetOptions, editedConditionDecimals, editedConditionAmount]
  );

  const handleTimeConditionDateChange = useCallback(
    (date) => {
      setEditedTimeConditionDate(date);
      if (!editedTimeConditionTime || !date || !editedTimeConditionTZ) {
        setEditedTimeCondition(0);
      } else {
        const dateStr = moment(date).format('YYYY.MM.DD');
        const timeStr = moment(editedTimeConditionTime).format('HH:mm');
        const newDate = moment
          .tz(`${dateStr} ${timeStr}`, 'YYYY.MM.DD HH:mm', editedTimeConditionTZ)
          .toDate()
          .getTime();
        setEditedTimeCondition(newDate);
      }
    },
    [editedTimeConditionTime, editedTimeConditionTZ]
  );

  const handleTimeConditionTimeChange = useCallback(
    (time) => {
      setEditedTimeConditionTime(time);
      if (!editedTimeConditionDate || !time || !editedTimeConditionTZ) {
        setEditedTimeCondition(0);
      } else {
        const timeStr = moment(time).format('HH:mm');
        const dateStr = moment(editedTimeConditionDate).format('YYYY.MM.DD');
        const newDate = moment
          .tz(`${dateStr} ${timeStr}`, 'YYYY.MM.DD HH:mm', editedTimeConditionTZ)
          .toDate()
          .getTime();
        setEditedTimeCondition(newDate);
      }
    },
    [editedTimeConditionDate, editedTimeConditionTZ]
  );

  const handleTimeConditionTZChange = useCallback(
    (tz) => {
      setEditedTimeConditionTZ(tz);
      if (!editedTimeConditionTime || !tz || !editedTimeConditionDate) {
        setEditedTimeCondition(0);
      } else {
        const timeStr = moment(editedTimeConditionTime).format('HH:mm');
        const dateStr = moment(editedTimeConditionDate).format('YYYY.MM.DD');
        const newDate = moment.tz(`${dateStr} ${timeStr}`, 'YYYY.MM.DD HH:mm', tz).toDate().getTime();
        setEditedTimeCondition(newDate);
      }
    },
    [editedTimeConditionTime, editedTimeConditionDate]
  );

  const handleSave = useCallback(async () => {
    const c = console;
    c.log({
      editedConditionAmount,
      editedConditionAsset,
      editedGasPriceAware,
      editedNotes,
      editedTimeCondition,
      editedTimeConditionTZ,
    });

    try {
      onSetLoading(true);

      await onEditTx(
        {
          assetType: editingItem.assetType,
          conditionAmount: editedConditionAmount,
          conditionAsset: editedConditionAsset,
          gasPriceAware: editedGasPriceAware,
          notes: editedNotes,
          paymentEmail: '',
          paymentRefundAddress: '',
          signedTransaction: editingItem.signedTransaction,
          timeCondition: editedTimeCondition,
          timeConditionTZ: editedTimeConditionTZ,
        },
        {
          apiKey,
        }
      );
      setEditingItem({} as any);

      onRefresh();
    } finally {
      onSetLoading(false);
    }
  }, [
    editedConditionAmount,
    editedConditionAsset,
    editedGasPriceAware,
    editedNotes,
    editedTimeCondition,
    editedTimeConditionTZ,
    editingItem.assetType,
    editingItem.signedTransaction,
    onEditTx,
    onRefresh,
    onSetLoading,
  ]);

  const handleFetchAsset = useCallback(
    async (e: any) => {
      try {
        setFetchingAsset(true);
        const inputAddress = e.target.value || '';

        const { address, decimals, symbol, name, validationError } = await TokenAPI.resolveToken(
          inputAddress,
          editingItem.chainId
        );

        setAddAssetAddress(address);
        setAddAssetError(validationError);
        setAddAssetDecimals(decimals);
        setAddAssetName(symbol || name);
      } finally {
        setFetchingAsset(false);
      }
    },
    [editingItem.chainId]
  );

  const handleAddAsset = useCallback(() => {
    const newAsset: IAssetStorageItem = {
      address: addAssetAddress,
      decimals: addAssetDecimals,
      name: addAssetName,
    };
    if (addAssetName) {
      assetStorage.add(newAsset);
      onUpdateAssetOptions();
      handleConditionAssetChange(addAssetAddress, newAsset);
    }
    setAddAssetError('');
    setAddAssetAddress('');
    setAddAssetDecimals(18);
    setAddAssetName('');
    setAddAssetModalVisible(false);
  }, [addAssetAddress, addAssetDecimals, addAssetName, onUpdateAssetOptions, handleConditionAssetChange]);

  const handleDismissAddAsset = useCallback(() => setAddAssetModalVisible(false), []);

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
          <BlockExplorerLink hash={from} chainId={record.chainId} type={'address'} />
        ),
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => a.from.localeCompare(b.from),
        title: 'From',
        align: 'center' as any,
      },
      {
        dataIndex: 'to',
        render: (to: string, record: IScheduledForUser) => (
          <BlockExplorerLink hash={to} chainId={record.chainId} type={'address'} />
        ),
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => (a.to || '').localeCompare(b.to || ''),
        title: 'To',
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

          const showCancel = ['Draft', 'Pending'].includes(record.statusName);
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
            const isEditing = record.id === editingItem.id;
            const canEdit = ['Draft', 'Pending'].includes(record.statusName);

            if (isEditing && canEdit) {
              const handler = (value: string) => handleConditionAssetChange(value);
              return (
                <div>
                  <Select value={editedConditionAsset} style={{ width: '100px' }} onChange={handler}>
                    {assetOptions.map((asset) => (
                      <Select.Option key={asset.address} value={asset.address}>
                        {asset.name}
                      </Select.Option>
                    ))}
                  </Select>
                  <br />
                  <Button
                    type="ghost"
                    style={{ border: '0px', background: 'transparent' }}
                    onClick={handleOpenAddAssetModal}
                  >
                    <PlusOutlined /> Add
                  </Button>
                </div>
              );
            }

            const assetName = (record.conditionAssetName || '').toUpperCase();

            if (conditionAsset) {
              return (
                <BlockExplorerLink hash={assetName || conditionAsset} chainId={record.chainId} type={'address'}>
                  <AssetSymbol name={assetName} address={conditionAsset} />
                </BlockExplorerLink>
              );
            }

            return <AssetSymbol name={assetName} address={conditionAsset} />;
          },
          title: 'Condition Asset',
          align: 'center' as any,
        },
        {
          key: 'conditionAmount',
          dataIndex: 'conditionAmount',
          render: (amount: string, record: IScheduledForUser) => {
            const isEditing = record.id === editingItem.id;
            const canEdit = ['Draft', 'Pending'].includes(record.statusName);

            const num = amount ? bigNumberToNumber(amount as any, record.conditionAssetDecimals) : '';

            if (isEditing && canEdit) {
              const handler = (val: any) => handleConditionAmountChange(val);
              return <InputNumber min={0} defaultValue={num} onChange={handler} />;
            }

            return formatNumber(num || 0);
          },
          title: 'Condition Amount',
          align: 'right' as any,
        },
        {
          key: 'timeCondition',
          dataIndex: 'timeCondition',
          render: (timeCondition: string, record: IScheduledForUser) => {
            const isEditing = record.id === editingItem.id;
            const canEdit = ['Draft', 'Pending'].includes(record.statusName);

            const hasTimeCondition = timeCondition && timeCondition !== '0';
            const timeConditionLocal = hasTimeCondition ? moment(timeCondition) : '';
            const timeConditionForTz = hasTimeCondition
              ? (timeConditionLocal as any).clone().tz(record.timeConditionTZ)
              : '';
            const timeConditionTime = timeConditionForTz || moment().startOf('day');

            if (isEditing && canEdit) {
              return (
                <>
                  <DatePicker
                    format={'MMM D yyyy'}
                    defaultValue={timeConditionForTz as any}
                    onChange={handleTimeConditionDateChange}
                  />
                  <br />
                  <TimePicker
                    format={'hh:mm a'}
                    use12Hours={true}
                    defaultValue={timeConditionTime as any}
                    onChange={handleTimeConditionTimeChange}
                  />
                  <br />
                  <Select
                    showSearch={true}
                    defaultValue={record.timeConditionTZ || moment.tz.guess()}
                    style={{ minWidth: '120px' }}
                    onChange={handleTimeConditionTZChange}
                  >
                    {moment.tz.names().map((tz, index) => (
                      <Select.Option key={index} value={tz}>
                        {tz}
                      </Select.Option>
                    ))}
                  </Select>
                </>
              );
            }

            if (hasTimeCondition) {
              return (
                <div>
                  {moment(timeConditionForTz).format('MMM D yyyy hh:mm a')} {record.timeConditionTZ}
                  <br />
                  <i style={{ color: 'gray' }}>(local: {moment(timeConditionLocal).format('MMM D yyyy hh:mm a')})</i>
                </div>
              );
            }

            return '-';
          },
          title: 'Time Condition',
          align: 'right' as any,
        },
        {
          key: 'notes',
          dataIndex: 'notes',
          render: (notes: string, record: IScheduledForUser) => {
            const isEditing = record.id === editingItem.id;

            if (isEditing) {
              const cb = (e: any) => setEditedNotes(e.target.value);
              return <TextArea defaultValue={notes} onChange={cb} />;
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
            if (id === editingItem.id) {
              return (
                <div>
                  <Button type="primary" color="green" onClick={handleSave}>
                    Save
                  </Button>
                  <br />
                  <br />
                  <Button color="orange" onClick={handleStopEditingItem}>
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
      editedConditionAsset,
      editingItem.id,
      handleConditionAmountChange,
      handleConditionAssetChange,
      handleOpenAddAssetModal,
      handleSave,
      handleStopEditingItem,
      handleTimeConditionDateChange,
      handleTimeConditionTZChange,
      handleTimeConditionTimeChange,
    ]
  );

  return (
    <Container>
      <Modal
        visible={addAssetModalVisible}
        onCancel={handleDismissAddAsset}
        onOk={handleAddAsset}
        confirmLoading={fetchingAsset}
        okButtonProps={{
          disabled: !addAssetName || !!addAssetError,
        }}
      >
        <br />
        <Input type="text" placeholder="Contract address" value={addAssetAddress} onChange={handleFetchAsset} />
        <br />
        <br />
        <Input type="text" placeholder="Symbol" disabled={true} value={addAssetName} />
        <br />
        <br />
        <Input type="text" placeholder="Decimals" disabled={true} value={addAssetAddress ? addAssetDecimals : ''} />
        {addAssetError && <div style={{ color: 'red' }}>{addAssetError}</div>}
        <br />
      </Modal>
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
