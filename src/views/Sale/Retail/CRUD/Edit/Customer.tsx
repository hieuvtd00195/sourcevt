import CallIcon from '@mui/icons-material/Call';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import { Grid, InputAdornment } from '@mui/material';
import ProFormAutocomplete from 'components/ProForm/Label/ProFormAutocomplete';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormDate from 'components/ProForm/ProFormDate';
import EditIcon from '@mui/icons-material/Edit';

const Customer = () => {
  return (
    <Grid container spacing={2} sx={{ marginTop: 1, p: 1 }}>
      <Grid item xs={12} md={3}>
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
      <Grid item xs={12} md={3}>
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
      <Grid item xs={12} md={3}>
        <ProFormAutocomplete
          name="store"
          placeholder="Thành phố"
          options={[
            { value: 1, label: 'TM' },
            { value: 2, label: 'HN-1' },
            { value: 3, label: 'HN-2' },
            { value: 4, label: 'Sài Gòn' },
            { value: 5, label: 'VTech Thanh Hóa' },
          ]}
          renderLabel={(option) => option.label}
          renderValue={(option) => option.value}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <ProFormDate name="firstDate" type="start" />
      </Grid>
      <Grid item xs={12} md={3}>
        <ProFormTextField
          name="name"
          placeholder="Địa chỉ"
          multiline
          rows={2}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <HomeIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <ProFormTextField
          name="name"
          placeholder="Ghi chú"
          multiline
          rows={2}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EditIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </Grid>
  );
};

export default Customer;
