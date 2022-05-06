import React from 'react';
import { Card } from 'antd';
import { BlockOutlined } from '@ant-design/icons';
import styled from 'styled-components';

interface IProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

function BaseBlock({ title, children }: IProps) {
  return (
    <Container>
      <Card hoverable title={title} extra={<BlockOutlined />}>
        {children}
      </Card>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: 0 auto;

  .ant-card {
    border: none;
    background-color: rgb(245 245 245 / 5%);
  }

  .ant-typography.ant-typography-secondary {
    color: rgb(255 255 255 / 45%);
  }

  .ant-card-head {
    color: white;
  }

  .secondary {
    color: rgb(255 255 255 / 45%);
  }

  .ant-card-extra {
    color: rgb(255 255 255 / 25%);
    font-size: 18px;
  }

  .cardTitle {
    margin-left: 10px;
  }
`;

export default BaseBlock;
