import { yupResolver } from '@hookform/resolvers/yup';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ProForm from 'components/ProForm';
import Validation from 'utils/Validation';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { Grid, Paper } from '@mui/material';
import ProFormContent from 'components/ProForm/ProFormContent';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import ProFormSelect from 'components/ProForm/ProFormSelect';
import ActionButton from 'components/ProButton/ActionButton';
import ProFormLabel from 'components/ProForm/ProFormLabel';
import ProFormHeader from 'components/ProForm/ProFormHeader';
import { AddExpire } from './utils/types';
import ProFormAutocomplete from 'components/ProForm/Label/ProFormAutocomplete';
import { NumberInput } from 'plugins/NumberFormat';

const validationSchema = yup.object().shape({
  showQuantity: Validation.option().default(0).required(),
  code: Validation.string(),
  storeName: Validation.string(),
  phone: Validation.string(),
  email: Validation.string().optional(),
  address: Validation.string().optional(),
  city: Validation.option().default(0).required(),
  district: Validation.option().default(0).required(),
  ward: Validation.option().default(0).required(),
  size: Validation.string(),
});

const AddcashTable = () => {
  const form = useForm<AddExpire>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const handleSubmit = (value: any) => {
    console.log(value);
  };

  return (
    <PageWrapper title="Sửa kho hàng">
      <PageBreadcrumbs
        title="Sửa kho hàng"
        items={[
          { link: '/setting/expire', text: 'Cài đặt' },
          { link: '/setting/expire', text: 'Hạn sử dụng' },
        ]}
      />

      <ProForm form={form} onFinish={handleSubmit}>
        <ProFormContent>
          <Paper sx={{ p: 2 }}>
            <ProFormHeader>Khách hàng</ProFormHeader>
            <Grid container spacing={2} mt={1}>
              <Grid item sm={12} md={12} lg={12}>
                <Grid container spacing={2}>
                  <Grid item sm={1.5} md={1.5} lg={1.5}>
                    <ProFormLabel
                      title={'Hiển thị số lượng online'}
                      name="showQuatity"
                      required
                    />
                  </Grid>
                  <Grid item sm={7} md={7} lg={7}>
                    <ProFormSelect
                      name="showQuatity"
                      placeholder="Hiển thị số lượng"
                      options={[
                        { value: 1, label: '-Show online-' },
                        { value: 2, label: 'Lấy số tồn' },
                        { value: 3, label: 'Lấy số tồn và hiện địa chỉ' },
                      ]}
                      renderLabel={(option) => option.label}
                      renderValue={(option) => option.value}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={12} md={12} lg={12}>
                <Grid container spacing={2}>
                  <Grid item sm={1.5} md={1.5} lg={1.5}>
                    <ProFormLabel title={'Mã'} name="code" required />
                  </Grid>
                  <Grid item sm={7} md={7} lg={7}>
                    <ProFormTextField name="code" placeholder="Mã" />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={12} md={12} lg={12}>
                <Grid container spacing={2}>
                  <Grid item sm={1.5} md={1.5} lg={1.5}>
                    <ProFormLabel title={'Tên kho'} name="storeName" required />
                  </Grid>
                  <Grid item sm={7} md={7} lg={7}>
                    <ProFormTextField name="storeName" placeholder="Tên kho" />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={12} md={12} lg={12}>
                <Grid container spacing={2}>
                  <Grid item sm={1.5} md={1.5} lg={1.5}>
                    <ProFormLabel title={'Điện thoại'} name="phone" required />
                  </Grid>
                  <Grid item sm={7} md={7} lg={7}>
                    <ProFormTextField
                      name="phone"
                      placeholder="Điện thoại"
                      InputProps={{
                        inputComponent: NumberInput,
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={12} md={12} lg={12}>
                <Grid container spacing={2}>
                  <Grid item sm={1.5} md={1.5} lg={1.5}>
                    <ProFormLabel title={'Email'} name="email" />
                  </Grid>
                  <Grid item sm={7} md={7} lg={7}>
                    <ProFormTextField name="email" placeholder="Email" />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={12} md={12} lg={12}>
                <Grid container spacing={2}>
                  <Grid item sm={1.5} md={1.5} lg={1.5}>
                    <ProFormLabel title={'Địa chỉ'} name="address" />
                  </Grid>
                  <Grid item sm={7} md={7} lg={7}>
                    <ProFormTextField name="address" placeholder="Địa chỉ" />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={12} md={12} lg={12}>
                <Grid container spacing={2}>
                  <Grid item sm={1.5} md={1.5} lg={1.5}>
                    <ProFormLabel title={'Thành phố'} name="city" required />
                  </Grid>
                  <Grid item sm={7} md={7} lg={7}>
                    <ProFormAutocomplete
                      name="city"
                      placeholder="Thành phố"
                      options={[
                        { value: 0, label: '-Thành Phố-' },
                        { value: 1, label: 'Hà Nội' },
                        { value: 2, label: 'Nam Định' },
                      ]}
                      renderLabel={(option) => option.label}
                      renderValue={(option) => option.value}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={12} md={12} lg={12}>
                <Grid container spacing={2}>
                  <Grid item sm={1.5} md={1.5} lg={1.5}>
                    <ProFormLabel
                      title={'Quận huyện'}
                      name="district"
                      required
                    />
                  </Grid>
                  <Grid item sm={7} md={7} lg={7}>
                    <ProFormAutocomplete
                      name="district"
                      placeholder="Quận huyện"
                      options={[
                        { value: 0, label: '-Quận huyện-' },
                        { value: 1, label: 'Quận 1' },
                        { value: 2, label: 'Quận 2' },
                        { value: 3, label: 'Quận 3' },
                      ]}
                      renderLabel={(option) => option.label}
                      renderValue={(option) => option.value}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={12} md={12} lg={12}>
                <Grid container spacing={2}>
                  <Grid item sm={1.5} md={1.5} lg={1.5}>
                    <ProFormLabel title={'Phường xã'} name="ward" required />
                  </Grid>
                  <Grid item sm={7} md={7} lg={7}>
                    <ProFormAutocomplete
                      name="ward"
                      placeholder="Phường xã"
                      options={[
                        { value: 0, label: '-Phường xã-' },
                        { value: 1, label: 'Quận 1' },
                        { value: 2, label: 'Quận 2' },
                        { value: 3, label: 'Quận 3' },
                      ]}
                      renderLabel={(option) => option.label}
                      renderValue={(option) => option.value}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={12} md={12} lg={12}>
                <Grid container spacing={2}>
                  <Grid item sm={1.5} md={1.5} lg={1.5}>
                    <ProFormLabel title={'Diện tích'} name="size" required />
                  </Grid>
                  <Grid item sm={7} md={7} lg={7}>
                    <ProFormTextField
                      name="size"
                      placeholder="Diện tích"
                      InputProps={{
                        inputComponent: NumberInput,
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <ActionButton
              actionType="save"
              variant="contained"
              type="submit"
              sx={{ backgroundColor: '#4CAF50 ', mt: 2 }}
            >
              Lưu
            </ActionButton>
          </Paper>
        </ProFormContent>
      </ProForm>
    </PageWrapper>
  );
};

export default AddcashTable;
