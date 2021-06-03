import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { useAuth } from '../../hooks';
import { IThemeProps } from '../../types';

function HeaderMain() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Container>
      {(isAuthenticated && <div>{user.email}</div>) || (
        <Link to="/">
          Log in
          {/* Log in/Sign up */}
        </Link>
      )}
    </Container>
  );
}

const Container = styled.div`
  color: ${(props: IThemeProps) => props.theme.colors.accent};
  margin-right: 40px;
`;

export default HeaderMain;
