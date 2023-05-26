import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProForm from 'components/ProForm';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';
import ProFormFilterAction from 'components/ProForm/ProFormFilterAction';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import React, { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FiltersRef } from 'types/refs';
import DateTime from 'utils/DateTime';
import Validation from 'utils/Validation';
import { FilterParams } from './utils/filters';
import ProFormAutocomplete from 'components/ProForm/Label/ProFormAutocomplete';

interface FilterValues {
  store: number | null;
  id: number | null;
  priceName: string | null;
  startDate: string | null;
  endDate: string | null;
  status: number | null;
  category: number | null;
}
const schema = Validation.shape({
  store: Validation.select(0).optional(),
  status: Validation.select(0).optional(),
  category: Validation.select(0).optional(),
  id: Validation.number().optional(),
  priceName: Validation.string().optional(),
  startDate: Validation.string().optional(),
  endDate: Validation.string().optional(),
});

interface Props {
  onSearch: (params: Partial<FilterParams>) => void;
  onSubmit: VoidFunction;
  onClear: VoidFunction;
}

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { onSearch, onSubmit, onClear } = props;
  const { t } = useTranslation();

  const form = useForm<FilterValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const handleSubmit = (values: FilterValues) => {
    const { startDate, endDate, ...rest } = values;

    onSearch({
      ...rest,
      startDate: DateTime.Format(startDate),
      endDate: DateTime.Format(endDate),
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
    <ProForm
      form={form}
      onFinish={handleSubmit}
      PaperProps={{ sx: { padding: '16px 16px 0 16px' } }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <ProFormCheckboxSelect
            name="store"
            placeholder={t('Cửa hàng')}
            options={[
              { value: 1, label: 'Hà Nội' },
              { value: 2, label: 'Sài Gòn' },
              { value: 3, label: 'Đà Nẵng' },
            ]}
            renderLabel={(option) => option.label}
            renderValue={(option) => option.value}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <ProFormCheckboxSelect
            name="customerId"
            placeholder={t('Khách hàng')}
            options={[
              { value: 1, label: 'Hà Nội' },
              { value: 2, label: 'Sài Gòn' },
              { value: 3, label: 'Đà Nẵng' },
            ]}
            renderLabel={(option) => option.label}
            renderValue={(option) => option.value}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1}>
          <ProFormTextField
            name="id"
            placeholder={t('ID')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        {/* <Grid item xs={12} sm={6} md={4} lg={2}>
          <ProFormCheckboxSelect
            name="category"
            label={t('Danh mục')}
            placeholder={t('Danh mục')}
            options={[
              { value: 1, label: 'Chưa gắn danh mục' },
              { value: 2, label: 'Vỏ' },
              { value: 3, label: 'Vỏ Độ' },
              { value: 4, label: 'Pin ZIN' },
              { value: 5, label: 'Lõi Pin' },
              { value: 6, label: 'Pin EU' },
              { value: 7, label: 'Màn hình' },
            ]}
          />
        </Grid> */}

        {/* <Grid item xs={12} sm={6} md={3} lg={2}>
          <ProFormTextField
            name="priceName"
            placeholder={t('Tên bảng giá')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid> */}
        <Grid item xs={6} sm={3} md={2} lg={3} xl={2}>
          <ProFormAutocomplete
            name="priceName"
            placeholder={t('Tên bảng giá')}
            options={[
              { id: 1, value: 'Bảng giá 1' },
              { id: 2, value: 'Bảng giá 2' },
              { id: 3, value: 'Bảng giá 3' },
            ]}
            renderLabel={(option) => option?.value}
            renderValue={(option) => option?.id}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.2}>
          <ProDateRange
            label={t('Khoảng ngày')}
            from="startDate"
            to="endDate"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.5}>
          <ProFormSelect
            name="status"
            placeholder={t('-Trạng thái-')}
            options={[
              { value: 1, label: 'Hoạt động' },
              { value: 2, label: 'Không hoạt động' },
            ]}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2} lg={3} xl={2}>
          <ProFormAutocomplete
            name="priceParent"
            placeholder={t('Tên bảng giá cha')}
            options={[
              { id: 1, value: 'Bảng giá 1' },
              { id: 2, value: 'Bảng giá 2' },
              { id: 3, value: 'Bảng giá 3' },
            ]}
            renderLabel={(option) => option?.value}
            renderValue={(option) => option?.id}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1}>
          <ProFormFilterAction onSubmit={onSubmit} onClear={onClear} />
        </Grid>
      </Grid>
    </ProForm>
  );
});

export default FiltersForm;
