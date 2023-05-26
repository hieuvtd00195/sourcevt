import Container from '@mui/material/Container';
import type { ReactNode } from 'react';
import { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';

interface Props {
  title?: string;
  children: [ReactNode, ReactNode];
}

const PageWrapper = (props: Props) => {
  const { title = 'VSHIP', children } = props;

  return (
    <Fragment>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Container
        maxWidth="xxl"
        sx={{
          height: 1,
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
          pb: 3,
        }}
      >
        {children}
      </Container>
    </Fragment>
  );
};

export default PageWrapper;
