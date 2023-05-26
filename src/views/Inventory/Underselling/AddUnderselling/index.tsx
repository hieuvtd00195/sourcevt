import { yupResolver } from '@hookform/resolvers/yup';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Box, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import ProFormAutocomplete from 'components/ProForm/ProFormAutocomplete';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';
import ProFormContent from 'components/ProForm/ProFormContent';
import ProFormDate from 'components/ProForm/ProFormDate';
import ProFormSelect from 'components/ProForm/ProFormSelect';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import ProTable from 'components/ProTable';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Validation from 'utils/Validation';
import * as yup from 'yup';
import useTableColumns from './Columns';
import { AddCash } from './utils/types';

const DATA = [
  {
    id: 1,
    code: 'V12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    markCode: 200002,
    importPrice: '772.00',
    costPrice: '772.00',
    price: '772.00',
    priceVAT: '772.00',
    wholesalePrice: '772.00',
    inventory: 15,
    totalInventory: 25,
    shipping: 23,
  },
];

const validationSchema = yup.object().shape({
  date: Validation.date().optional(),
  objectType: yup.number().nullable().default(null).required(),
  cashAccount: yup.number().nullable().default(null).required(),
  billType: yup.number().nullable().default(null).required(),
  object: Validation.string().optional(),
  documentType: yup.number().nullable().default(null),
  documentId: Validation.string().optional(),
  amount: Validation.string(),
  note: Validation.string().optional(),
});

const AddUnderselling = () => {
  const { t } = useTranslation();

  const form = useForm<AddCash>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const handleSubmit = (value: any) => {
    console.log(value);
  };

  const { columns } = useTableColumns();

  return (
    <PageWrapper title="Thêm phiếu thu chi">
      <PageBreadcrumbs
        title="Thêm mới hàng thiếu"
        items={[
          { link: '/inventory', text: 'Kho hàng' },
          { link: '/inventory/order-slip', text: 'Hàng thiếu' },
        ]}
      />
      <ProForm form={form} onFinish={handleSubmit}>
        <ProFormContent sx={{ mb: 4 }}>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={5} md={5} lg={5}>
              <Paper sx={{ p: 2, pb: 5 }}>
                <Stack mb={1.5}>
                  <ErrorOutlineIcon />
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {t('Thông tin cơ bản')}
                  </Typography>
                </Stack>
                <Divider />
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormTextField
                      name="object"
                      placeholder="ID phiếu đặt hàng"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormSelect
                      name="objectType"
                      placeholder="- Tên nhà cung cấp -"
                      options={[
                        { value: 0, label: '- Tên nhà cung cấp -' },
                        { value: 1, label: 'Nhập kho' },
                      ]}
                      renderLabel={(option) => option.label}
                      renderValue={(option) => option.value}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormAutocomplete
                      name="acv"
                      options={[
                        { id: 1, label: 'Chưa trả' },
                        { id: 2, label: 'Đã trả' },
                      ]}
                      renderValue={(item) => item.id}
                      renderLabel={(item) => item.label}
                      placeholder={'Trạng thái'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormTextField name="object" placeholder="Số lô" />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormDate
                      name="date"
                      DatePickerProps={{ label: 'Ngày đặt' }}
                      type="start"
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormCheckboxSelect
                      name="store"
                      label={t('Sản phẩm')}
                      placeholder={t('Sản phẩm')}
                      options={[
                        { value: 1, label: 'Chưa gắn kho' },
                        { value: 2, label: 'Linh kiện Sài Gòn' },
                      ]}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={7} md={7} lg={7}>
              <Paper sx={{ p: 2, pb: 5 }}>
                <Stack mb={1.5}>
                  <ErrorOutlineIcon />
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {t('Thông tin phiếu nhập kho')}
                  </Typography>
                </Stack>
                <Divider />
                <Box height="400px" mb={2}>
                  <ProTable<any>
                    title="Danh sách sản phẩm"
                    columns={columns}
                    data={DATA}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </ProFormContent>
        <Stack spacing={2}>
          <ActionButton actionType="cancel" sx={{ background: 'white' }}>
            Hủy
          </ActionButton>
          <ActionButton actionType="save" variant="contained" type="submit">
            Lưu
          </ActionButton>
        </Stack>
      </ProForm>
    </PageWrapper>
  );
};

export default AddUnderselling;
