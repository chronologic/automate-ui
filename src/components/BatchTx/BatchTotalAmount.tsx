import { useMemo } from 'react';
import { Typography } from 'antd';
import styled from 'styled-components';

import { useBatchParser } from './useBatchParser';

function BatchTotalAmount() {
  const { parsedTxs } = useBatchParser();

  const rowsWithKey = useMemo(() => {
    let totalAmount = 0;
    for (let row of parsedTxs) {
      let amount = Number(row['amount']?.formattedValue.split(',').join('').split('$').join(''));
      totalAmount = totalAmount + amount;
    }

    return totalAmount;
  }, [parsedTxs]);

  return (
    <Container>
      <Typography.Title level={4}>Total Amount: {rowsWithKey}</Typography.Title>
    </Container>
  );
}

const Container = styled.div``;

export default BatchTotalAmount;
