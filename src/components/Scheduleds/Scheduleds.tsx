import { CheckCircleOutlined, ClockCircleOutlined, CloseSquareOutlined, FormOutlined } from '@ant-design/icons';
import { Button, Checkbox, DatePicker, Input, InputNumber, Layout, Select, Table, TimePicker } from 'antd';
import { ethers } from 'ethers';
import * as moment from 'moment-timezone';
import queryString from 'query-string';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { IScheduledForUser, SentinelAPI } from '../../api/SentinelAPI';
import { bigNumberToNumber, formatLongId, numberToBn } from '../../utils';

const queryParams = queryString.parseUrl(location.href);
const apiKey = queryParams.query.apiKey as string;

const { TextArea } = Input;

function Scheduleds() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<IScheduledForUser[]>([]);
  const [editingItem, setEditingItem] = useState<IScheduledForUser>({} as any);
  const [editedConditionAsset, setEditedConditionAsset] = useState('');
  const [editedConditionAmount, setEditedConditionAmount] = useState('');
  const [editedTimeConditionDate, setEditedTimeConditionDate] = useState();
  const [editedTimeConditionTime, setEditedTimeConditionTime] = useState();
  const [editedTimeCondition, setEditedTimeCondition] = useState(0);
  const [editedTimeConditionTZ, setEditedTimeConditionTZ] = useState('');
  const [editedGasPriceAware, setEditedGasPriceAware] = useState(false);
  const [editedNotes, setEditedNotes] = useState<string>('');

  const handleStartEditingItem = useCallback((record: IScheduledForUser) => {
    setEditingItem(record);
    setEditedConditionAsset(record.conditionAsset);
    setEditedConditionAmount(record.conditionAmount);
    setEditedTimeCondition(record.timeCondition);
    if (record.timeCondition && record.timeConditionTZ) {
      const date = moment.tz(record.timeCondition, record.timeConditionTZ);
      setEditedTimeConditionDate(date as any);
      setEditedTimeConditionTime(date as any);
    }
    setEditedTimeConditionTZ(record.timeConditionTZ);
    setEditedNotes(record.notes);
    setEditedGasPriceAware(record.gasPriceAware);
  }, []);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const res = await SentinelAPI.getList(apiKey);
      setItems(res);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleStopEditingItem = useCallback(() => {
    setEditingItem({} as any);
  }, []);

  const handleConditionAmountChange = useCallback(amount => {
    setEditedConditionAmount(amount ? numberToBn(amount).toString() : '');
  }, []);

  const handleTimeConditionDateChange = useCallback(
    date => {
      setEditedTimeConditionDate(date);
      // const c = console;
      // c.log(editedTimeConditionTime, date, editedTimeConditionTZ);
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
        render: (status: string) => {
          switch (status) {
            case 'Draft': {
              return (
                <span style={{ color: 'blue' }}>
                  <FormOutlined /> {status}
                </span>
              );
            }
            case 'Pending': {
              return (
                <span style={{ color: 'orange' }}>
                  <ClockCircleOutlined /> {status}
                </span>
              );
            }
            case 'Completed': {
              return (
                <span style={{ color: 'green' }}>
                  <CheckCircleOutlined /> {status}
                </span>
              );
            }
            case 'Error': {
              return (
                <span style={{ color: 'red' }}>
                  <CloseSquareOutlined /> {status}
                </span>
              );
            }
            default: {
              return status;
            }
          }
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
        render: (assetName: string) => (assetName || '').toUpperCase(),
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
            return <Input defaultValue={conditionAsset} />;
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
        sorter: (a: IScheduledForUser, b: IScheduledForUser) =>
          new ethers.utils.BigNumber(a.conditionAsset || '0').gte(
            new ethers.utils.BigNumber(b.conditionAsset || '0')
          ) as any,
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
                  defaultValue={timeConditionForTz as any}
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
      />
    </Layout>
  );
}

export default Scheduleds;
