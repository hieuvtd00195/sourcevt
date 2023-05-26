import { Box, Card, Container, Divider, Link, Typography } from '@mui/material';
import Page from 'components/Page';
import RouteLink from 'components/core/RouteLink';
import { __TITLE__ } from 'config';
import LoginForm from './LoginForm';
import ImageLogo from 'components/ImageLogo';

const Login = () => {
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
                    src={'/logoCompany.png'}
                    style={{ width: 150, height: 'auto' }}
                  />
                </RouteLink>
                <Typography gutterBottom sx={{ mt: 1.5 }} style={{color: '#5C5C5C' , fontWeight: 500, fontSize: 24}}>
                  Đăng Nhập
                </Typography>
                {/* <Typography color="text.secondary" variant="body2">
                  Pro React Multitenant Admin Dashboard 
                </Typography> */}
              </Box>
              <Box sx={{ mt: 3 }}>
                <LoginForm />
              </Box>
              <Divider sx={{ my: 3 }} />
              {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <RouteLink
                  color="text.secondary"
                  variant="body2"
                  to="/auth/recovery"
                >
                  Forgot password?
                </RouteLink>
              </Box> */}
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
      {/* <Link color="inherit" href="https://sphinxjsc.com/">
        Sphinx JSC
      </Link>{' '} */}
      {new Date().getFullYear()}
      {/* {'.'} {`Handcrafted by Đức Lê ft. Hin.`} */}
    </Typography>
  );
};

export default Login;
