import { Tag } from 'antd';

interface IProps {
  raw: string;
  label?: string;
}

function LabelTag({ raw, label }: IProps) {
  if (label) {
    return <Tag title={raw}>{label}</Tag>;
  }

  return <span>{raw || '-'}</span>;
}

export default LabelTag;
