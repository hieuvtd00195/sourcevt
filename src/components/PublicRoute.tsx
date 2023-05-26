import useAuth from 'hooks/useAuthState';
import { Fragment } from 'react';
import { Navigate } from 'react-router-dom';
import type { FCC } from 'types/react';

const PublicRoute: FCC = (props) => {
  const { children } = props;
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <Fragment>{children}</Fragment>;
};

export default PublicRoute;
