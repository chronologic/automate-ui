import { Helmet } from 'react-helmet';

interface IProps {
  title?: string;
}

function PageTitle({ title }: IProps) {
  return (
    <Helmet>
      <title>{title ? `${title} | ` : ''}ChronoLogic Automate</title>
    </Helmet>
  );
}

export default PageTitle;
