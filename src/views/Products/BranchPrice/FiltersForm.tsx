import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import ProForm from 'components/ProForm';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormHiddenInput from 'components/ProForm/ProFormHiddenInput';
import { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { FiltersRef } from 'types/refs';
import Validation from 'utils/Validation';
import type { FilterParams } from './utils/filters';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';

interface FilterValues {
  product: string;
  category: number[];
  internalCategory: number[];
  branch: number[];
}

const schema = Validation.shape({
  product: Validation.string().optional(),
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
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <ProFormTextField name="product" placeholder="Sản phẩm" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <ProFormCheckboxSelect
            name="category"
            placeholder={t('Danh mục')}
            options={[
              { value: 1, label: 'Tuvít' },
              { value: 2, label: 'Phím' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <ProFormCheckboxSelect
            name="internalCategory"
            placeholder={t('Danh mục nội bộ')}
            options={[
              { value: 1, label: 'Tuvit' },
              { value: 2, label: 'Phím' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <ProFormCheckboxSelect
            name="branch"
            placeholder={t('Chi nhánh')}
            options={[
              { value: 1, label: 'HN' },
              { value: 2, label: 'HCM' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={0.6}>
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
