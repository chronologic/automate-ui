import { Card } from 'antd';
import styled from 'styled-components';

import { formatCurrency, formatNumber } from '../../utils';
import { IScheduledForUser } from '../../types';
import { BlockExplorerLink } from '../Transactions';
import TxStatus from './TxStatus';
import AssetSymbolLink from './AssetSymbolLink';

interface IProps {
  items: IScheduledForUser[];
  loading: boolean;
  // assetOptions: IAssetStorageItem[];
  // onCancelTx: (record: IScheduledForUser) => void;
}

function TransactionList({ items }: IProps) {
  return (
    <Container>
      {items.map((item) => (
        <TransactionListItem key={item.id} item={item} />
      ))}
    </Container>
  );
}

interface IListItemProps {
  item: IScheduledForUser;
}

function TransactionListItem({ item }: IListItemProps) {
  const title = (
    <div className="header">
      <AssetSymbolLink assetName={item.assetName} assetContract={item.assetContract} chainId={item.chainId} />
      <TxStatus status={item.statusName} txHash={item.transactionHash} chainId={item.chainId} />
    </div>
  );
  return (
    <ItemContainer>
      <Card title={title}>
        <div className="row">
          <div className="label">Amount</div>
          <div className="value">{formatNumber(item.assetAmount)}</div>
        </div>
        <div className="row">
          <div className="label">From</div>
          <div className="value">
            <BlockExplorerLink hash={item.from} chainId={item.chainId} type={'address'} />
          </div>
        </div>
        <div className="row">
          <div className="label">To</div>
          <div className="value">
            <BlockExplorerLink hash={item.to} chainId={item.chainId} type={'address'} />
          </div>
        </div>
        <div className="row">
          <div className="label">Gas Paid</div>
          <div className="value">{formatCurrency(item.gasPaid)}</div>
        </div>
        <div className="row">
          <div className="label">Gas Saved</div>
          <div className="value">{formatCurrency(item.gasSaved)}</div>
        </div>
      </Card>
    </ItemContainer>
  );
}

const Container = styled.div`
  width: 100%;
  padding: 40px 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin: 0 auto;

  .table {
    width: 100%;
  }
`;

const ItemContainer = styled.div`
  margin: 8px;

  .ant-card {
    min-width: 200px;
  }

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }
  .label {
    margin-right: 8px;
  }
`;

export default TransactionList;
