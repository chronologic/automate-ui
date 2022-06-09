import { Button, Checkbox, Dropdown, Input, InputNumber, Menu, Popconfirm, Tooltip } from 'antd';
import { BigNumber, ethers } from 'ethers';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  DeleteOutlined,
  MoreOutlined,
  EditOutlined,
  ExportOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import debounce from 'lodash/debounce';

import { IScheduledForUser, Status } from '../../types';
import { BlockExplorerName, BlockExplorerUrl, ChainId } from '../../constants';
import { formatCurrency, formatNumber, shortId } from '../../utils';
import { IAssetStorageItem } from '../../hooks';
import LabelTag from '../LabelTag';
import AssetSymbolLink from './AssetSymbolLink';
import BlockExplorerLink from './BlockExplorerLink';
import TxStatus from './TxStatus';
import { canEditTx, UpdateTx } from './useTxEdit';
import ConditionAsset from './ConditionAsset';
import TimeCondition from './TimeCondition';

const { TextArea } = Input;

export function id() {
  return {
    dataIndex: 'id',
    render: (id: string, record: IScheduledForUser) => (
      <a href={`${window.location.origin}/view/${id}/${record.txKey}`} target="_blank" rel="noopener noreferrer">
        {shortId(id)}
      </a>
    ),
    sorter: (a: IScheduledForUser, b: IScheduledForUser) => a.id.localeCompare(b.id),
    title: 'ID',
    align: 'center' as any,
  };
}

export function status() {
  return {
    dataIndex: 'statusName',
    render: (status: string, record: IScheduledForUser) => {
      return <TxStatus status={status} txHash={record.transactionHash} chainId={record.chainId} />;
    },
    sorter: (a: IScheduledForUser, b: IScheduledForUser) => a.statusName.localeCompare(b.statusName),
    title: 'Status',
    align: 'center' as any,
  };
}

export function from() {
  return {
    dataIndex: 'from',
    render: (from: string, record: IScheduledForUser) => (
      <BlockExplorerLink hash={from} label={record.fromLabel} chainId={record.chainId} type={'address'} />
    ),
    sorter: (a: IScheduledForUser, b: IScheduledForUser) => a.from.localeCompare(b.from),
    title: 'From',
    align: 'center' as any,
  };
}

export function to() {
  return {
    dataIndex: 'to',
    render: (to: string, record: IScheduledForUser) => (
      <BlockExplorerLink hash={to} label={record.toLabel} chainId={record.chainId} type={'address'} />
    ),
    sorter: (a: IScheduledForUser, b: IScheduledForUser) => (a.to || '').localeCompare(b.to || ''),
    title: 'To',
    align: 'center' as any,
  };
}

export function method() {
  return {
    dataIndex: 'method',
    render: (method: string, record: IScheduledForUser) => <LabelTag raw={method} label={record.methodLabel} />,
    sorter: (a: IScheduledForUser, b: IScheduledForUser) => (a.methodLabel || '').localeCompare(b.methodLabel || ''),
    title: 'Method',
    align: 'center' as any,
  };
}

export function chainId() {
  return {
    dataIndex: 'chainId',
    render: (chainId: string) => chainId,
    sorter: (a: IScheduledForUser, b: IScheduledForUser) => a.chainId - b.chainId,
    title: 'Chain ID',
    align: 'center' as any,
  };
}

export function assetName() {
  return {
    dataIndex: 'assetName',
    render: (assetName: string, record: IScheduledForUser) => {
      return <AssetSymbolLink assetName={assetName} assetContract={record.assetContract} chainId={record.chainId} />;
    },
    sorter: (a: IScheduledForUser, b: IScheduledForUser) => (a.assetName || '').localeCompare(b.assetName || ''),
    title: 'Asset',
    align: 'center' as any,
  };
}

export function assetAmount() {
  return {
    dataIndex: 'assetAmount',
    render: (assetAmount: number) => formatNumber(assetAmount),
    sorter: (a: IScheduledForUser, b: IScheduledForUser) => (a.assetAmount || 0) - (b.assetAmount || 0),
    title: 'Amount',
    align: 'right' as any,
  };
}

export function nonce() {
  return {
    dataIndex: 'nonce',
    render: (nonce: string) => nonce,
    sorter: (a: IScheduledForUser, b: IScheduledForUser) => a.nonce - b.nonce,
    title: 'Nonce',
    align: 'right' as any,
  };
}

export function conditionAsset({
  assetOptions,
  editingItem,
  onUpdateEditingItem,
  onOpenAddAssetModal,
}: {
  assetOptions: IAssetStorageItem[];
  editingItem?: IScheduledForUser;
  onUpdateEditingItem: UpdateTx;
  onOpenAddAssetModal: () => void;
}) {
  return {
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
  };
}

