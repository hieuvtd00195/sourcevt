import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import { Grid, InputAdornment } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ProFormSelect from 'components/ProForm/ProFormSelect';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import { PriceInput } from 'plugins/NumberFormat';
import { useState } from 'react';

interface ICheckShow {
  tienMat: boolean;
  chuyenKhoan: boolean;
  tienKhachDua: boolean;
}

const Payment = () => {
  // const [collapse, setCollapse] = useState<boolean>(false);
  const [checkShow, setCheckShow] = useState<ICheckShow>({
    tienMat: false,
    chuyenKhoan: false,
    tienKhachDua: false,
  });

  const handleClickShowInput = (type: string) => {
    if (!type) return;
    if (type === 'tienMat') {
      setCheckShow({ ...checkShow, tienMat: !checkShow.tienMat });
      return;
    }
    if (type === 'chuyenKhoan') {
      setCheckShow({ ...checkShow, chuyenKhoan: !checkShow.chuyenKhoan });
    }
  };

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
          padding: '10px 15px',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex' }}>
          <MoneyOutlinedIcon />
          <span
            style={{
              fontWeight: 'bold',
              display: 'inline-block',
              marginLeft: '10px',
            }}
          >
            Thanh toán
          </span>
        </Box>
      </Box>
      <Box>
        <Divider />
      </Box>

      <Grid
        container
        sx={{
          padding: '5px 15px',
        }}
      >
        {/* quỹ tiền mặt */}
        <Grid
          xs={12}
          container
          item
          md={12}
          sx={{ marginBottom: 1, marginTop: 1 }}
          spacing={2}
        >
          <Grid item xs={3}>
            <ProFormSelect
              name="unit"
              options={[
                { id: 1, label: '%' },
                { id: 2, label: 'VND' },
              ]}
              renderValue={(item) => item.id}
              renderLabel={(item) => item.label}
              placeholder="Đơn vị"
            />
          </Grid>
          <Grid item xs={9}>
            <ProFormTextField
              name="price"
              placeholder="Chiết khấu"
              InputProps={{
                inputComponent: PriceInput,
                startAdornment: (
                  <InputAdornment position="start" sx={{ cursor: 'pointer' }}>
                    <ArrowForwardIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <ProFormTextField
              name="price"
              placeholder="Phí trả hàng"
              InputProps={{
                inputComponent: PriceInput,
                startAdornment: (
                  <InputAdornment position="start" sx={{ cursor: 'pointer' }}>
                    <MoneyOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          {/* Tài khoản ngân hàng */}
          <Grid item xs={12}>
            <ProFormTextField
              name="price"
              placeholder="Tiền mặt"
              InputProps={{
                inputComponent: PriceInput,
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleClickShowInput('chuyenKhoan')}
                  >
                    <MoneyOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <ProFormTextField
              name="price"
              placeholder="Chuyển khoản"
              InputProps={{
                inputComponent: PriceInput,
                startAdornment: (
                  <InputAdornment position="start" sx={{ cursor: 'pointer' }}>
                    <AccountBalanceIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Payment;
