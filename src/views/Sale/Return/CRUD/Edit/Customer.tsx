import CallIcon from '@mui/icons-material/Call';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MarkunreadIcon from '@mui/icons-material/Markunread';
import PersonIcon from '@mui/icons-material/Person';
import { Grid, InputAdornment } from '@mui/material';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';

const Customer = () => {
  return (
    <Grid container spacing={2} sx={{ marginTop: 1, paddingBottom: 1 }}>
      <Grid item xs={12} md={6}>
        <ProFormTextField
          name="name"
          placeholder="Họ tên"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <ProFormTextField
          name="name"
          placeholder="Địa chỉ"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CreditCardIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <ProFormTextField
          name="name"
          placeholder="Số điện thoại"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CallIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </Grid>
  );
};

export default Customer;
