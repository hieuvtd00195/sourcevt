import { yupResolver } from '@hookform/resolvers/yup';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, ButtonGroup, Collapse, Grid } from '@mui/material';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProForm from 'components/ProForm';
import ProFormAutocomplete from 'components/ProForm/Label/ProFormAutocomplete';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  CustomerSearchByNameOrPhone,
  getAllCustomerByType,
  getAllCustomerByTypeApi,
  getCustomerSelectApi,
} from 'slices/customer';
import { getMasterDataListProvince, getProvinceList } from 'slices/masterData';
import {
  getListStoreApplication,
  getStoreApplicationList,
} from 'slices/storeApplication';
import { AppDispatch } from 'store';
import { FiltersRef } from 'types/refs';
import DateTime from 'utils/DateTime';
import Regexs from 'utils/Regexs';
import Validation from 'utils/Validation';
import * as yup from 'yup';
import { FilterParams } from './utils/filters';
import dayjs from 'dayjs';
import { ICustomerByType } from 'types/customer';

interface Props {
  onSearch: (params: Partial<FilterParams>) => void;
  onSubmit: VoidFunction;
  onClear: VoidFunction;
}

interface FilterValues {
  [key: string]: any;
}

const schema = Validation.shape({
  fromDate: yup.date().nullable().default(null),
  toDate: yup.date().nullable().default(null),
  customerId: yup.string().nullable().default(null),
  customerType: yup.number().nullable().default(null),
  debtType: yup.number().nullable().default(null),
  startValue: yup.string().nullable().default(null),
  endValue: yup.string().nullable().default(null),
  employeeId: yup.string().nullable().default(null),
  storeId: yup.string().nullable().default(null),
  provinceId: yup.string().nullable().default(null),
  debtLimit: yup.number().nullable().default(null),
  deliveryType: yup.number().nullable().default(null),
  lastOrder: yup
    .string()
    .trim()
    .matches(Regexs.numberSpace, 'Đơn hàng không hợp lệ')
    .nullable()
    .default(null),
  numberOfDaysOwed: yup
    .string()
    .trim()
    .matches(Regexs.numberSpace, 'Số ngày nợ không hợp lệ')
    .nullable()
    .default(null),
});

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { onSearch, onSubmit, onClear } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const [openExpand, setOpenExpand] = useState<boolean>(false);
  const [customerByTypeOption, setCustomerByTypeOption] = useState<
    ICustomerByType[]
  >([]);

  const ProvinceList = useSelector(getMasterDataListProvince);
  const CustomerList = useSelector(CustomerSearchByNameOrPhone);
  const storeApplicationList = useSelector(getStoreApplicationList);
  const allCustomerByTypeList = useSelector(getAllCustomerByType);

  const form = useForm<FilterValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const handleSubmit = (values: FilterValues) => {
    const params = {
      ...values,
      fromDate: values.fromDate
        ? dayjs(values.fromDate).format('YYYY-MM-DD')
        : null,
      toDate: values.toDate ? dayjs(values.toDate).format('YYYY-MM-DD') : null,
    };
    onSearch(params);
  };

  const handleReset = () => {
    form.reset(schema.getDefault());
  };

  useImperativeHandle(ref, () => ({
    reset: handleReset,
    submit: form.handleSubmit(handleSubmit),
  }));

  const handleExpand = () => {
    setOpenExpand((prev) => !prev);
  };

  const trimSpaceForm = (event: any, name: string) => {
    const value = event.target.value;
    form.setValue(name, value.trim());
  };

  useEffect(() => {
    if (!form.watch('debtType')) {
      form.setValue('startValue', null);
      form.setValue('endValue', null);
    }
  }, [form.watch('debtType')]);

  const fetchProvince = async () => {
    try {
      await dispatch(getProvinceList({}));
    } catch (error) {
    } finally {
    }
  };

  const fetchCustomer = async () => {
    try {
      await dispatch(getCustomerSelectApi(''));
    } catch (error) {
    } finally {
    }
  };

  const fetchDataStoreApplication = async () => {
    try {
      await dispatch(getListStoreApplication({}));
    } catch (error) {
    } finally {
    }
  };

  const fetchDataCustomerByType = async (param: number) => {
    try {
      await dispatch(getAllCustomerByTypeApi(param));
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchProvince();
    fetchCustomer();
    fetchDataStoreApplication();
  }, []);

  useEffect(() => {
    const customerType = form.watch('customerType');
    fetchDataCustomerByType(customerType);
  }, [form.watch('customerType')]);

  useEffect(() => {
    setCustomerByTypeOption(allCustomerByTypeList);
  }, [allCustomerByTypeList]);

  useEffect(() => {
    const today = new Date();
    form.setValue('toDate', today);
  }, []);

  return (
    <ProForm
      form={form}
      onFinish={handleSubmit}
      PaperProps={{ sx: { padding: '16px 16px 0 16px' } }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={3.5} xl={2.5}>
          <ProDateRange label={t('Lọc ngày')} from="fromDate" to="toDate" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3.5} xl={1.8}>
          <ProFormAutocomplete
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
        <Grid item xs={12} sm={6} md={3} lg={3.5} xl={2}>
          <ProFormAutocomplete
            name="customerId"
            placeholder={t('Khách hàng')}
            options={customerByTypeOption}
            renderLabel={(option) => option.name}
            renderValue={(option) => option.id}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3.5} xl={1.8}>
          <ProFormAutocomplete
            name="debtType"
            placeholder={t('Công nợ')}
            options={[
              { value: 1, label: 'Phải thu' },
              { value: 2, label: 'Phải trả' },
              { value: 3, label: 'Phải thu | Phải trả' },
            ]}
            renderLabel={(option) => option.label}
            renderValue={(option) => option.value}
          />
        </Grid>
        <Grid container item xs={12} sm={6} md={3} lg={3.5} xl={2.6}>
          <Grid item xs={6}>
            <ProFormTextField
              disabled={!form.watch('debtType')}
              name="debtFrom"
              label={!form.watch('debtType') ? t('Từ giá trị') : ''}
              placeholder={t('Từ giá trị')}
              onBlur={(event) => trimSpaceForm(event, 'debtFrom')}
              InputProps={{
                sx: {
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: '#000000',
                  },
                  '.MuiInputBase-input': { fontWeight: 700 },
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <ProFormTextField
              disabled={!form.watch('debtType')}
              name="debtTo"
              label={!form.watch('debtType') ? t('Đến giá trị') : ''}
              placeholder={t('Đến giá trị')}
              onBlur={(event) => trimSpaceForm(event, 'debtTo')}
              InputProps={{
                sx: {
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: '#000000',
                  },
                  '.MuiInputBase-input': { fontWeight: 700 },
                },
              }}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={2} xl={1}>
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button type="submit">Lọc</Button>
            <Button
              variant="contained"
              endIcon={openExpand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={handleExpand}
              size="medium"
            />
          </ButtonGroup>
        </Grid>
        <Grid item xs={12}>
          <Collapse in={openExpand} timeout="auto">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2.5}>
                <ProFormAutocomplete
                  name="employeeId"
                  placeholder={t('Nhân viên phụ trách')}
                  options={[{ value: 0, label: '' }]}
                  renderLabel={(option) => option.label}
                  renderValue={(option) => option.value}
                />
              </Grid>

              <Grid item xs={6} sm={3} md={2} lg={3} xl={2}>
                <ProFormAutocomplete
                  name="storeId"
                  placeholder={t('Cửa hàng phụ trách')}
                  options={storeApplicationList}
                  renderLabel={(option) => option.value}
                  renderValue={(option) => option.id}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2.5} xl={1.8}>
                <ProFormCheckboxSelect
                  name="provinceId"
                  placeholder={t('Tỉnh')}
                  options={ProvinceList}
                  renderLabel={(option) => option.value}
                  renderValue={(option) => option.id}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2} xl={1.8}>
                <ProFormAutocomplete
                  name="debtLimit"
                  placeholder={t('Giới hạn')}
                  options={[
                    { value: 0, label: 'Nợ [Phải thu] > Giới hạn' },
                    { value: 1, label: 'Nợ [Phải thu] = Giới hạn' },
                    { value: 2, label: 'Nợ [Phải thu] < Giới hạn' },
                  ]}
                  renderLabel={(option) => option.label}
                  renderValue={(option) => option.value}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2.2} xl={2.2}>
                <ProFormAutocomplete
                  name="hasCod"
                  placeholder={t('COD')}
                  options={[
                    { value: 1, label: 'Không tính COD' },
                    { value: 2, label: 'Chỉ tính COD' },
                  ]}
                  renderLabel={(option) => option.label}
                  renderValue={(option) => option.value}
                />
              </Grid>
              <Grid item xs={6} sm={3} md={2} lg={2.5} xl={2.5}>
                <ProFormTextField
                  name="lastOrder"
                  placeholder={t('Tìm kiếm đơn hàng gần nhất')}
                  InputLabelProps={{ shrink: true }}
                  onBlur={(event) => trimSpaceForm(event, 'lastOrder')}
                />
              </Grid>
              <Grid item xs={6} sm={3} md={2} lg={2} xl={2}>
                <ProFormTextField
                  name="numberOfDaysOwed"
                  placeholder={t('Số ngày nợ')}
                  InputLabelProps={{ shrink: true }}
                  onBlur={(event) => trimSpaceForm(event, 'numberOfDaysOwed')}
                />
              </Grid>
            </Grid>
          </Collapse>
        </Grid>
      </Grid>
    </ProForm>
  );
});

export default FiltersForm;
