import { useMemo } from 'react';
import ReactDragListView from 'react-drag-listview';
import { Checkbox } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import cn from 'classnames';

import { useBatchConfig } from './useBatchConfig';

function BatchTx() {
  const config = useBatchConfig();

  const dragProps = useMemo(() => {
    return {
      onDragEnd(fromIndex: number, toIndex: number) {
        const newSelectedColumns = [...config.selectedColumns];
        const item = newSelectedColumns.splice(fromIndex, 1)[0];
        newSelectedColumns.splice(toIndex, 0, item);
        config.selectColumns(newSelectedColumns);
      },
      nodeSelector: 'li',
      handleSelector: 'li.selected .dragger',
    };
  }, [config]);

  const columnNodes = useMemo(() => {
    return config.columns.map((item) => {
      const isSelected = config.selectedColumns.includes(item.name);
      const classNames = cn({ selected: isSelected, disabled: !isSelected });

      const handleChange = (e: any) => {
        let newSelectedColumns = [...config.selectedColumns];
        const { checked } = e.target;

        if (checked) {
          newSelectedColumns = newSelectedColumns.concat(item.name);
        } else {
          newSelectedColumns = newSelectedColumns.filter((name) => name !== item.name);
        }

        config.selectColumns(newSelectedColumns);
      };

      return (
        <li key={item.name} className={classNames}>
          <MenuOutlined className="dragger" />
          <span className="label">{item.label}</span>
          <Checkbox checked={isSelected} disabled={!item.canDeselect} onChange={handleChange} />
        </li>
      );
    });
  }, [config]);

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

export default BatchTx;
