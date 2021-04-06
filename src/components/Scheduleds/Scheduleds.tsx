import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseSquareOutlined,
  DeleteOutlined,
  FormOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { Button, Checkbox, DatePicker, Input, InputNumber, Layout, Modal, Select, Table, TimePicker } from 'antd';
import { ethers } from 'ethers';
import { BigNumber } from 'ethers/utils';
import uniqBy from 'lodash/uniqBy';
import * as moment from 'moment-timezone';
import queryString from 'query-string';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { IScheduledForUser, SentinelAPI } from '../../api/SentinelAPI';
import { TokenAPI } from '../../api/TokenAPI';
import { bigNumberToNumber, formatLongId, normalizeBigNumber, numberToBn } from '../../utils';
import { IAssetStorageItem } from './assetStorage';
import assetStorage from './assetStorage';

const queryParams = queryString.parseUrl(location.href);
const apiKey = queryParams.query.apiKey as string;

const { TextArea } = Input;

function Scheduleds() {
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

  const handleStartEditingItem = useCallback((record: IScheduledForUser) => {
    setEditingItem(record);
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
  }, []);

  const handleOpenAddAssetModal = useCallback(() => {
    setAddAssetModalVisible(true);
  }, []);

  const updateAssetOptions = useCallback(
    (newItems?: IScheduledForUser[]) => {
      const localItems = newItems || items;
      const uniqueAssets: IAssetStorageItem[] = uniqBy(
        [
          { address: '', name: 'ETH', decimals: 18 } as IAssetStorageItem,
          ...[
            ...assetStorage.getItems(),
            ...localItems.map(item => {
              return {
                address: item.conditionAsset,
                decimals: item.conditionAssetDecimals,
                name: item.conditionAssetName
              };
            }),
            ...localItems.map(item => {
              return {
                address: item.assetContract,
                decimals: item.assetDecimals,
                name: item.assetName
              };
            })
          ].filter(item => item.address && item.decimals && item.name)
        ],
        'address'
      );
      setAssetOptions(uniqueAssets);
    },
    [items]
  );

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const res = await SentinelAPI.getList(apiKey);
      setItems(res);
      updateAssetOptions(res);
    } finally {
      setLoading(false);
    }
  }, [updateAssetOptions]);

  const handleStopEditingItem = useCallback(() => {
    setEditingItem({} as any);
  }, []);

  const handleConditionAmountChange = useCallback(
    amount => {
      const newAmount = amount ? numberToBn(amount, editedConditionDecimals).toString() : '';
      setEditedConditionAmount(newAmount);
    },
    [editedConditionDecimals]
  );

  const handleConditionAssetChange = useCallback(
    (contractAddress: string, newAsset?: IAssetStorageItem) => {
      const asset = newAsset || assetOptions.find(a => a.address === contractAddress);
      setEditedConditionAsset(contractAddress);
      const oldDecimals = editedConditionDecimals;
      const newDecimals = asset?.decimals || 18;
      setEditedConditionDecimals(newDecimals);

      if (newDecimals !== oldDecimals) {
        const newAmount = normalizeBigNumber(new BigNumber(editedConditionAmount), oldDecimals, newDecimals).toString();
        setEditedConditionAmount(newAmount);
      }
    },
    [assetOptions, editedConditionDecimals, editedConditionAmount]
  );

  const handleTimeConditionDateChange = useCallback(
    date => {
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
    time => {
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
    tz => {
      setEditedTimeConditionTZ(tz);
      if (!editedTimeConditionTime || !tz || !editedTimeConditionDate) {
        setEditedTimeCondition(0);
      } else {
        const timeStr = moment(editedTimeConditionTime).format('HH:mm');
        const dateStr = moment(editedTimeConditionDate).format('YYYY.MM.DD');
        const newDate = moment
          .tz(`${dateStr} ${timeStr}`, 'YYYY.MM.DD HH:mm', tz)
          .toDate()
          .getTime();
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
      editedTimeConditionTZ
    });

    try {
      setLoading(true);

      await SentinelAPI.schedule(
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
          timeConditionTZ: editedTimeConditionTZ
        },
        {
          apiKey
        }
      );
      setEditingItem({} as any);

      refresh();
    } finally {
      setLoading(false);
    }
  }, [
    editedConditionAmount,
    editedConditionAsset,
    editedGasPriceAware,
    editedNotes,
    editedTimeCondition,
    editedTimeConditionTZ
  ]);

  const handleFetchAsset = useCallback(async (e: any) => {
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
  }, []);

  const handleAddAsset = useCallback(() => {
    const newAsset: IAssetStorageItem = {
      address: addAssetAddress,
      decimals: addAssetDecimals,
      name: addAssetName
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
      {
        dataIndex: 'id',
        render: (id: string, record: IScheduledForUser) => (
          <a href={`${window.location.origin}/view/${id}/${record.txKey}`} target="_blank">
            {formatLongId(id)}
          </a>
        ),
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => a.id.localeCompare(b.id),
        title: 'ID'
      },
      {
        dataIndex: 'statusName',
        render: (status: string, record: IScheduledForUser) => {
          let res = <span />;
          switch (status) {
            case 'Draft': {
              res = (
                <span style={{ color: 'blue' }}>
                  <FormOutlined /> {status}
                </span>
              );
              break;
            }
            case 'Pending': {
              res = (
                <span style={{ color: 'orange' }}>
                  <ClockCircleOutlined /> {status}
                </span>
              );
              break;
            }
            case 'Completed': {
              res = (
                <span style={{ color: 'green' }}>
                  <CheckCircleOutlined /> {status}
                </span>
              );
              break;
            }
            case 'Cancelled': {
              res = (
                <span style={{ color: 'gray' }}>
                  <DeleteOutlined /> {status}
                </span>
              );
              break;
            }
            case 'Error': {
              res = (
                <span style={{ color: 'red' }}>
                  <CloseSquareOutlined /> {status}
                </span>
              );
              break;
            }
            default: {
              res = <span>{status}</span>;
              break;
            }
          }

          return (
            <a href={`https://etherscan.io/tx/${record.transactionHash}`} target="_blank">
              {res}
            </a>
          );
        },
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => a.statusName.localeCompare(b.statusName),
        title: 'Status'
      },
      {
        dataIndex: 'from',
        render: (from: string) => (
          <a href={`https://etherscan.io/address/${from}`} title={from} target="_blank">
            {formatLongId(from)}
          </a>
        ),
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => a.from.localeCompare(b.from),
        title: 'From'
      },
      {
        dataIndex: 'to',
        render: (to: string) => (
          <a href={`https://etherscan.io/address/${to}`} title={to} target="_blank">
            {formatLongId(to || '')}
          </a>
        ),
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => (a.to || '').localeCompare(b.to || ''),
        title: 'To'
      },
      {
        dataIndex: 'assetName',
        render: (assetName: string, record: IScheduledForUser) => {
          const name = (assetName || '').toUpperCase();

          if (record.assetContract) {
            return (
              <a
                href={`https://etherscan.io/address/${record.assetContract}`}
                title={record.assetContract}
                target="_blank"
              >
                {name}
              </a>
            );
          }

          return name;
        },
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => (a.assetName || '').localeCompare(b.assetName || ''),
        title: 'Asset'
      },
      {
        dataIndex: 'assetAmount',
        render: (assetAmount: string) => assetAmount,
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => (a.assetAmount || 0) - (b.assetAmount || 0),
        title: 'Amount'
      },
      {
        dataIndex: 'chainId',
        render: (chainId: string) => chainId,
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => a.chainId - b.chainId,
        title: 'Chain ID'
      },
      {
        dataIndex: 'nonce',
        render: (nonce: string) => nonce,
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => a.nonce - b.nonce,
        title: 'Nonce'
      },
      {
        dataIndex: 'gasPrice',
        render: (gasPrice: any) => bigNumberToNumber(gasPrice, 9),
        sorter: (a: IScheduledForUser, b: IScheduledForUser) =>
          new ethers.utils.BigNumber(a.gasPrice || '0').gte(new ethers.utils.BigNumber(b.gasPrice || '0')) as any,
        title: 'Gas Price'
      },
      {
        dataIndex: 'conditionAsset',
        render: (conditionAsset: string, record: IScheduledForUser) => {
          const isEditing = record.id === editingItem.id;

          if (isEditing) {
            const handler = (value: string) => handleConditionAssetChange(value);
            return (
              <div>
                <Select value={editedConditionAsset} style={{ width: '100px' }} onChange={handler}>
                  {assetOptions.map(asset => (
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
              <a href={`https://etherscan.io/address/${conditionAsset}`} title={conditionAsset} target="_blank">
                {assetName || conditionAsset}
              </a>
            );
          }

          return assetName || '-';
        },
        sorter: (a: IScheduledForUser, b: IScheduledForUser) =>
          (a.conditionAssetName || a.conditionAsset).localeCompare(b.conditionAssetName || b.conditionAsset),
        title: 'Condition Asset'
      },
      {
        dataIndex: 'conditionAmount',
        render: (amount: string, record: IScheduledForUser) => {
          const isEditing = record.id === editingItem.id;

          const num = amount ? bigNumberToNumber(amount as any, record.conditionAssetDecimals) : '';

          if (isEditing) {
            const handler = (val: any) => handleConditionAmountChange(val);
            return <InputNumber min={0} defaultValue={num} onChange={handler} />;
          }

          return num;
        },
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => {
          const aBN = new ethers.utils.BigNumber(a.conditionAmount || '0');
          const bBN = new ethers.utils.BigNumber(b.conditionAmount || '0');
          if (aBN.gt(bBN)) {
            return 1;
          }
          if (aBN.lt(bBN)) {
            return -1;
          }
          return 0;
        },
        title: 'Condition Amount'
      },
      {
        dataIndex: 'timeCondition',
        render: (timeCondition: string, record: IScheduledForUser) => {
          const isEditing = record.id === editingItem.id;

          const hasTimeCondition = timeCondition && timeCondition !== '0';
          const timeConditionLocal = hasTimeCondition ? moment(timeCondition) : '';
          const timeConditionForTz = hasTimeCondition
            ? (timeConditionLocal as any).clone().tz(record.timeConditionTZ)
            : '';
          const timeConditionTime = timeConditionForTz || moment().startOf('day');

          if (isEditing) {
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
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => (a.timeCondition || 0) - (b.timeCondition || 0),
        title: 'Time Condition'
      },
      {
        dataIndex: 'gasPriceAware',
        render: (aware: boolean, record: IScheduledForUser) => {
          const isEditing = record.id === editingItem.id;

          const cb = (e: any) => setEditedGasPriceAware(e.target.checked);
          return <Checkbox defaultChecked={aware} disabled={!isEditing} onChange={cb} />;
        },
        sorter: (a: IScheduledForUser, b: IScheduledForUser) =>
          (a.gasPriceAware ? a.gasPriceAware : b.gasPriceAware) as any,
        title: 'Gas Price Aware?'
      },
      {
        dataIndex: 'notes',
        render: (notes: string, record: IScheduledForUser) => {
          const isEditing = record.id === editingItem.id;

          if (isEditing) {
            const cb = (e: any) => setEditedNotes(e.target.value);
            return <TextArea defaultValue={notes} onChange={cb} />;
          }

          return notes;
        },
        sorter: (a: IScheduledForUser, b: IScheduledForUser) => (a.notes || '').localeCompare(b.notes || ''),
        title: 'Notes'
      },
      {
        dataIndex: 'id',
        render: (id: string, record: IScheduledForUser) => {
          if (id === editingItem.id) {
            return (
              <div>
                <Button type="primary" size="small" color="green" onClick={handleSave}>
                  Save
                </Button>
                <Button size="small" color="orange" onClick={handleStopEditingItem}>
                  Cancel
                </Button>
              </div>
            );
          }
          const cb = () => handleStartEditingItem(record);
          return (
            <Button type="primary" size="small" color="blue" onClick={cb}>
              Edit
            </Button>
          );
        },
        title: ''
      }
    ];
  }, [
    editingItem,
    assetOptions,
    editedConditionAsset,
    handleOpenAddAssetModal,
    handleConditionAssetChange,
    handleConditionAmountChange,
    handleTimeConditionDateChange,
    handleTimeConditionTimeChange,
    handleTimeConditionTZChange,
    handleSave
  ]);

  useEffect(() => {
    refresh();
  }, []);

  return (
    <Layout>
      <Modal
        visible={addAssetModalVisible}
        onCancel={handleDismissAddAsset}
        onOk={handleAddAsset}
        confirmLoading={fetchingAsset}
        okButtonProps={{
          disabled: !addAssetName || !!addAssetError
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
        size="small"
        footer={
          (() => {
            '';
          }) as any
        }
        rowKey="id"
        columns={columns}
        dataSource={items}
        // pagination={paginationConfig}
        loading={loading}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // onChange={handleTableChange as any}
        pagination={{ defaultPageSize: 100, showSizeChanger: false }}
      />
    </Layout>
  );
}

export default Scheduleds;
