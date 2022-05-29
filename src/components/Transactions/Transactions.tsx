import { useCallback, useEffect, useMemo, useState } from 'react';
import { Typography, Alert } from 'antd';
import uniqBy from 'lodash/uniqBy';
import styled from 'styled-components';

import { formatCurrency } from '../../utils';
import { IScheduledForUser } from '../../types';
import { IAssetStorageItem } from './assetStorage';
import assetStorage from './assetStorage';
import { useTransactions, useScreen } from '../../hooks';
import PageTitle from '../PageTitle';
import TransactionTable from './TransactionTable';
import TransactionList from './TransactionList';
import { MOBILE_SCREEN_THRESHOLD } from '../../constants';

function Transactions() {
  const { isSmall } = useScreen();
  const { getList, editTx, cancelTx } = useTransactions();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<IScheduledForUser[]>([]);
  const [assetOptions, setAssetOptions] = useState<IAssetStorageItem[]>([]);

  const totalGasSavings = useMemo(() => {
    return items.reduce((sum: any, item) => sum + (item.gasSaved || 0), 0);
  }, [items]);

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

  useEffect(() => {
    refresh();
    // only execute once on load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <PageTitle title="Transactions" />
      <TableHeader>
        <Typography.Title className="title header" level={5}>
          Transaction list
        </Typography.Title>
        <Alert
          message={
            <Typography.Text className="alert-txt">
              These are the transactions that you scheduled using the{' '}
              <a
                href="https://blog.chronologic.network/how-to-sign-up-to-automate-and-claim-your-magic-rewards-cf67fca1ddb3"
                target="_blank"
                rel="noreferrer"
              >
                Automate Network in MetaMask
              </a>
            </Typography.Text>
          }
          type="warning"
          showIcon
          closable
        />
        <div className="savingsContainer">
          <Typography.Title className="title" level={5}>
            Total gas savings:
          </Typography.Title>
          <Typography.Title className="title savings" level={3}>
            {formatCurrency(totalGasSavings)}
          </Typography.Title>
        </div>
      </TableHeader>
      {isSmall ? (
        <TransactionList items={items} loading={loading} />
      ) : (
        <TransactionTable
          assetOptions={assetOptions}
          items={items}
          loading={loading}
          onCancelTx={handleCancelTx}
          onEditTx={editTx}
          onRefresh={refresh}
          onSetLoading={setLoading}
          onUpdateAssetOptions={updateAssetOptions}
        />
      )}
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
  @media (max-width: ${MOBILE_SCREEN_THRESHOLD}px) {
    .alert-txt {
      display: none;
    }
  }
  .alert-txt {
    color: rgba(0, 0, 0, 0.85);
  }
`;

const TableHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;

  .title.title {
    font-weight: 300;
    margin-top: 0;
  }
  .savingsContainer {
    display: flex;
    flex-direction: row;
    align-items: baseline;
  }
  .savings {
    margin-left: 8px;
    color: ${(props) => props.theme.colors.accent};
  }

  @media (max-width: ${MOBILE_SCREEN_THRESHOLD}px) {
    justify-content: center;
    margin-bottom: 16px;

    .title.header {
      display: none;
    }
  }
`;

export default Transactions;
