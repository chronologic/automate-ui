import React from 'react';
import { Card } from 'antd';
import { BlockOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import { IThemeProps } from '../../../types';

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
  max-width: 1220px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;

  .outer {
    border: 1px solid ${(props: IThemeProps) => props.theme.colors.accent};
    border-radius: 2px;
  }

  .inner {
    padding: 10px 10px 20px;
  }

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

  .ant-card-body {
    display: flex;
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
