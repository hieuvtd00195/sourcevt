import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Collapse } from '@mui/material';
import Grid from '@mui/material/Grid';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProForm from 'components/ProForm';
import ProFormAutocomplete from 'components/ProForm/Label/ProFormAutocomplete';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormFilterAction from 'components/ProForm/ProFormFilterAction';
// import ProFormHiddenInput from 'components/ProForm/ProFormHiddenInput';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { FiltersRef } from 'types/refs';
// import DateFns from 'utils/DateFns';
import { nanoid } from '@reduxjs/toolkit';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';
import Validation from 'utils/Validation';
import type { FilterParams } from './utils/filters';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import { isEmpty } from 'lodash';
import {
  getListStoreApplication,
  getStoreApplicationList,
} from 'slices/storeApplication';
import {
  getListProductCategory,
  getProductCategoryList,
} from 'slices/productCategory';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import { getStoreByUser } from 'slices/billCustomerApplicationSlice';

interface FilterValues {
  [key: string]: any;
}

const schema = Validation.shape({
  storeIds: Validation.array().optional().default([]),
  billCustomerCode: Validation.string().optional().default(null),
  createTimeFrom: Validation.string().optional().default(null),
  createTimeTo: Validation.string().optional().default(null),
  customerName: Validation.string().optional().default(null),
  productName: Validation.string().optional().default(null),
  employeeCashier: Validation.string().optional().default(null),
  couponCode: Validation.string().optional().default(null),
  productCategory: Validation.string().optional().default(null),
  employeeSell: Validation.string().optional().default(null),
  description: Validation.string().optional().default(null),
  employeeTech: Validation.string().optional().default(null),
  iMei: Validation.string().optional().default(null),
});

interface Props {
  onSearch: (params: Partial<FilterParams>) => void;
  onSubmit: VoidFunction;
  onClear: VoidFunction;
}

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { onSearch, onSubmit, onClear } = props;
  const dispatch = useDispatch<AppDispatch>();
  const storeApplicationList = useSelector(getStoreApplicationList);
  const productCategoryList = useSelector(getProductCategoryList);
  
  const { t } = useTranslation();
  const [collapseFilter, setcollapseFilter] = useState<boolean>(false);
  const form = useForm<FilterValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const fetchDataStoreApplication = async () => {
    try {
      await dispatch(getListStoreApplication({}));
    } catch (error) {
    } finally {
    }
  };


  const fetchDataProductCategory = async () => {
    try {
      await dispatch(getListProductCategory({}));
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchDataStoreApplication();
    fetchDataProductCategory();

  }, []);

  const handleSubmit = (values: FilterValues) => {
    const { createTimeFrom, createTimeTo, ...rest } = values;

    onSearch({
      iMei: !isEmpty(values.iMei) ? values.iMei : null,
      employeeTech: !isEmpty(values.employeeTech) ? values.employeeTech : null,
      description: !isEmpty(values.description) ? values.description : null,
      employeeSell: !isEmpty(values.employeeSell) ? values.employeeSell : null,
      productCategory: !isEmpty(values.productCategory)
        ? values.productCategory
        : null,
      couponCode: !isEmpty(values.couponCode) ? values.couponCode : null,
      employeeCashier: !isEmpty(values.employeeCashier)
        ? values.employeeCashier
        : null,
      productName: !isEmpty(values.productName) ? values.productName : null,
      customerName: !isEmpty(values.customerName) ? values.customerName : null,
      createTimeTo: !isEmpty(values.createTimeTo) ? values.createTimeTo : null,
      createTimeFrom: !isEmpty(values.createTimeFrom)
        ? values.createTimeFrom
        : null,
      billCustomerCode: !isEmpty(values.billCustomerCode)
        ? values.billCustomerCode
        : null,
      storeIds: values.storeIds,
      isCheckData: false
      // ...values,
    });
  };

  const handleReset = () => {
    form.reset(schema.getDefault());
  };

  useImperativeHandle(ref, () => ({
    reset: handleReset,
    submit: form.handleSubmit(handleSubmit),
  }));

  return (
    <ProForm form={form} onFinish={handleSubmit} PaperProps={{ sx: { p: 2 } }}>
      {/* filter */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <ProFormCheckboxSelect<FieldValues, number>
            name="storeIds"
            placeholder={t('Cửa hàng')}
            options={storeApplicationList}
            renderLabel={(option) => option?.name}
            renderValue={(option) => option?.id}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={1}>
          <ProFormTextField
            name="billCustomerCode"
            placeholder={t('ID hóa đơn')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <ProDateRange label="" from="createTimeFrom" to="createTimeTo" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <ProFormTextField
            name="customerName"
            placeholder={t('Khách hàng')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <ProFormTextField
            name="productName"
            placeholder={t('Sản phẩm')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={1}>
          <ProFormFilterAction
            onSubmit={onSubmit}
            onClear={onClear}
            onExpanded={() => setcollapseFilter(!collapseFilter)}
          />
        </Grid>
        <Grid item xs={2} sm={2} md={3} lg={1.5}>
          <Button
            size="medium"
            color="info"
            onClick={() =>
              onSearch({ ...schema.getDefault(), isCheckData: true })
            }
          >
            {t('Check số liệu')}
          </Button>
        </Grid>
      </Grid>
      {/* <ProFormHiddenInput /> */}
      {/* advance filter */}
      <Collapse in={collapseFilter} timeout="auto">
        <Grid container spacing={2} style={{ marginTop: 1 }}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <ProFormTextField
              name="employeeCashier"
              placeholder={t('NV thu ngân')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <ProFormTextField
              name="couponCode"
              placeholder={t('Mã Coupon')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          {/* 2 */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <ProFormTextField
              name="iMei"
              placeholder={t('IMEI')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            {/* <ProFormCheckboxSelect
              name="productCategory"
              placeholder={t('Loại sản phẩm')}
              options={productCategoryList}
              renderLabel={(option) => option?.value ?? ''}
              renderValue={(option) => option?.id ?? ''}
            /> */}
            <ProFormSelect
              name="productCategory"
              placeholder={t('Chọn loại phiếu')}
              options={productCategoryList}
              renderLabel={(option) => option?.value ?? ''}
              renderValue={(option) => option?.id ?? ''}
            />
            {/* <ProFormAutocomplete
              name="productCategory"
              placeholder={t('Chọn danh mục')}
              options={[
                { value: 1, label: 'TM' },
                { value: 2, label: 'HN-1' },
                { value: 3, label: 'HN-2' },
                { value: 4, label: 'Sài Gòn' },
                { value: 5, label: 'VTech Thanh Hóa' },
              ]}
              renderLabel={(option) => option.label}
              renderValue={(option) => option.value}
            /> */}
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <ProFormTextField
              name="employeeSell"
              placeholder={t('NV bán hàng')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <ProFormTextField
              name="description"
              placeholder={t('Mô tả')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          {/* 3 */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <ProFormTextField
              name="employeeTech"
              placeholder={t('NV kỹ thuật')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          {/* <Grid item xs={12} sm={6} md={4} lg={3}>
            <ProFormTextField
              name="customer"
              placeholder={t('Nguồn khách hàng')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid> */}
        </Grid>
        {/* 4 */}
      </Collapse>
    </ProForm>
  );
});

export default FiltersForm;
