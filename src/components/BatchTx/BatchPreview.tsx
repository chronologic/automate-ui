import { useMemo } from 'react';
import { Table, Typography } from 'antd';
import styled from 'styled-components';

import { IParsedColumn, useBatchParser } from './useBatchParser';
import { useBatchConfig } from './useBatchConfig';

function BatchPreview() {
  const { selectedColumns } = useBatchConfig();
  const { parsedTxs } = useBatchParser();

  const tableColumns = useMemo(() => {
    return selectedColumns.map((col) => ({
      title: col.label,
      key: col.name,
      dataIndex: col.name,
      render: (field: IParsedColumn) => <span>{field?.formattedValue}</span>,
    }));
  }, [selectedColumns]);

  const rowsWithKey = useMemo(() => {
    return parsedTxs.map((row, index) => ({
      key: index,
      ...row,
    }));
  }, [parsedTxs]);

  return (
    <Container>
      <Typography.Title level={4}>Preview</Typography.Title>
      <Table size="small" columns={tableColumns} dataSource={rowsWithKey} />
    </Container>
  );
}

const Container = styled.div``;

export default BatchPreview;
