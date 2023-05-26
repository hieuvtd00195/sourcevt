import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProForm from 'components/ProForm';
import ProFormHiddenInput from 'components/ProForm/ProFormHiddenInput';
import { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Validation from 'utils/Validation';
import type { FilterParams } from './utils/filters';
import { FiltersRef } from 'types/refs';
import DateTime from 'utils/DateTime';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';

interface FilterValues {
  startDate: Date | null;
  endDate: Date | null;
}

const schema = Validation.shape({
  startDate: Validation.date().optional(),
  endDate: Validation.date().optional(),
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
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <ProFormCheckboxSelect
            name="store"
            label={t('Cửa hàng')}
            placeholder={t('Chọn cửa hàng')}
            options={[
              { value: 1, label: 'Linh kiện Sài Gòn' },
              { value: 2, label: 'HN-1' },
            ]}
            renderLabel={(option) => option.label}
            renderValue={(option) => option.value}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <ProDateRange label={t('Chọn ngày')} from="startDate" to="endDate" />
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={1}>
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
