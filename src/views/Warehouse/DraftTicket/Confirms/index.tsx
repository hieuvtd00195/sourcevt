import { yupResolver } from '@hookform/resolvers/yup';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ProForm from 'components/ProForm';
import Validation from 'utils/Validation';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { AddCash } from './utils/types';
import {
  Button,
  Divider,
  FormControl,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ProFormContent from 'components/ProForm/ProFormContent';
import InfoIcon from '@mui/icons-material/Info';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import ProFormSelect from 'components/ProForm/ProFormSelect';
import ActionButton from 'components/ProButton/ActionButton';
import PrintIcon from '@mui/icons-material/Print';
import ProFormLabel from 'components/ProForm/ProFormLabel';
import StorefrontIcon from '@mui/icons-material/Storefront';

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

const AddcashTable = () => {
  const form = useForm<AddCash>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const handleSubmit = (value: any) => {
    console.log(value);
  };

  return (
    <PageWrapper title="Xác nhận phiếu chuyển kho">
      <PageBreadcrumbs
        title="Xác nhận phiếu chuyển kho"
        items={[{ link: '/warehouse', text: 'Kho hàng' }]}
      />
      <ProForm form={form} onFinish={handleSubmit}>
        <ProFormContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={8} md={8} lg={6}>
              <Paper sx={{ p: 2, pb: 5 }}>
                <Stack mb={1.5}>
                  <StorefrontIcon />
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {'Kho hàng'}
                  </Typography>
                </Stack>
                <Divider />
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={12} lg={3}>
                    <ProFormLabel title={'Từ kho:'} required name="warehouse" />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={9}>
                    <ProFormSelect
                      name="objectType"
                      placeholder="Từ kho hàng"
                      options={[
                        { value: 0, label: 'Hà Nội' },
                        { value: 1, label: 'Hải phòng' },
                        { value: 2, label: 'Bắc giang' },
                        { value: 2, label: 'Bắc hải' },
                        { value: 2, label: 'Quảng ninh' },
                        { value: 2, label: 'Sài gòn' },
                      ]}
                      renderLabel={(option) => option.label}
                      renderValue={(option) => option.value}
                    />
                  </Grid>
                  <Divider />
                  <Grid item xs={12} sm={12} lg={3}>
                    <ProFormLabel title={'Từ kho:'} required name="warehouse" />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={9}>
                    <ProFormSelect
                      name="move"
                      placeholder="Đến kho hàng"
                      options={[
                        { value: 0, label: 'Ninh Bình' },
                        { value: 1, label: 'Sóc Sơn' },
                        { value: 2, label: 'Yên bái' },
                        { value: 2, label: 'Lào cai' },
                        { value: 2, label: 'Hải Dương' },
                        { value: 2, label: 'Ninh Thuận' },
                      ]}
                      renderLabel={(option) => option.label}
                      renderValue={(option) => option.value}
                    />
                  </Grid>
                  <Divider />
                  <Grid item xs={12} sm={12} lg={3}>
                    <ProFormLabel title={'Nhãn:'} required name="nhan" />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={9}>
                    <ProFormSelect
                      name="nhan"
                      placeholder="Chọn nhãn"
                      options={[
                        { value: 0, label: 'Abc' },
                        { value: 1, label: 'Cv' },
                        { value: 2, label: 'CCC' },
                        { value: 2, label: 'AA' },
                        { value: 2, label: 'PCP' },
                        { value: 2, label: 'DDe' },
                      ]}
                      renderLabel={(option) => option.label}
                      renderValue={(option) => option.value}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={6}>
              <Paper sx={{ p: 2, pb: 5 }}>
                <Stack mb={1.5}>
                  <InfoIcon />
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {'Thông tin'}
                  </Typography>
                </Stack>
                <Divider />
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={12} lg={3}>
                    <ProFormLabel title={'Ghi chú'} name="note" />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={9}>
                    <ProFormTextField
                      name="note"
                      placeholder="Ghi chú"
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          <FormControl></FormControl>
        </ProFormContent>
        <Stack spacing={2}>
          <ActionButton
            actionType="save"
            variant="contained"
            type="submit"
            sx={{ backgroundColor: '#4CAF50 ' }}
          >
            (F9) Lưu
          </ActionButton>
          <Button startIcon={<PrintIcon />} sx={{ backgroundColor: '#2196F3' }}>
            (F10) Lưu và In
          </Button>
        </Stack>
      </ProForm>
    </PageWrapper>
  );
};

export default AddcashTable;
