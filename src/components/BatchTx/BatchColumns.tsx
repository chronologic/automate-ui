import { useMemo } from 'react';
import ReactDragListView from 'react-drag-listview';
import { Checkbox } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import cn from 'classnames';

import { useBatchConfig } from './useBatchConfig';

function BatchColumns() {
  const { columns, selectedColumns, selectColumns } = useBatchConfig();

  const dragProps = useMemo(() => {
    return {
      onDragEnd(fromIndex: number, toIndex: number) {
        const newSelectedColumns = [...selectedColumns];
        const item = newSelectedColumns.splice(fromIndex, 1)[0];
        newSelectedColumns.splice(toIndex, 0, item);
        selectColumns(newSelectedColumns.map((col) => col.name));
      },
      nodeSelector: 'li',
      handleSelector: 'li.selected .dragger',
    };
  }, [selectColumns, selectedColumns]);

  const columnNodes = useMemo(() => {
    return columns.map((item) => {
      const isSelected = !!selectedColumns.find((col) => col.name === item.name);
      const classNames = cn({ selected: isSelected, disabled: !isSelected });

      const handleChange = (e: any) => {
        let newSelectedColumns = [...selectedColumns];
        const { checked } = e.target;

        if (checked) {
          newSelectedColumns = newSelectedColumns.concat(item);
        } else {
          newSelectedColumns = newSelectedColumns.filter((col) => col.name !== item.name);
        }

        selectColumns(newSelectedColumns.map((col) => col.name));
      };

      return (
        <li key={item.name} className={classNames}>
          <MenuOutlined className="dragger" />
          <span className="label">{item.label}</span>
          <Checkbox checked={isSelected} disabled={!item.canDeselect} onChange={handleChange} />
        </li>
      );
    });
  }, [columns, selectColumns, selectedColumns]);

  return (
    <Container>
      <ReactDragListView {...dragProps}>
        <ul>{columnNodes}</ul>
      </ReactDragListView>
    </Container>
  );
}

const Container = styled.div`
  ul {
    list-style-type: none;
    display: flex;

    li {
      padding: 8px;
      border: 1px solid ${(props) => props.theme.colors.border};
      display: flex;
      align-items: center;

      .label {
        transition: opacity 0.2s ease;
        margin-right: 8px;
      }

      .dragger {
        cursor: pointer;
        margin-right: 8px;
        font-size: 2rem;
        color: ${(props) => props.theme.colors.accent};
        transition: opacity 0.2s ease;
      }

      &.disabled {
        .label {
          opacity: 0.5;
        }
        .dragger {
          cursor: not-allowed;
          opacity: 0.3;
          color: ${(props) => props.theme.colors.text};
        }
      }
    }
  }
`;

export default BatchColumns;
