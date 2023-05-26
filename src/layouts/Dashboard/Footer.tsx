import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { __VERSION__ } from 'config';

const Footer = () => {
  return (
    <FooterRoot>
      <Typography variant="caption" sx={{ fontWeight: 500 }}>
        VTECH Ver {__VERSION__}
      </Typography>
    </FooterRoot>
  );
};

const FooterRoot = styled('footer')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.background.paper,
}));

export default Footer;
