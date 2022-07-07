import { useMemo } from 'react';
import { Typography } from 'antd';
import styled from 'styled-components';

import { useBatchParser } from './useBatchParser';
import { useBatchConfig } from './useBatchConfig';

function BatchTotalAmount() {
  const { parsedTxs } = useBatchParser();
  const { selectedAsset } = useBatchConfig();

  const calcTotalAmount = useMemo(() => {
    let totalAmount = 0;
    for (let row of parsedTxs) {
      let amount = Number(row.amount?.parsedValue!);
      totalAmount = totalAmount + Number(amount);
    }
    totalAmount = totalAmount / Math.pow(10, selectedAsset?.decimals!);

    return totalAmount;
  }, [parsedTxs, selectedAsset]);

  return (
    <Container>
      <Typography.Title level={4}>Total Amount: {calcTotalAmount}</Typography.Title>
    </Container>
  );
}

const Container = styled.div``;

export default BatchTotalAmount;
