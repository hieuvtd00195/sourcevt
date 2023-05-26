import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PersonIcon from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { Grid, InputAdornment } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';

const Information = () => {
  return (
    <Box
      sx={{
        border: '1px solid #E6E8F0',
        marginBottom: '10px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px 15px',
        }}
      >
        <Box sx={{ display: 'flex' }}>
          <ErrorOutlineOutlinedIcon />
          <span
            style={{
              fontWeight: 'bold',
              display: 'inline-block',
              marginLeft: '10px',
            }}
          >
            Thông tin
          </span>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <StorefrontIcon sx={{ marginRight: '5px' }} />
          Linh kiện sài gòn
        </Box>
      </Box>
      <Box>
        <Divider />
      </Box>
      <Box sx={{ padding: '15px' }}>
        <Grid container>
          <ProFormTextField
            sx={{ marginBottom: 1 }}
            name="customer"
            placeholder={'Nhân viên bán hàng'}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />
          <ProFormTextField
            sx={{ marginBottom: 1 }}
            name="customer"
            placeholder={'Nhân viên kỹ thuật'}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />
          <ProFormTextField
            name="customer"
            placeholder={'Ghi chú'}
            InputLabelProps={{ shrink: true }}
            multiline
            rows={3}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EventNoteIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Box>
    </Box>
  );
};

export default Information;
