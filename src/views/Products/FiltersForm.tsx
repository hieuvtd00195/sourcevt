import { yupResolver } from '@hookform/resolvers/yup';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/system';
import { nanoid } from '@reduxjs/toolkit';
import ProForm from 'components/ProForm';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';
import ProFormFilterAction from 'components/ProForm/ProFormFilterAction';
import ProFormHiddenInput from 'components/ProForm/ProFormHiddenInput';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { FiltersRef } from 'types/refs';
import Validation from 'utils/Validation';
import { STATUS } from './utils/constants';
import type { FilterParams } from './utils/filters';
import { AppDispatch } from 'store';
import { useDispatch, useSelector } from 'react-redux';
import {
  getListStoreApplication,
  getStoreApplicationList,
} from 'slices/storeApplication';
import ProFormAutocompleteSingal from 'components/ProForm/ProFormAutocompleteSingal';
import ProFormAutocompleteMock from 'components/ProForm/ProFormAutocompleteMock';

const existenceStatus = [
  { value: '0', label: 'Đang giao hàng > 0' },
  { value: '1', label: 'Đang giao hàng <= 0' },
  { value: '2', label: 'Đang về > 0' },
  { value: '3', label: 'Đang về < 0' },
  { value: '4', label: 'Tạm giữ > 0' },
  { value: '5', label: 'Tạm giữ <= 0' },
  { value: '6', label: 'Có thể bán > 0' },
  { value: '7', label: 'Có thể bán <= 0' },
  { value: '8', label: 'Đặt trước > 0' },
  { value: '9', label: 'Đặt trước <= 0' },
];

const saleStatus = [
  { value: '0', label: 'Mới' },
  { value: '1', label: 'Đang bán' },
  { value: '2', label: 'Ngừng bán' },
  { value: '3', label: 'Hết hàng' },
  { value: '4', label: 'Thanh lý' },
];

interface FilterValues {}

const schema = Validation.shape({});

interface Props {
  onSearch: (params: Partial<FilterParams>) => void;
  onSubmit: VoidFunction;
  onClear: (params: Partial<FilterParams>) => void;
}

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { onSearch, onSubmit, onClear } = props;
  const dispatch = useDispatch<AppDispatch>();
  const storeApplicationList = useSelector(getStoreApplicationList);
  const { t } = useTranslation();
  const [openMoreFilter, setOpenMoreFilter] = useState<boolean>(false);

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

  useEffect(() => {
    fetchDataStoreApplication();
  }, []);

  const handleSubmit = (values: FilterValues) => {
    onSearch(values);
  };

  const handleReset = () => {
    form.reset(schema.getDefault());
    onClear({
      ...schema.getDefault(),
     
    });
  };

  useImperativeHandle(ref, () => ({
    reset: handleReset,
    submit: form.handleSubmit(handleSubmit),
  }));

  const onExpanded = () => setOpenMoreFilter(!openMoreFilter);

  return (
    <ProForm form={form} onFinish={handleSubmit} PaperProps={{ sx: { p: 2 } }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormCheckboxSelect<FieldValues, number>
            name="storeIds"
            placeholder={t('Cửa hàng')}
            options={storeApplicationList}
            renderLabel={(option) => option?.name}
            renderValue={(option) => option?.id}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2} lg={1.2}>
          <ProFormTextField
            name="sequence"
            placeholder={t('ID sản phẩm')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormTextField
            name="productName"
            placeholder={t('Tên, mã sản phẩm')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormCheckboxSelect
            name="productCategoryIds"
            label={t('Danh mục')}
            placeholder={t('Chọn danh mục')}
            options={[
              { value: nanoid(), label: 'Chưa gắn danh mục' },
              { value: nanoid(), label: 'Vỏ' },
              { value: nanoid(), label: 'Vỏ Độ' },
              { value: nanoid(), label: 'Pin ZIN' },
              { value: nanoid(), label: 'Lõi Pin' },
              { value: nanoid(), label: 'Pin EU' },
              { value: nanoid(), label: 'Màn hình' },
            ]}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2} lg={1.5}>
          <ProFormAutocompleteMock
            name="inventoryFilter"
            placeholder={'Tồn'}
            options={[
              { value: '0', label: 'Còn tồn' },
              { value: '1', label: 'Có thể bán' },
            ]}
            renderLabel={(option) => option.label}
            renderValue={(option) => option.value}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormFilterAction
            onSubmit={onSubmit}
            // onClear={onClear}
            onExpanded={onExpanded}
            openMoreFilter={openMoreFilter}
          />
        </Grid>
      </Grid>
      {openMoreFilter && (
        <Grid
          container
          spacing={1}
          columnSpacing={3}
          mt={2}
          alignItems="center"
        >
          {/* <Grid item xs={12} sm={6} md={4} lg={3}>
            <ProFormTextField name="brand" placeholder="IMEI" />
          </Grid> */}

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <ProFormAutocompleteMock
              name="inventorystatus"
              placeholder={'Trạng thái tồn'}
              options={existenceStatus}
              renderLabel={(option) => option.label}
              renderValue={(option) => option.value}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
              <ProFormAutocompleteMock
              name="status"
              placeholder={'Trạng thái bán'}
              options={saleStatus}
              renderLabel={(option) => option.label}
              renderValue={(option) => option.value}
            />
          </Grid>
        </Grid>
      )}

      <ProFormHiddenInput />
    </ProForm>
  );
});

export default FiltersForm;
