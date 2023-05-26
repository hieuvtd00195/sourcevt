import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import ProForm from 'components/ProForm';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';
import ProFormFilterAction from 'components/ProForm/ProFormFilterAction';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import { forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FiltersRef } from 'types/refs';
import Validation from 'utils/Validation';
import { FilterParams } from './utils/filters';

interface FilterValues {
  store: number | null;
  selected: number | null;
  code: string | null;
}

const schema = Validation.shape({
  store: Validation.select(0).optional(),
  selected: Validation.select(0).optional(),
  code: Validation.string().optional(),
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
    const { ...rest } = values;
    onSearch({
      ...rest,
    });
  };

  return (
    <ProForm form={form} onFinish={handleSubmit} PaperProps={{ sx: { p: 2 } }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={2.5}>
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
        <Grid item xs={12} sm={6} md={4} lg={2.5}>
          <ProFormCheckboxSelect
            name="selected"
            placeholder={t('Bảng giá')}
            options={[
              { value: 1, label: 'Cell 500/đơn' },
              { value: 2, label: 'Cell 300/đơn' },
              { value: 3, label: 'Cell 100/đơn' },
              { value: 4, label: 'Giá Spa' },
              { value: 5, label: 'Giá vốn' },
            ]}
            renderLabel={(option) => option.label}
            renderValue={(option) => option.value}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.5}>
          <ProFormTextField
            name="code"
            placeholder={t('Mã/Mã vạch/Tên sản phẩm')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <ProFormFilterAction onSubmit={onSubmit} onClear={onClear} />
        </Grid>
      </Grid>
    </ProForm>
  );
});

export default FiltersForm;
