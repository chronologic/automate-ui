import { Button, Checkbox, DatePicker, Input, InputNumber, Layout, Select, Table, TimePicker } from 'antd';
// import { TablePaginationConfig } from 'antd/lib/table';
import * as moment from 'moment-timezone';
import queryString from 'query-string';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { IScheduledForUser, SentinelAPI } from '../../api/SentinelAPI';
import { bigNumberToNumber, formatLongId, numberToBn } from '../../utils';
// import TimeCondition from '../View/TimeCondition';

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

  //   const paginationConfig: TablePaginationConfig = useMemo(
  //     () => ({
  //       //   pageSizeOptions: ['10', '25', '50', '100'],
  //       showSizeChanger: false
  //       //   showTotal: (total: number, [from, to]: [number, number]) =>
  //       //     `${from}-${to} of ${total}`
  //     }),
  //     []
  //   );

  const handleStartEditingItem = useCallback((record: IScheduledForUser) => {
    setEditingItem(record);
    setEditedConditionAsset(record.conditionAsset);
    setEditedConditionAmount(record.conditionAmount);
    setEditedTimeCondition(record.timeCondition);
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

  const handleTimeCondtionDateChange = useCallback(
    date => {
      const dateStr = moment(date).format('YYYY.MM.DD');
      const timeStr = moment(editedTimeConditionTime).format('HH:mm');
      const newDate = moment(`${dateStr} ${timeStr}`, 'YYYY.MM.DD HH:mm')
        .toDate()
        .getTime();
      setEditedTimeConditionDate(date);
      setEditedTimeCondition(newDate);
    },
    [editedTimeConditionTime]
  );

  const handleTimeCondtionTimeChange = useCallback(
    time => {
      const timeStr = moment(time).format('HH:mm');
      const dateStr = moment(editedTimeConditionDate).format('YYYY.MM.DD');
      const newDate = moment(`${dateStr} ${timeStr}`, 'YYYY.MM.DD HH:mm')
        .toDate()
        .getTime();
      setEditedTimeConditionTime(time);
      setEditedTimeCondition(newDate);
    },
    [editedTimeConditionDate]
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
        sorter: true,
        title: 'ID'
      },
      {
        dataIndex: 'statusName',
        render: (status: string) => status,
        sorter: true,
        title: 'Status'
      },
      {
        dataIndex: 'from',
        render: (from: string) => (
          <a href={`https://etherscan.io/address/${from}`} title={from} target="_blank">
            {formatLongId(from)}
          </a>
        ),
        sorter: true,
        title: 'From'
      },
      {
        dataIndex: 'to',
        render: (to: string) => (
          <a href={`https://etherscan.io/address/${to}`} title={to} target="_blank">
            {formatLongId(to || '')}
          </a>
        ),
        sorter: true,
        title: 'To'
      },
      {
        dataIndex: 'assetName',
        render: (assetName: string) => (assetName || '').toUpperCase(),
        sorter: true,
        title: 'Asset'
      },
      {
        dataIndex: 'assetAmount',
        render: (assetAmount: string) => assetAmount,
        sorter: true,
        title: 'Amount'
      },
      {
        dataIndex: 'chainId',
        render: (chainId: string) => chainId,
        sorter: true,
        title: 'Chain ID'
      },
      {
        dataIndex: 'nonce',
        render: (nonce: string) => nonce,
        sorter: true,
        title: 'Nonce'
      },
      {
        dataIndex: 'gasPrice',
        render: (gasPrice: any) => bigNumberToNumber(gasPrice, 9),
        sorter: true,
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
        sorter: true,
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
        sorter: true,
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
                  defaultValue={timeConditionLocal as any}
                  onChange={handleTimeCondtionDateChange}
                />
                <br />
                <TimePicker
                  format={'hh:mm a'}
                  use12Hours={true}
                  defaultValue={timeConditionLocal as any}
                  onChange={handleTimeCondtionTimeChange}
                />
                <br />
                <Select
                  showSearch={true}
                  defaultValue={record.timeConditionTZ || moment.tz.guess()}
                  style={{ minWidth: '120px' }}
                  onChange={setEditedTimeConditionTZ as any}
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
        sorter: true,
        title: 'Time Condition'
      },
      {
        dataIndex: 'gasPriceAware',
        render: (aware: boolean, record: IScheduledForUser) => {
          const isEditing = record.id === editingItem.id;

          const cb = (e: any) => setEditedGasPriceAware(e.target.checked);
          return <Checkbox defaultChecked={aware} disabled={!isEditing} onChange={cb} />;
        },
        sorter: true,
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
  }, [editingItem, handleConditionAmountChange, handleSave]);

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
