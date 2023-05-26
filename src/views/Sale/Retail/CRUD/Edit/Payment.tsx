import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import { Grid, InputAdornment } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ProFormAutocomplete from 'components/ProForm/ProFormAutocomplete';
import ProFormDate from 'components/ProForm/ProFormDate';
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
      <Grid container alignItems={'center'} sx={{ padding: 1 }}>
        <Grid item xs={6}>
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
        </Grid>
        <Grid item xs={6}>
          <ProFormAutocomplete
            name="store"
            placeholder="Chọn trạng thái"
            options={[
              { value: 1, label: 'Vận chuyển' },
              { value: 2, label: 'Check code' },
            ]}
            renderLabel={(option) => option.label}
            renderValue={(option) => option.value}
          />
        </Grid>

        {/* <Box
          sx={{ display: 'flex', cursor: 'pointer' }}
          onClick={() => {
            setCollapse(!collapse);
          }}
        >
          VAT
          <KeyboardDoubleArrowUpIcon />
        </Box> */}
      </Grid>
      <Box>
        <Divider />
      </Box>

      <Grid
        container
        sx={{
          padding: '5px 15px',
        }}
      >
        {/* <Collapse in={collapse} timeout="auto">
          <Grid
            xs={12}
            container
            item
            md={12}
            sx={{ marginBottom: 1, marginTop: 1 }}
            spacing={2}
          >
            <Grid item xs={3}>
              <ProFormSelectfd
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
                InputProps={{
                  inputComponent: PriceInput,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <ProFormTextField name="price" placeholder="Số hóa đơn VAT" />
            </Grid>
            <Grid item xs={12}>
              <ProFormDate name="firstDate" type="start" />
            </Grid>
          </Grid>
        </Collapse> */}
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
              placeholder="Tiền mặt"
              InputProps={{
                inputComponent: PriceInput,
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleClickShowInput('tienMat')}
                  >
                    <ArrowForwardIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          {checkShow.tienMat && (
            <Grid item xs={12}>
              <ProFormSelect
                name="unit"
                options={[
                  { id: 1, label: '%' },
                  { id: 2, label: 'VND' },
                ]}
                renderValue={(item) => item.id}
                renderLabel={(item) => item.label}
                placeholder="Quỹ Tiền mặt"
              />
            </Grid>
          )}
          {/* Tài khoản ngân hàng */}
          <Grid item xs={12}>
            <ProFormTextField
              name="price"
              placeholder="Chuyển khoản"
              InputProps={{
                inputComponent: PriceInput,
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleClickShowInput('chuyenKhoan')}
                  >
                    <ArrowForwardIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          {checkShow.chuyenKhoan && (
            <Grid item xs={12}>
              <ProFormSelect
                name="unit"
                options={[
                  { id: 1, label: '%' },
                  { id: 2, label: 'VND' },
                ]}
                renderValue={(item) => item.id}
                renderLabel={(item) => item.label}
                placeholder="Tài khoản ngân hàng"
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <ProFormTextField
              name="price"
              placeholder="Tiền khách đưa"
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
        </Grid>

        <Grid item xs={12} md={6}>
          Tiền thừa
        </Grid>
        <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
          <Typography align="right" variant="subtitle2" color="error">
            170.000
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ProFormDate name="firstDate" type="start" />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Payment;
