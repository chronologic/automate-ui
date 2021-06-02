import React from 'react';
import { Tooltip } from 'carbon-components-react';
import { QuestionCircleOutlined } from '@ant-design/icons';

interface IProps {
  first: number;
  last: number;
  text: string;
}

export default class SelectiveDisplay extends React.Component<IProps> {
  public render() {
    const { first, last, text } = this.props;

    return (
      <span>
        {text.slice(0, first)}...{text.slice(text.length - last, text.length)}
        &nbsp;
        <Tooltip
          showIcon={true}
          triggerText={''}
          renderIcon={QuestionCircleOutlined as any}
          triggerClassName="schedule-execute-tooltip-trigger"
        >
          {text}
        </Tooltip>
      </span>
    );
  }
}
