import { yupResolver } from '@hookform/resolvers/yup';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import InfoIcon from '@mui/icons-material/Info';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import {
  Box,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormContent from 'components/ProForm/ProFormContent';
import ProFormLabel from 'components/ProForm/ProFormLabel';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Validation from 'utils/Validation';
import AddNewSupplier from './AddNewSupplier';
import EditOtherTable from './EditOtherTable';
import { IImportExport } from './utils/types';

const schema = Validation.shape({
  warehouse: Validation.select(1),
  abc: Validation.select(1),
  acv: Validation.select(1),
  hgf: Validation.select(1),
  unit: Validation.select(1),
  unit234: Validation.select(1),
  taikhoan: Validation.select(1),
  taikhoan2: Validation.select(1),
  company: Validation.select(1),
});

const ImportBill = () => {
  const form = useForm<IImportExport>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });
  const handleSubmit = (data: any) => {
    console.log(data);
  };

  const [isOpenDialogInfo, setOpenDialogInfo] = useState<boolean>(false);
  const handleToggleDialog = () => {
    setOpenDialogInfo((prev) => !prev);
  };

  return (
    <PageWrapper title={'Sửa phiếu XNK khác'}>
      <PageBreadcrumbs
        title={'Sửa phiếu XNK khác'}
        items={[
          { link: '/inventory', text: 'Kho hàng' },
          { link: '/inventory', text: 'Xuất nhập kho' },
        ]}
      />
      <ProForm form={form} onFinish={handleSubmit}>
        <div
          style={{
            marginTop: '10px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateAreas:
              '"left right" "mid mid" "bot bot" "divider divider" "note note"',
            columnGap: '20px',
            rowGap: '10px',
          }}
        >
          <Stack
            direction={'column'}
            sx={{ gridArea: 'left', minHeight: '100%' }}
          >
            <ProFormContent sx={{ minHeight: '100%' }}>
              <Paper sx={{ p: 2, minHeight: '100%' }}>
                <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                  <InfoIcon />
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 'medium', marginLeft: '4px' }}
                  >
                    {'Thông tin'}
                  </Typography>
                </Box>
                <Divider />
                <Grid container spacing={2} marginTop={1} marginBottom={1}>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Loại nhập hàng'} name="abc" />
                    <ProFormSelect
                      name="abc"
                      options={[{ value: 1, label: '123' }]}
                      placeholder={'Loại nhập hàng'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Kho hàng'} name="warehouse" />
                    <ProFormSelect
                      name="warehouse"
                      options={[{ value: 1, label: '1234234234ss' }]}
                      placeholder={'Kho hàng'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Khách hàng'} name="khachhang" />
                    <ProFormTextField
                      name="khachhang"
                      placeholder={'Khách hàng'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Số điện thoại'} name="sdt" />
                    <ProFormTextField
                      name="sdt"
                      placeholder={'Số điện thoại'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Ghi chú'} name="note" />
                    <ProFormTextField
                      name="note"
                      placeholder={'Ghi chú'}
                      rows={4}
                      multiline
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Nhãn'} name="hgf" />
                    <ProFormSelect
                      name="hgf"
                      options={[{ value: 1, label: '123' }]}
                      placeholder={'Nhãn'}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </ProFormContent>
          </Stack>
          <Stack direction={'column'} sx={{ gridArea: 'right' }}>
            <ProFormContent>
              <Paper sx={{ p: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CreditCardIcon />
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 'medium', marginLeft: '4px' }}
                    >
                      {'Thanh toán'}
                    </Typography>
                  </Box>
                </Box>
                <Divider />
                <Grid container spacing={2} marginTop={1} marginBottom={1}>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel
                      title={'Tiền trả khách'}
                      name="tientrakhach"
                    />
                    <ProFormTextField
                      name="tientrakhach"
                      placeholder=""
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocalAtmIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Tài khoản'} name="taikhoan" />
                    <ProFormSelect
                      name="taikhoan"
                      options={[{ value: 1, label: '123' }]}
                      placeholder={'Tài khoản'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Chuyển khoản'} name="chuyenkhoan" />
                    <ProFormTextField
                      name="chuyenkhoan"
                      placeholder="Số tiền"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocalAtmIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Tài khoản'} name="taikhoan2" />
                    <ProFormSelect
                      name="taikhoan2"
                      options={[{ value: 1, label: '123' }]}
                      placeholder={'Tài khoản'}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </ProFormContent>
          </Stack>
          <Box sx={{ gridArea: 'mid', height: '500px', padding: '8px' }}>
            <Grid container spacing={2} marginBottom={2}>
              <Grid item xs={2} sm={2} md={2} lg={2}>
                <ProFormSelect
                  name="company"
                  placeholder={''}
                  options={[
                    { value: 1, label: 'Sản phẩm' },
                    { value: 2, label: 'Nhập theo ri' },
                  ]}
                />
              </Grid>
              <Grid item xs={5} sm={5} md={5} lg={5}>
                <ProFormTextField
                  name="nhapsanpham"
                  placeholder={''}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={5} sm={5} md={5} lg={5}>
                <ProFormTextField
                  name="nhapIMEI"
                  placeholder={'Nhập IMEI'}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <EditOtherTable />
          </Box>
          <Stack
            direction="column"
            spacing={2}
            sx={{ gridArea: 'bot', marginTop: '40px' }}
          >
            <Box sx={{ p: 2 }}>
              <Stack direction="row" spacing={1}>
                <ActionButton actionType="save" type="submit">
                  Lưu
                </ActionButton>
              </Stack>
            </Box>
          </Stack>
          {isOpenDialogInfo ? (
            <AddNewSupplier
              open={isOpenDialogInfo}
              onClose={handleToggleDialog}
            />
          ) : null}
        </div>
      </ProForm>
    </PageWrapper>
  );
};

export default ImportBill;
