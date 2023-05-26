import { yupResolver } from '@hookform/resolvers/yup';
import Grid from '@mui/material/Grid';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProForm from 'components/ProForm';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormFilterAction from 'components/ProForm/ProFormFilterAction';
import ProFormHiddenInput from 'components/ProForm/ProFormHiddenInput';
import { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { FiltersRef } from 'types/refs';
import Validation from 'utils/Validation';
import { STATUS } from './utils/constants';
import type { FilterParams } from './utils/filters';

interface FilterValues {
  searchText: string;
  status: number;
}

const schema = Validation.shape({
  name: Validation.string().optional(),
  status: Validation.select(STATUS.ALL),
  inventory: Validation.select(1),
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
    onSearch(values);
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
          <ProDateRange label={t('Từ - Đến')} from="startDate" to="endDate" />
        </Grid>

        <Grid item xs={6} sm={3} md={2} lg={1.2}>
          <ProFormTextField
            name="name"
            placeholder={t('ID')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormTextField
            name="name"
            placeholder={t('Nhà cung cấp')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormTextField
            name="name"
            placeholder={t('Số hóa đơn')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormTextField
            name="name"
            placeholder={t('Sản phẩm')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={6} sm={3} md={2} lg={1.2}>
          <ProFormFilterAction onSubmit={onSubmit} onClear={onClear} />
        </Grid>
      </Grid>

      <ProFormHiddenInput />
    </ProForm>
  );
});

export default FiltersForm;
