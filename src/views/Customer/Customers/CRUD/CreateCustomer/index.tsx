import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Paper } from '@mui/material';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import ProFormDate from 'components/ProForm/ProFormDate';
import ProFormHeader from 'components/ProForm/ProFormHeader';
import ProFormSelect from 'components/ProForm/ProFormSelect';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import ProFormAutocomplete from 'components/ProTable/core/EditableCell/ProFormAutocomplete';
import useNotification from 'hooks/useNotification';
import { NumberInput } from 'plugins/NumberFormat';
import { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { APICreateCustomer } from 'services/customer';
import { APIGetListUser, IUser } from 'services/masterdata';
import { getMasterDataListProvince, getProvinceList } from 'slices/masterData';
import { useTypedDispatch } from 'store';
import { ICustomer } from 'types/customer';
import Validation from 'utils/Validation';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';
import {
  getListStoreApplication,
  getStoreApplicationList,
} from 'slices/storeApplication';
import { AxiosError } from 'axios';

const schema = Validation.shape({
  customerType: Validation.number()
    .required('Loại khách hàng bắt buộc')
    .typeError('Loại khách hàng bắt buộc')
    .default(null),
  phoneNumber: Validation.string()
    .required('Điện thoại bắt buộc')
    .min(10, 'Điện thoại chưa đúng định dạng')
    .max(10, 'Điện thoại chưa đúng định dạng')
    .default(null),
  dateOfBirth: Validation.date()
    .nullable()
    .notRequired()
    .test('valid-birthdate', 'Ngày sinh không hợp lệ', (value: Date | null) => {
      if (!value) return true;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return value < today;
    })
    .default(null),
});

const CreateCustomer = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useTypedDispatch();
  const setNotification = useNotification();

  const [users, setUsers] = useState<IUser[]>([]);

  const ProvinceList = useSelector(getMasterDataListProvince);
  const storeApplicationList = useSelector(getStoreApplicationList);

  const form = useForm<ICustomer>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const handleSubmit = async (data: ICustomer) => {
    try {
      await APICreateCustomer(data);
      setNotification({
        message: 'Tạo khách hàng thành công',
      });
      navigate('/customers');
    } catch (error) {
      const err = error as AxiosError;
      setNotification({
        error: err?.message || 'Tạo khách hàng không thành công',
      });
    }
  };

  const fetchProvince = async () => {
    try {
      await dispatch(getProvinceList({}));
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchProvince();
    dispatch(getListStoreApplication({}));
    APIGetListUser()
      .then((result) => {
        setUsers(result);
      })
      .catch(console.log);
  }, []);

  return (
    <PageWrapper title={t('Thêm mới khách hàng')}>
      <PageBreadcrumbs
        title={t('Thêm mới khách hàng')}
        items={[{ link: '/customers', text: 'Khách hàng' }]}
      />

      <ProForm form={form} onFinish={handleSubmit}>
        <Paper sx={{ p: 2 }}>
          <ProFormHeader>Khách hàng</ProFormHeader>
          <Grid container spacing={2} px={2} py={3}>
            {Boolean(id) && (
              <Grid item xs={12} sm={6} md={4} lg={6}>
                <ProFormTextField
                  name="code"
                  placeholder={t('Mã khách hàng')}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6} md={4} lg={6}>
              <ProFormSelect
                name="customerType"
                placeholder={t('Loại khách hàng')}
                options={[
                  { value: 0, label: 'Khách lẻ' },
                  { value: 1, label: 'Khách spa' },
                  { value: 2, label: 'Đại lý' },
                ]}
                renderLabel={(option) => option.label}
                renderValue={(option) => option.value}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={6}>
              <ProFormTextField
                name="name"
                placeholder={t('Họ tên')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={6}>
              <ProFormTextField
                name="phoneNumber"
                placeholder={t('Điện thoại')}
                InputProps={{
                  inputComponent: NumberInput,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={6}>
              <ProFormDate
                name="dateOfBirth"
                type="start"
                placeholder="Ngày sinh"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={6}>
              <ProFormSelect
                name="gender"
                placeholder={t('Giới tính')}
                options={[
                  { value: 0, label: 'Nam' },
                  { value: 1, label: 'Nữ' },
                  { value: 2, label: 'Khác' },
                ]}
                renderLabel={(option) => option.label}
                renderValue={(option) => option.value}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={6}>
              <ProFormTextField
                name="address"
                placeholder={t('Địa chỉ')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={6}>
              <ProFormAutocomplete
                name="provinceId"
                placeholder="Thành phố"
                options={ProvinceList}
                renderLabel={(option) => option.name}
                renderValue={(option) => option.id}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={6}>
              <ProFormTextField
                name="debtLimit"
                placeholder={t('Giới hạn công nợ')}
                InputProps={{
                  inputComponent: NumberInput,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={6}>
              <ProFormSelect
                name="debtGroup"
                placeholder={t('Phân loại công nợ')}
                options={[
                  { value: 0, label: 'Bình thường' },
                  { value: 1, label: 'Hạn chế' },
                  { value: 2, label: 'Không xuất hàng' },
                ]}
                renderLabel={(option) => option.label}
                renderValue={(option) => option.value}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={6}>
              <ProFormAutocomplete
                name="handlerStoreId"
                placeholder={t('Cửa hàng phụ trách')}
                options={storeApplicationList}
                renderLabel={(option) => option?.name}
                renderValue={(option) => option?.id}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={6}>
              <ProFormAutocomplete
                name="handlerEmployeeId"
                placeholder={t('Nhân viên phụ trách')}
                options={users}
                renderValue={(option) => option.id}
                renderLabel={(option) => option.name || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={6}>
              <ProFormAutocomplete
                name="supportEmployeeId"
                placeholder={t('Nhân viên chăm sóc')}
                options={users}
                renderValue={(option) => option.id}
                renderLabel={(option) => option.name || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={6}>
              <ProFormTextField
                name="zalo"
                placeholder={t('SĐT Zalo')}
                InputProps={{
                  inputComponent: NumberInput,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={6}>
              <ProFormTextField
                name="facebook"
                placeholder={t('Link Facebook')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <ProFormTextField
                name="note"
                placeholder={t('Ghi chú')}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </Paper>
        <ActionButton actionType="save" type="submit" sx={{ m: 2 }}>
          Lưu
        </ActionButton>
      </ProForm>
    </PageWrapper>
  );
};

export default CreateCustomer;
