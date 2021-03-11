import { Layout, Table } from 'antd';
// import { TablePaginationConfig } from 'antd/lib/table';
import queryString from 'query-string';
import React, {
  useEffect,
  // useMemo,
  useState
} from 'react';

import { IScheduledForUser, SentinelAPI } from '../../api/SentinelAPI';

const columns = [
  {
    dataIndex: 'id',
    render: (id: string, record: IScheduledForUser) => (
      <a
        href={`${window.location.origin}/view/${id}/${record.txKey}`}
        target="_blank"
      >
        {id}
      </a>
    ),
    sorter: true,
    title: 'ID'
  },
  {
    dataIndex: 'from',
    render: (from: string) => from,
    sorter: true,
    title: 'From'
  },
  {
    dataIndex: 'nonce',
    render: (nonce: string) => nonce,
    sorter: true,
    title: 'Nonce'
  },
  {
    dataIndex: 'chainId',
    render: (chainId: string) => chainId,
    sorter: true,
    title: 'Chain ID'
  },
  {
    dataIndex: 'statusName',
    render: (status: string) => status,
    sorter: true,
    title: 'Status'
  }
];

const queryParams = queryString.parseUrl(location.href);
const apiKey = queryParams.query.apiKey as string;

function Scheduleds() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<IScheduledForUser[]>([]);

  //   const paginationConfig: TablePaginationConfig = useMemo(
  //     () => ({
  //       //   pageSizeOptions: ['10', '25', '50', '100'],
  //       showSizeChanger: false
  //       //   showTotal: (total: number, [from, to]: [number, number]) =>
  //       //     `${from}-${to} of ${total}`
  //     }),
  //     []
  //   );

  useEffect(() => {
    fetchItems();

    async function fetchItems(): Promise<void> {
      try {
        setLoading(true);
        const res = await SentinelAPI.getList(apiKey);
        setItems(res);
      } finally {
        setLoading(false);
      }
    }
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
