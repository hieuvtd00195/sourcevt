import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProForm from 'components/ProForm';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormHiddenInput from 'components/ProForm/ProFormHiddenInput';
import { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { FiltersRef } from 'types/refs';
import Validation from 'utils/Validation';
import type { FilterParams } from './utils/filters';
import DateTime from 'utils/DateTime';
import ProFormAutocomplete from 'components/ProForm/Label/ProFormAutocomplete';

interface FilterValues {
  store: number;
  inventoryType: number;
  expireStartDate: Date | null;
  expireEndDate: Date | null;
  createStartDate: Date | null;
  createEndDate: Date | null;
  city: number | null;
  distric: number | null;
}

const schema = Validation.shape({
  store: Validation.select(0),
  inventoryType: Validation.select(0),
  expireStartDate: Validation.date(),
  expireEndDate: Validation.date(),
  createStartDate: Validation.date(),
  createEndDate: Validation.date(),
  city: Validation.number().nullable().default(null).optional(),
  distric: Validation.number().nullable().default(null).optional(),
});

interface Props {
  onSearch: (params: Partial<FilterParams>) => void;
}

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { onSearch } = props;
  const { t } = useTranslation();

  const form = useForm<FilterValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const handleSubmit = (values: FilterValues) => {
    const {
      expireStartDate,
      expireEndDate,
      createStartDate,
      createEndDate,
      ...rest
    } = values;

    onSearch({
      ...rest,
      expireStartDate: DateTime.Format(expireStartDate),
      expireEndDate: DateTime.Format(expireEndDate),
      createStartDate: DateTime.Format(createStartDate),
      createEndDate: DateTime.Format(createEndDate),
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
        <Grid item xs={12} sm={6} md={3} lg={1.5}>
          <ProFormSelect
            name="store"
            placeholder={t('Cửa hàng')}
            options={[
              { value: 0, label: '-Cửa hàng-' },
              { value: 1, label: 'Linh kiện sài gòn' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.5}>
          <ProFormSelect
            name="inventoryType"
            placeholder={t('Kiểu kho')}
            options={[
              { value: 0, label: '-Kiểu kho-' },
              { value: 1, label: 'Bán lẻ' },
              { value: 2, label: 'Đơn hàng' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.5}>
          <ProDateRange
            label="Hết hạn"
            from="expireStartDate"
            to="expireEndDate"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.5}>
          <ProDateRange
            label="Ngày tạo"
            from="createStartDate"
            to="createEndDate"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.5}>
          <ProFormAutocomplete
            name="city"
            placeholder={t('Thành phố')}
            options={[
              { value: 1, label: 'Hà Nội' },
              { value: 2, label: 'Nam Định' },
            ]}
            renderLabel={(option) => option.label}
            renderValue={(option) => option.value}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.5}>
          <ProFormAutocomplete
            name="distric"
            placeholder={t('Quận huyện')}
            options={[
              { value: 1, label: 'Thanh Xuân' },
              { value: 2, label: 'Duy Tân' },
            ]}
            renderLabel={(option) => option.label}
            renderValue={(option) => option.value}
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
