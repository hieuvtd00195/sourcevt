import { yupResolver } from '@hookform/resolvers/yup';
import AddIcon from '@mui/icons-material/Add';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HouseIcon from '@mui/icons-material/House';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import PersonIcon from '@mui/icons-material/Person';
import PrintIcon from '@mui/icons-material/Print';
import StyleIcon from '@mui/icons-material/Style';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProMenu from 'components/ProMenu';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Validation from 'utils/Validation';
import CustomerTable from './CustomerTable';
import ProductTable from './ProductTable';

const schema = Validation.shape({
  name: Validation.string().optional(),
});

const Info = () => {
  const [isSHowTag, setShowTag] = useState<boolean>(false);
  const form = useForm<any>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const handleSubmit = (values: any) => {};

  return (
    <Grid container spacing={2} sx={{ paddingTop: '5px' ,background: '#fff' }}>
      <Grid item xs={12} md={8} lg={8}>
        <Box
          sx={{
            border: '1px solid #E6E8F0',
            marginBottom: '10px',
            padding: '5px',
          }}
        >
          <Box sx={{ display: 'flex', padding: '10px' }}>
            <PersonIcon />
            Khách hàng
          </Box>
          <Box>
            <Divider />
          </Box>
          <Grid container sx={{ padding: '10px' }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex' }}>
                <PersonIcon />
                <span style={{ color: '#2196f3' }}>
                  A Pháp-45 Hùng Vương (SG)
                </span>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <LocalPhoneIcon />
                0908962233
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex' }}>
                <CreditCardIcon />
                Mã thẻ khách hàng: <b>120989694</b>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ border: '1px solid #E6E8F0', marginBottom: '10px' }}>
          <CustomerTable />
        </Box>
        <Box sx={{ border: '1px solid #E6E8F0', marginBottom: '10px' }}>
          <ProductTable />
        </Box>

        <Grid
          sx={{
            border: '1px solid #E6E8F0',
            marginBottom: '10px',
            padding: '10px',
          }}
          container
          direction={'row'}
          justifyContent="space-between"
        >
          <Grid item>
            <Box sx={{ display: 'flex' }}>
              <AttachFileIcon />
              File đính kèm
            </Box>
            {/* <UploadInput>Upload</UploadInput> */}
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} md={4} lg={4} sx={{ fontSize: '14px' }}>
        <Box
          sx={{
            border: '1px solid #E6E8F0',
            marginBottom: '10px',
          }}
        >
          <Box sx={{ display: 'flex', padding: '10px 15px' }}>
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
          <Box>
            <Divider />
          </Box>
          <Grid
            container
            sx={{
              padding: '5px 15px',
            }}
          >
            <Grid item xs={12} md={6}>
              Tổng tiền
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>
                960.000
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              Lợi nhuận
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>
                (31.7%) 304.551
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              Khách còn nợ
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
              <ProMenu
                position="left"
                items={[
                  {
                    label: 'Tạo phiếu thu tiền mặt',
                    value: 1,
                    actionType: 'money',
                  },
                  {
                    label: 'Nhận chuyển khoản ngân hàng(Báo có)',
                    value: 2,
                    actionType: 'bank',
                  },
                ]}
              >
                <ActionButton
                  variant="outlined"
                  sx={{ padding: 0, marginRight: 1 }}
                >
                  +
                  <ExpandMoreIcon />
                </ActionButton>
              </ProMenu>
              960.000
            </Grid>
            <Grid item xs={12} md={6}>
              Ngày hẹn thanh toán
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
              10/02/2023
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            border: '1px solid #E6E8F0',
            marginBottom: '10px',
          }}
        >
          <Box sx={{ display: 'flex', padding: '10px 15px' }}>
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
          <Box>
            <Divider />
          </Box>
          <Box sx={{ padding: '15px' }}>
            <Box sx={{ display: 'flex', paddingBottom: '15px' }}>
              <HouseIcon />
              Linh kiện sài gòn
            </Box>
            <Grid container>
              <Grid item xs={12} md={6} container alignItems="center">
                Thu ngân
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Hòa SG</Typography>
                <Typography variant="subtitle2">14:39 03/02</Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box
          sx={{
            border: '1px solid #E6E8F0',
            marginBottom: '10px',
          }}
        >
          <Grid
            container
            justifyContent="space-between"
            sx={{ padding: '10px 15px' }}
          >
            <Grid item>
              <Box sx={{ display: 'flex' }}>
                <PrintIcon />
                <span
                  style={{
                    fontWeight: 'bold',
                    display: 'inline-block',
                    marginLeft: '10px',
                  }}
                >
                  Lịch sử in
                </span>
              </Box>
            </Grid>
            <Grid item>
              <Box
                sx={{
                  background: '#00bcd4',
                  color: '#fff',
                  borderRadius: '50%',
                  minWidth: '23px',
                  textAlign: 'center',
                }}
              >
                1
              </Box>
            </Grid>
          </Grid>
          <Box>
            <Divider />
          </Box>
          <Box sx={{ padding: '10px 15px' }}>
            <Grid container>
              <Grid item xs={12} md={6}>
                Hòa SG
              </Grid>
              <Grid item xs={12} md={6}>
                14:39 03/02
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box
          sx={{
            border: '1px solid #E6E8F0',
            marginBottom: '10px',
          }}
        >
          <Grid
            container
            justifyContent="space-between"
            sx={{ padding: '10px 15px' }}
          >
            <Box sx={{ display: 'flex' }}>
              <StyleIcon />
              <span
                style={{
                  fontWeight: 'bold',
                  display: 'inline-block',
                  marginLeft: '10px',
                }}
              >
                Nhãn
              </span>
            </Box>
            <AddIcon onClick={() => setShowTag(!isSHowTag)} />
          </Grid>
          <Box>
            <Divider />
          </Box>

          <Box sx={{ padding: '10px 15px' }}>
            {isSHowTag && (
              <ProForm
                form={form}
                onFinish={handleSubmit}
                PaperProps={{ sx: { p: 2 } }}
              >
                <Box sx={{ marginBottom: '5px', display: 'flex' }}>
                  <Checkbox />
                  <ProFormTextField
                    name="name"
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
                <Grid container justifyContent="flex-end">
                  <ActionButton
                    variant="outlined"
                    sx={{ padding: 0, marginRight: 1 }}
                  >
                    Đóng
                  </ActionButton>
                  <ActionButton
                    variant="contained"
                    sx={{ padding: 0, marginRight: 1 }}
                  >
                    Lưu
                  </ActionButton>
                </Grid>
              </ProForm>
            )}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Info;
