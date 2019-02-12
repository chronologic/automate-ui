import * as React from 'react';

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
      </span>
    );
  }
}
