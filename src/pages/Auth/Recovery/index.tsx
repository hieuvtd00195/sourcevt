import { Box, Card, Container, Divider, Link, Typography } from '@mui/material';
// import Logo from 'components/core/Logo';
import Page from 'components/Page';
import RouteLink from 'components/core/RouteLink';
import { __TITLE__ } from 'config';
import RecoveryForm from './RecoveryForm';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ImageLogo from 'components/ImageLogo';

const Recovery = () => {
  return (
    <Page title="Login">
      <Box
        sx={{
          backgroundColor: 'background.default',
          flexGrow: 1,
          display: 'grid',
          gridTemplateRows: '1fr auto',
          gap: 3,
          p: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Container maxWidth="sm">
            <Card elevation={16} sx={{ p: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <RouteLink to="/">
                  <ImageLogo
                    src={'/logo.png'}
                    style={{ width: 75, height: 'auto' }}
                  />
                </RouteLink>
                <Typography variant="h4" gutterBottom sx={{ mt: 1.5 }}>
                  Forgot Password?
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Enter your email and we′ll send you instructions to reset your
                  password
                </Typography>
              </Box>
              <Box sx={{ mt: 3 }}>
                <RecoveryForm />
              </Box>
              <Divider sx={{ my: 3 }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <RouteLink
                  color="text.secondary"
                  variant="body2"
                  to="/auth/login"
				  style={{display: 'flex', textAlign: 'center'}}
                >
                 <ArrowBackIosIcon /> Back to login
                </RouteLink>
              </Box>
            </Card>
          </Container>
        </Box>
        <Copyright />
      </Box>
    </Page>
  );
};

const Copyright = () => {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://sphinxjsc.com/">
        Sphinx JSC
      </Link>{' '}
      {new Date().getFullYear()}
      {/* {'.'} {`Handcrafted by Đức Lê ft. Hin.`} */}
    </Typography>
  );
};

export default Recovery;
