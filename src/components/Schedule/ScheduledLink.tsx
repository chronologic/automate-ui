import * as React from 'react';
import { Link } from 'react-router-dom';

interface IScheduledLinkProps {
  id: string;
  signature: string;
  label?: string;
}

const ScheduledLink: React.FunctionComponent<IScheduledLinkProps> = ({
  id,
  signature,
  label
}) => {
  const link = `view/${id}/${signature}`;
  const labelNode = label || window.location.href + link;

  return (
    <Link to={link} target="_blank">
      <span className="scheduled-link">{labelNode}</span>
    </Link>
  );
};

export default ScheduledLink;
