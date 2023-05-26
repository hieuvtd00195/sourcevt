import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import ProForm from 'components/ProForm';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormFilterAction from 'components/ProForm/ProFormFilterAction';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FiltersRef } from 'types/refs';
import Validation from 'utils/Validation';
import { FilterParams } from './utils/filter';

interface FilterValues {
  id: number | null;
  formCare: string | null;
  action: number | null;
}

interface Props {
  onSearch: (params: Partial<FilterParams>) => void;
  onSubmit: VoidFunction;
  onClear: VoidFunction;
}

const optionsActions = [
  { value: 1, label: 'Tặng điểm' },
  { value: 2, label: 'Trừ điểm' },
  { value: 3, label: 'Tặng tiền tích lũy' },
  { value: 4, label: 'Trừ tiền tích lũy' },
  { value: 5, label: 'Gọi điện' },
  { value: 6, label: 'Nhắn tin' },
  { value: 7, label: 'Gửi email' },
  { value: 8, label: 'Nhận cuộc gọi' },
];

const schema = Validation.shape({
  id: Validation.number().optional().default(null),
  formCare: Validation.string().optional().default(null),
  action: Validation.select(0).optional().default(null),
});

const FilterForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { onSearch, onSubmit, onClear } = props;
  const { t } = useTranslation();
  const form = useForm<FilterValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const handleSubmit = (values: FilterValues) => {
    const { ...rest } = values;

    onSearch({
      ...rest,
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
        <Grid item xs={12} sm={6} md={4} lg={1.5}>
          <ProFormTextField
            name="id"
            placeholder={t('ID')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.5}>
          <ProFormTextField
            name="formCare"
            placeholder={t('Hình thức chăm sóc')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2.5}>
          <ProFormSelect
            name="action"
            placeholder={t('-Hành động')}
            options={optionsActions}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1}>
          <ProFormFilterAction onSubmit={onSubmit} onClear={onClear} />
        </Grid>
      </Grid>
    </ProForm>
  );
});

export default FilterForm;
