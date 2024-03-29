import { useCallback, useEffect, useMemo, useState } from 'react';
import { Typography, Alert } from 'antd';
import styled from 'styled-components';
import queryString from 'query-string';

import { formatCurrency } from '../../utils';
import { IScheduledForUser } from '../../types';
import { useTransactions, useScreen, useAssetOptions, IAssetStorageItem, useAddAssetModal } from '../../hooks';
import { SCREEN_BREAKPOINT } from '../../constants';
import PageTitle from '../PageTitle';
import TransactionTable from './TransactionTable';
import TransactionList from './TransactionList';
import { useTxEdit } from './useTxEdit';
import TransactionTableWide from './TransactionTableWide';

interface IPaginationParams {
  current?: number;
  pageSize: number;
  showSizeChanger: boolean;
  total: number;
}
interface ISorterParams {
  field: string;
  order: string;
}

function Transactions() {
  const { isLg, isXxl } = useScreen();
  const { getList, editTx, cancelTx } = useTransactions();
  const { assetOptions, addAssets } = useAssetOptions();
  const addAssetModal = useAddAssetModal();
  const txEdit = useTxEdit();
  const txPerPage = 50;
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<IScheduledForUser[]>([]);
  const [total, setTotal] = useState(0);

  const apiKey = useMemo(() => {
    const queryParams = queryString.parseUrl(window.location.href);
    return queryParams.query?.apiKey as string;
  }, []);

  const totalGasSavings = useMemo(() => {
    return items.reduce((sum: any, item) => sum + (item.gasSaved || 0), 0);
  }, [items]);

  const pagination: IPaginationParams = useMemo(
    () => ({
      pageSize: txPerPage,
      showSizeChanger: false,
      total: total,
    }),
    [total]
  );

  const refresh = useCallback(
    async (pagination?: IPaginationParams, filters?, sorter?: ISorterParams, extra?) => {
      let currentPage = 1;
      let sortColumn = '';
      let sortDirection = '';

      if (sorter) {
        const sortResult = handleSort(sorter.field, sorter.order);
        sortColumn = sortResult.field;
        sortDirection = sortResult.order;
      }
      if (pagination) {
        currentPage = pagination.current!;
      }

      try {
        setLoading(true);

        const res = await getList(apiKey, {
          index: currentPage,
          size: txPerPage,
          sortCol: sortColumn,
          sortDir: sortDirection,
        });

        setTotal(res.total);
        setItems(res.items);

        const resAssetOptions: IAssetStorageItem[] = [
          ...res.items.map(
            (item) =>
              ({
                assetType: item.assetType,
                chainId: item.chainId,
                address: item.conditionAsset,
                decimals: item.conditionAssetDecimals,
                name: item.conditionAssetName,
              } as IAssetStorageItem)
          ),
          ...res.items.map(
            (item) =>
              ({
                assetType: item.assetType,
                chainId: item.chainId,
                address: item.assetContract,
                decimals: item.assetDecimals,
                name: item.assetName,
              } as IAssetStorageItem)
          ),
        ];
        addAssets(resAssetOptions);
      } finally {
        setLoading(false);
      }
    },
    [addAssets, apiKey, getList]
  );

  const handleSave = useCallback(async () => {
    try {
      setLoading(true);

      await editTx({
        request: {
          ...txEdit.tx!,
          paymentEmail: '',
          paymentRefundAddress: '',
        },
        queryParams: {
          apiKey,
        },
      });
      txEdit.stopEdit();

      refresh();
    } finally {
      setLoading(false);
    }
  }, [apiKey, editTx, refresh, txEdit]);

  const handleCancelTx = useCallback(
    async (record: IScheduledForUser) => {
      try {
        setLoading(true);

        await cancelTx({
          params: {
            id: record.id,
            key: record.txKey,
            createdAt: record.createdAt,
            paymentAddress: '',
          },
        });

        refresh();
      } finally {
        setLoading(false);
      }
    },
    [cancelTx, refresh]
  );

  const handleOpenAddAssetModal = useCallback(() => {
    addAssetModal.open({
      assetType: txEdit.tx?.assetType!,
      chainId: txEdit.tx?.chainId!,
      onSubmit: (asset) => {
        txEdit.updateTx({
          conditionAsset: asset.address,
          conditionAssetName: asset.name,
          conditionAssetDecimals: asset.decimals,
        });
      },
    });
  }, [addAssetModal, txEdit]);

  useEffect(() => {
    refresh();
    // only execute once on load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const transactionsComponent = (isXxl && (
    <TransactionTableWide
      assetOptions={assetOptions}
      items={items}
      loading={loading}
      editingItem={txEdit.tx}
      onStartEdit={txEdit.startEdit}
      onStopEdit={txEdit.stopEdit}
      onUpdateEditingItem={txEdit.updateTx}
      onSave={handleSave}
      onCancelTx={handleCancelTx}
      onOpenAddAssetModal={handleOpenAddAssetModal}
      onChange={refresh}
      pagination={pagination}
    />
  )) ||
    (isLg && (
      <TransactionTable
        assetOptions={assetOptions}
        items={items}
        loading={loading}
        editingItem={txEdit.tx}
        onStartEdit={txEdit.startEdit}
        onStopEdit={txEdit.stopEdit}
        onUpdateEditingItem={txEdit.updateTx}
        onSave={handleSave}
        onCancelTx={handleCancelTx}
        onOpenAddAssetModal={handleOpenAddAssetModal}
        onChange={refresh}
        pagination={pagination}
      />
    )) || <TransactionList items={items} loading={loading} />;

  return (
    <Container>
      <PageTitle title="Transactions" />
      {addAssetModal.modal}
      <HeaderContainer>
        <TableHeader>
          <Typography.Title className="title header" level={5}>
            Transaction list
          </Typography.Title>
          {/*
          <div className="savingsContainer">
            <Typography.Title className="title" level={5}>
              Total gas savings:
            </Typography.Title>
            <Typography.Title className="title savings" level={3}>
              {formatCurrency(totalGasSavings)}
            </Typography.Title>
          </div>
          */}
        </TableHeader>
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
      </HeaderContainer>
      <TableContainer>{transactionsComponent}</TableContainer>
    </Container>
  );
}

function handleSort(sortCol: string, sortOrder: string): ISorterParams {
  if (sortOrder) {
    return {
      field: sortCol,
      order: sortOrder + 'ing',
    };
  }
  return {
    field: '',
    order: '',
  };
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;

  .alert-txt {
    color: rgba(0, 0, 0, 0.85);
  }
`;

const HeaderContainer = styled.div`
  width: 100%;
  max-width: 1220px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
`;

const TableContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;

  .table {
    width: 100%;
  }

  .ant-table.ant-table-small .ant-table-thead > tr > th,
  .ant-table.ant-table-small .ant-table-tbody > tr > td {
    padding: 4px 4px;
  }
`;

const TableHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

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

  @media (max-width: ${SCREEN_BREAKPOINT.SM}px) {
    justify-content: center;
    margin-bottom: 16px;

    .title.header {
      display: none;
    }
  }
`;

export default Transactions;