export function conditionAmount({
  editingItem,
  onUpdateEditingItem,
}: {
  editingItem?: IScheduledForUser;
  onUpdateEditingItem: UpdateTx;
}) {
  return {
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
  };
}

export function timeCondition({
  editingItem,
  onUpdateEditingItem,
}: {
  editingItem?: IScheduledForUser;
  onUpdateEditingItem: UpdateTx;
}) {
  return {
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
  };
}

export function notes({
  editingItem,
  onUpdateEditingItem,
}: {
  editingItem?: IScheduledForUser;
  onUpdateEditingItem: UpdateTx;
}) {
  return {
    key: 'notes',
    dataIndex: 'notes',
    render: (notes: string, record: IScheduledForUser) => {
      const isEditing = record.id === editingItem?.id;

      if (isEditing) {
        const changeHandler = debounce((e: any) => onUpdateEditingItem({ notes: e.target.value }), 300);
        return <TextArea defaultValue={notes} onChange={changeHandler} />;
      }

      return notes;
    },
    title: 'Notes',
    align: 'left' as any,
  };
}

export function extra() {
  return {
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
  };
}

export function actionsInEditMode({
  editingItem,
  onSave,
  onStopEdit,
}: {
  editingItem?: IScheduledForUser;
  onSave: () => void;
  onStopEdit: () => void;
}) {
  return {
    key: 'actions',
    dataIndex: 'id',
    render: (id: string, record: IScheduledForUser) => {
      if (id === editingItem?.id) {
        return (
          <div>
            <Button type="primary" color="green" onClick={onSave}>
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
  };
}

export function gasPrice() {
  return {
    dataIndex: 'gasPrice',
    render: (gasPrice: any) => formatNumber(Number(ethers.utils.formatUnits(gasPrice || '0', 9)), 4),
    sorter: (a: IScheduledForUser, b: IScheduledForUser) =>
      BigNumber.from(a.gasPrice || '0').gte(BigNumber.from(b.gasPrice || '0')) as any,
    title: 'Gas Price',
    align: 'right' as any,
  };
}

export function gasPriceAware({
  editingItem,
  onUpdateEditingItem,
}: {
  editingItem?: IScheduledForUser;
  onUpdateEditingItem: UpdateTx;
}) {
  return {
    dataIndex: 'gasPriceAware',
    render: (aware: boolean, record: IScheduledForUser) => {
      const isEditing = record.id === editingItem?.id;
      const checked = isEditing ? editingItem.gasPriceAware : aware;

      const changeHandler = (e: any) => onUpdateEditingItem({ gasPriceAware: e.target.checked });
      return <Checkbox checked={checked} disabled={!isEditing} onChange={changeHandler} />;
    },
    sorter: (a: IScheduledForUser, b: IScheduledForUser) =>
      (a.gasPriceAware ? a.gasPriceAware : b.gasPriceAware) as any,
    title: 'Gas Price Aware?',
    align: 'center' as any,
  };
}

export function gasPaid() {
  return {
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
  };
}

export function gasSaved() {
  return {
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
  };
}

export function actionsDropdown({
  onStartEdit,
  onCancelTx,
}: {
  onStartEdit: (item: IScheduledForUser) => void;
  onCancelTx: (item: IScheduledForUser) => void;
}) {
  return {
    dataIndex: 'id',
    render: (id: string, record: IScheduledForUser) => {
      const handleEdit = () => onStartEdit(record);
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
  };
}

const Actions = styled.div`
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.colors.accent};
  }

  .anticon {
    font-size: 2.6rem;
  }
`;

export function actionButtons({
  editingItem,
  onStartEdit,
  onCancelTx,
  onSave,
  onStopEdit,
}: {
  editingItem?: IScheduledForUser;
  onStartEdit: (item: IScheduledForUser) => void;
  onCancelTx: (item: IScheduledForUser) => void;
  onSave: () => void;
  onStopEdit: () => void;
}) {
  return {
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
      const editHandler = () => onStartEdit(record);
      const cancelHandler = () => onCancelTx(record);

      const isStatusCancelled = record.status === Status['Cancelled'];
      return (
        <>
          <Button type="primary" size="small" color="blue" onClick={editHandler} style={{ marginRight: '8px' }}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to cancel this transaction?"
            onConfirm={cancelHandler}
            okText="Yes"
            cancelText="No"
            placement="topRight"
          >
            {!isStatusCancelled && <Button size="small" icon={<DeleteOutlined />} title="Cancel" />}
          </Popconfirm>
        </>
      );
    },
    title: '',
  };
}
