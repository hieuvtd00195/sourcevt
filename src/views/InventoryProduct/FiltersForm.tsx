import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import ProForm from 'components/ProForm';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormHiddenInput from 'components/ProForm/ProFormHiddenInput';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { FiltersRef } from 'types/refs';
import Validation from 'utils/Validation';
import type { FilterParams } from './utils/filters';
import DateTime from 'utils/DateTime';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';
import { useDispatch, useSelector } from 'react-redux';
import { getStoreApplicationList } from 'slices/storeApplication';
import { AppDispatch } from 'store';
import { getListStoreApplication } from 'slices/storeApplication';

interface FilterValues {
  storeIds: string[] | [];
  productCategoryIds: string[] | [];
  productCode: string | null;
  productName: string | null;
  inventoryFilter: number | null;
  inventoryStatus: number | null;
}


const schema = Validation.shape({
  productCode: Validation.string().optional().trim(),
  productName: Validation.string().optional().trim(),
  // storeIds: Validation.string().optional(),
  // inventoryFilter: Validation.string().optional(),
  // inventoryStatus: Validation.string().optional(),
  // productCategoryIds: Validation.string().optional()
});

interface Props {
  onSearch: (params: Partial<FilterParams>) => void;
  checkReset: boolean;
}

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { onSearch, checkReset } = props;
  const { t } = useTranslation();

  const dispatch = useDispatch<AppDispatch>()
  const form = useForm<FilterValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const storeApplicationList = useSelector(getStoreApplicationList);

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
    const { ...rest } = values;

    onSearch({
      ...rest,
      // startDate: DateTime.Format(startDate),
      // endDate: DateTime.Format(endDate),
    });
  };

  const handleReset = () => {
    form.reset(schema.getDefault());
  };

  useEffect(() => {
    form.reset(schema.getDefault());
  }, [checkReset]);

  useImperativeHandle(ref, () => ({
    reset: handleReset,
    submit: form.handleSubmit(handleSubmit),
  }));

  return (
    <ProForm
      form={form}
      onFinish={handleSubmit}
      PaperProps={{ sx: { padding: '16px 16px 0 16px' } }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3} lg={0.5}>
          <ProFormTextField
            name="productCode"
            placeholder={t('ID')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.5}>
          <ProFormTextField
            name="productName"
            placeholder={t('Sản phẩm')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <ProFormCheckboxSelect
            name="storeIds"
            placeholder={t('Cửa hàng')}
            options={storeApplicationList}
            renderLabel={(option) => option?.name}
            renderValue={(option) => option?.id}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <ProFormSelect
            name="inventoryFilter"
            placeholder={t('Chọn hàng tồn')}
            options={[
              { value: 0, label: 'Tất cả' },
              { value: 1, label: 'Còn tồn' },
              { value: 2, label: 'Còn có thể bán' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <ProFormSelect
            name="productCategoryIds"
            placeholder={t('Danh mục')}
            options={[
              { value: 0, label: '-Danh mục-' },
              { value: 1, label: 'Tuvit' },
              { value: 2, label: 'Pin' },
              { value: 3, label: 'Vỏ' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <ProFormSelect
            name="inventoryStatus"
            placeholder={t('Trạng thái')}
            options={[
              { value: 0, label: '-Trạng Thái-' },
              { value: 1, label: 'Mới' },
              { value: 2, label: 'Đang bán' },
              { value: 3, label: 'Hết hàng' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={0.5}>
          <Button type="submit" size="medium">
            Lọc
          </Button>
        </Grid>
      </Grid>
      <ProFormHiddenInput />
    </ProForm>
  );
});

export default FiltersForm;
