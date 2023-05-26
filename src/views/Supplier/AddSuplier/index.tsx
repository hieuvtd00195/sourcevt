import { yupResolver } from '@hookform/resolvers/yup';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ProForm from 'components/ProForm';
import Validation from 'utils/Validation';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { AddSupplier } from './utils/types';
import {
  Box,
  Button,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import KeyIcon from '@mui/icons-material/Key';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import ProFormContent from 'components/ProForm/ProFormContent';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import ProFormSelect from 'components/ProForm/ProFormSelect';
import ActionButton from 'components/ProButton/ActionButton';
import PrintIcon from '@mui/icons-material/Print';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BadgeIcon from '@mui/icons-material/Badge';

const validationSchema = yup.object().shape({
  status: Validation.select(1),
  name: Validation.string().required(),
  code: Validation.string().required(),
  phone: Validation.string().optional(),
  email: Validation.string().optional(),
  address: Validation.string().optional(),
  taxCode: Validation.string().optional(),
  object: Validation.select(1),
  identityNumber: Validation.string().optional(),
  bank: Validation.string().optional(),
  branch: Validation.string().optional(),
  accountNumber: Validation.string().optional(),
  accountOwner: Validation.string().optional(),
  note: Validation.string().optional(),
});

const AddSupplierTable = () => {
  const form = useForm<AddSupplier>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const handleSubmit = (value: any) => {
    console.log(value);
  };

  return (
    <PageWrapper title="Thêm nhà cung cấp">
      <PageBreadcrumbs
        title="Thêm phiếu cung cấp"
        items={[{ link: '/products/supplier', text: 'Danh sách nhà cung cấp' }]}
      />
      <ProForm form={form} onFinish={handleSubmit}>
        <ProFormContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Paper sx={{ p: 2, pb: 5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    mb: 1,
                  }}
                >
                  <Stack sx={{ alignItems: 'center' }}>
                    <ErrorOutlineIcon />
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {'Thông tin'}
                    </Typography>
                  </Stack>
                  <Box sx={{ maxWidth: '30%' }}>
                    <ProFormSelect
                      name="status"
                      placeholder="Trạng thái"
                      options={[
                        { value: 1, label: 'Đang giao dịch' },
                        { value: 2, label: 'Ngừng giao dịch' },
                      ]}
                      renderLabel={(option) => option.label}
                      renderValue={(option) => option.value}
                    />
                  </Box>
                </Box>
                <Divider />
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormTextField
                      name="name"
                      placeholder="Tên *"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HomeIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormTextField
                      name="code"
                      placeholder="Mã"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <KeyIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormTextField
                      name="phone"
                      placeholder="Điện thoại *"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocalPhoneIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormTextField
                      name="email"
                      placeholder="Email"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormTextField
                      name="address"
                      placeholder="Địa chỉ"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOnIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormTextField
                      name="taxCode"
                      placeholder="Mã số thuế"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <KeyIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormSelect
                      name="object"
                      placeholder="Đối tượng"
                      options={[
                        { value: 1, label: 'Trung Quốc' },
                        { value: 2, label: 'Việt Nam' },
                      ]}
                      renderLabel={(option) => option.label}
                      renderValue={(option) => option.value}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormTextField
                      name="identityNumber"
                      placeholder="Số CMND"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </ProFormContent>
        <Stack spacing={2} mt={2}>
          <ActionButton
            actionType="save"
            variant="contained"
            type="submit"
            sx={{ backgroundColor: '#4CAF50 ' }}
          >
            Lưu
          </ActionButton>
          <Button startIcon={<PrintIcon />} sx={{ backgroundColor: '#2196F3' }}>
            Lưu và In
          </Button>
        </Stack>
      </ProForm>
    </PageWrapper>
  );
};

export default AddSupplierTable;
