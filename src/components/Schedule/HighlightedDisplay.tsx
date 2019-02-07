import * as React from 'react';

interface IProps {
    first: number;
    last: number;
    color: string;
    text: string;
    fontWeight: number;
}

export default class HighlightedDisplay extends React.Component<IProps> {
    public render() {
        const { first, last, text, color, fontWeight } = this.props;

        const highlightStyle = { color, fontWeight };

        return <>
        <span style={highlightStyle}>{text.slice(0, first)}</span>
        <span>{text.slice(first, text.length - last)}</span>
        <span style={highlightStyle}>{text.slice(text.length - last, text.length)}</span>
        </>;
    }
}