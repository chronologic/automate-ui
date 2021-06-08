import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseSquareOutlined,
  DeleteOutlined,
  FormOutlined,
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  ExportOutlined,
  FileTextOutlined,
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
  Typography,
} from 'antd';
import { BigNumber } from 'ethers';
import uniqBy from 'lodash/uniqBy';
import moment from 'moment-timezone';
import queryString from 'query-string';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { TokenAPI } from '../../api/TokenAPI';
import { bigNumberToNumber, formatLongId, formatNumber, normalizeBigNumber, numberToBn } from '../../utils';
import { IScheduledForUser } from '../../types';
import { IAssetStorageItem } from './assetStorage';
import assetStorage from './assetStorage';
import { useTransactions } from '../../hooks/useTransactions';
import PageTitle from '../PageTitle';
import AssetSymbol from '../AssetSymbol';
import TxStatus from './TxStatus';

const queryParams = queryString.parseUrl(window.location.href);
const apiKey = queryParams.query.apiKey as string;

const { TextArea } = Input;

const rowSelection = {
  onChange: (selectedRowKeys: any, selectedRows: any) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  onSelect: (record: any, selected: any, selectedRows: any) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
    console.log(selected, selectedRows, changeRows);
  },
};

function Transactions() {
  const { getList, editTx, cancelTx } = useTransactions();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<IScheduledForUser[]>([]);
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
  const [assetOptions, setAssetOptions] = useState<IAssetStorageItem[]>([]);
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

  const updateAssetOptions = useCallback(
    (newItems?: IScheduledForUser[]) => {
      const localItems = newItems || items;
      const uniqueAssets: IAssetStorageItem[] = uniqBy(
        [
          { address: '', name: 'ETH', decimals: 18 } as IAssetStorageItem,
          ...[
            ...assetStorage.getItems(),
            ...localItems.map((item) => {
              return {
                address: item.conditionAsset,
                decimals: item.conditionAssetDecimals,
                name: item.conditionAssetName,
              };
            }),
            ...localItems.map((item) => {
              return {
                address: item.assetContract,
                decimals: item.assetDecimals,
                name: item.assetName,
              };
            }),
          ].filter((item) => item.address && item.decimals && item.name),
        ],
        'address'
      );
      setAssetOptions(uniqueAssets);
    },
    [items]
  );

  // const refresh = useCallback(async () => {
  //   console.log('REFresh');
  //   try {
  //     setLoading(true);
  //     const res = await getList();
  //     setItems(res);
  //     updateAssetOptions(res);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [getList, updateAssetOptions]);
  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getList();
      setItems(res);
      updateAssetOptions(res);
    } finally {
      setLoading(false);
    }
  }, [getList, updateAssetOptions]);

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
      const c = console;
      c.log(editedTimeConditionTime, date, editedTimeConditionTZ);
      if (!editedTimeConditionTime || !date || !editedTimeConditionTZ) {
        setEditedTimeCondition(0);
      } else {
        const dateStr = moment(date).format('YYYY.MM.DD');
        const timeStr = moment(editedTimeConditionTime).format('HH:mm');
        const newDate = moment
          .tz(`${dateStr} ${timeStr}`, 'YYYY.MM.DD HH:mm', editedTimeConditionTZ)
          .toDate()
          .getTime();
        // const c = console;
        // c.log(newDate, new Date(newDate));
        setEditedTimeCondition(newDate);
      }
    },
    [editedTimeConditionTime, editedTimeConditionTZ]
  );

  const handleTimeConditionTimeChange = useCallback(
    (time) => {
      setEditedTimeConditionTime(time);
      // const c = console;
      // c.log(editedTimeConditionDate, time, editedTimeConditionTZ);
      if (!editedTimeConditionDate || !time || !editedTimeConditionTZ) {
        setEditedTimeCondition(0);
      } else {
        const timeStr = moment(time).format('HH:mm');
        const dateStr = moment(editedTimeConditionDate).format('YYYY.MM.DD');
        const newDate = moment
          .tz(`${dateStr} ${timeStr}`, 'YYYY.MM.DD HH:mm', editedTimeConditionTZ)
          .toDate()
          .getTime();
        // const c = console;
        // c.log(newDate, new Date(newDate));
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
        // const c = console;
        // c.log(newDate, new Date(newDate));
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
      setLoading(true);

      await editTx(
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

      refresh();
    } finally {
      setLoading(false);
    }
  }, [
    editTx,
    editedConditionAmount,
    editedConditionAsset,
    editedGasPriceAware,
    editedNotes,
    editedTimeCondition,
    editedTimeConditionTZ,
    editingItem.assetType,
    editingItem.signedTransaction,
    refresh,
  ]);

  const handleCancelTx = useCallback(
    async (record: IScheduledForUser) => {
      try {
        setLoading(true);

        await cancelTx({
          id: record.id,
          key: record.txKey,
          createdAt: record.createdAt,
          paymentAddress: '',
        });

        refresh();
      } finally {
        setLoading(false);
      }
    },
    [cancelTx, refresh]
  );

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
      updateAssetOptions();
      handleConditionAssetChange(addAssetAddress, newAsset);
    }
    setAddAssetError('');
    setAddAssetAddress('');
    setAddAssetDecimals(18);
    setAddAssetName('');
    setAddAssetModalVisible(false);
  }, [addAssetAddress, addAssetName, addAssetDecimals, updateAssetOptions, handleConditionAssetChange]);

  const handleDismissAddAsset = useCallback(() => setAddAssetModalVisible(false), []);

  const columns = useMemo(() => {
    return [
      // {
      //   dataIndex: 'id',
      //   render: (id: string, record: IScheduledForUser) => (
      //     <a href={`${window.location.origin}/view/${id}/${record.txKey}`} target="_blank" rel="noopener noreferrer">
      //       {formatLongId(id)}
      //     </a>
      //   ),
      //   sorter: (a: IScheduledForUser, b: IScheduledForUser) => a.id.localeCompare(b.id),
      //   title: 'ID',
      // },
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
        render: (from: string) => (
          <a href={`https://etherscan.io/address/${from}`} title={from} target="_blank" rel="noopener noreferrer">
            {formatLongId(from)}
          </a>
        ),
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => a.from.localeCompare(b.from),
        title: 'From',
        align: 'center' as any,
      },
      {
        dataIndex: 'to',
        render: (to: string) => (
          <a href={`https://etherscan.io/address/${to}`} title={to} target="_blank" rel="noopener noreferrer">
            {formatLongId(to || '')}
          </a>
        ),
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => (a.to || '').localeCompare(b.to || ''),
        title: 'To',
        align: 'center' as any,
      },
      {
        dataIndex: 'assetName',
        render: (assetName: string, record: IScheduledForUser) => {
          const name = (assetName || '').toUpperCase();

          if (record.assetContract) {
            return (
              <a
                href={`https://etherscan.io/address/${record.assetContract}`}
                title={name || record.assetContract}
                target="_blank"
                rel="noopener noreferrer"
              >
                <AssetSymbol name={name} address={record.assetContract} />
              </a>
            );
          }

          return <AssetSymbol name={name} address={record.assetContract} />;
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
      // {
      //   dataIndex: 'chainId',
      //   render: (chainId: string) => chainId,
      //   sorter: (a: IScheduledForUser, b: IScheduledForUser) => a.chainId - b.chainId,
      //   title: 'Chain ID',
      // },
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
        title: 'Gas Paid',
        align: 'right' as any,
      },
      {
        title: 'Gas Saved',
        align: 'right' as any,
      },
      {
        dataIndex: 'id',
        render: (id: string, record: IScheduledForUser) => {
          // if (id === editingItem.id) {
          //   return (
          //     <div>
          //       <Button type="primary" size="small" color="green" onClick={handleSave}>
          //         Save
          //       </Button>
          //       <br />
          //       <Button size="small" color="orange" onClick={handleStopEditingItem}>
          //         Cancel
          //       </Button>
          //     </div>
          //   );
          // }
          const handleEdit = () => handleStartEditingItem(record);
          const handleCancel = () => handleCancelTx(record);

          const showCancel = ['Draft', 'Pending'].includes(record.statusName);
          const showEtherscan = !['Draft', 'Pending', 'Cancelled'].includes(record.statusName);

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
                  <a
                    href={`https://etherscan.io/tx/${record.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExportOutlined /> Etherscan
                  </a>
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
  }, [handleCancelTx, handleStartEditingItem]);

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
                <a
                  href={`https://etherscan.io/address/${conditionAsset}`}
                  title={assetName || conditionAsset}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <AssetSymbol name={assetName} address={conditionAsset} />
                </a>
              );
            }

            return <AssetSymbol name={assetName} address={conditionAsset} />;
          },
          // sorter: (a: IScheduledForUser, b: IScheduledForUser) =>
          //   (a.conditionAssetName || a.conditionAsset).localeCompare(b.conditionAssetName || b.conditionAsset),
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
          // sorter: (a: IScheduledForUser, b: IScheduledForUser) => {
          //   const aBN = BigNumber.from(a.conditionAmount || '0');
          //   const bBN = BigNumber.from(b.conditionAmount || '0');
          //   if (aBN.gt(bBN)) {
          //     return 1;
          //   }
          //   if (aBN.lt(bBN)) {
          //     return -1;
          //   }
          //   return 0;
          // },
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

            // return moment(new Date()).format('d/M/yyyy hh:mm a');
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
          // sorter: (a: IScheduledForUser, b: IScheduledForUser) => (a.timeCondition || 0) - (b.timeCondition || 0),
          title: 'Time Condition',
          align: 'right' as any,
        },
        // {
        //   dataIndex: 'gasPriceAware',
        //   render: (aware: boolean, record: IScheduledForUser) => {
        //     const isEditing = record.id === editingItem.id;

        //     const cb = (e: any) => setEditedGasPriceAware(e.target.checked);
        //     return <Checkbox defaultChecked={aware} disabled={!isEditing} onChange={cb} />;
        //   },
        //   sorter: (a: IScheduledForUser, b: IScheduledForUser) =>
        //     (a.gasPriceAware ? a.gasPriceAware : b.gasPriceAware) as any,
        //   title: 'Gas Price Aware?',
        // },
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
          // sorter: (a: IScheduledForUser, b: IScheduledForUser) => (a.notes || '').localeCompare(b.notes || ''),
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
          // sorter: (a: IScheduledForUser, b: IScheduledForUser) => (a.notes || '').localeCompare(b.notes || ''),
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

  useEffect(() => {
    refresh();
    // only execute once on load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <PageTitle title="Transactions" />
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
      <TableHeader>
        <Typography.Title className="title" level={4}>
          Transaction list
        </Typography.Title>
      </TableHeader>
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
        rowSelection={rowSelection}
        // pagination={paginationConfig}
        expandable={{
          expandedRowRender,
          expandIconColumnIndex: 1,
          expandedRowKeys,
          onExpandedRowsChange: handleExpandedRowKeysChange as any,
        }}
        loading={loading}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // onChange={handleTableChange as any}
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

const TableHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;

  .title {
    font-weight: 300;
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

export default Transactions;
