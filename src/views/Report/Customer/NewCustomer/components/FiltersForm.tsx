import { FiltersRef } from 'types/refs';
import Validation from 'utils/Validation';
import { FilterParams } from '../utils/filters';
import { forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DateTime from 'utils/DateTime';
import ProForm from 'components/ProForm';
import { Grid } from '@mui/material';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProFormSelect from 'components/ProForm/ProFormSelect';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import ProFormFilterAction from 'components/ProForm/ProFormFilterAction';

interface FilterValues {
  startDate: string | null;
  endDate: string | null;
  personInCharge: string;
  timeUnit: string | number | null;
}

const schema = Validation.shape({
  startDate: Validation.string().optional().default(null),
  endDate: Validation.string().optional().default(null),
  personInCharge: Validation.string().optional().default(''),
  timeUnit: Validation.select(0),
});

interface Props {
  onSearch: (params: Partial<FilterParams>) => void;
  onSubmit: VoidFunction;
  onClear: VoidFunction;
}

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { t } = useTranslation();
  const { onSearch, onSubmit, onClear } = props;
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
    <ProForm form={form} onFinish={handleSubmit} PaperProps={{ sx: { p: 2 } }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProDateRange
            label={t('Khoảng ngày')}
            from="startDate"
            to="endDate"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormSelect
            name="timeUnit"
            placeholder={t('Chọn thời gian')}
            options={[
              { value: 1, label: 'Ngày' },
              { value: 2, label: 'Tháng' },
            ]}
            renderLabel={(option) => option.label}
            renderValue={(option) => option.value}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2} lg={2.4}>
          <ProFormTextField
            name="personInCharge"
            placeholder="Tên người phụ trách"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormFilterAction onSubmit={onSubmit} onClear={onClear} />
        </Grid>
      </Grid>
    </ProForm>
  );
});

export default FiltersForm;
