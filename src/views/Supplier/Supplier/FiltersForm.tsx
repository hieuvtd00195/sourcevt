import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import ProForm from 'components/ProForm';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FiltersRef } from 'types/refs';
import DateTime from 'utils/DateTime';
import Validation from 'utils/Validation';
import type { FilterParams } from './utils/filters';

interface FilterValues {
  id: string;
  supplier: string;
  startDate: Date | null;
  endDate: Date | null;
  mobilePhone: string;
  creator: string;
  type: number;
  status: number;
}

const schema = Validation.shape({
  id: Validation.string().optional(),
  supplier: Validation.string().optional(),
  startDate: Validation.date().optional(),
  endDate: Validation.date().optional(),
  mobilePhone: Validation.string().optional(),
  creator: Validation.string().optional(),
  type: Validation.select(0),
  status: Validation.select(0),
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
      PaperProps={{ sx: { padding: 2 } }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3} lg={0.8}>
          <ProFormTextField
            name="id"
            placeholder={t('ID')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.25}>
          <ProFormTextField
            name="supplier"
            placeholder={t('Nhà cung cấp')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.25}>
          <ProFormTextField
            name="mobilePhone"
            placeholder={t('Điện thoại')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.25}>
          <ProFormTextField
            name="creator"
            placeholder={t('Người tạo')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.25}>
          <ProFormSelect
            name="type"
            placeholder={t('Loại')}
            options={[
              { value: 0, label: '-Loại-' },
              { value: 1, label: 'Việt Nam' },
              { value: 2, label: 'Trung Quốc' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.25}>
          <ProFormSelect
            name="status"
            placeholder={t('Trạng thái')}
            options={[
              { value: 0, label: '-Trạng thái-' },
              { value: 1, label: 'Đang giao dịch' },
              { value: 2, label: 'Ngừng giao dịch' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={1}>
          <Button variant="contained" type="submit" size="medium">
            Lọc
          </Button>
        </Grid>
      </Grid>
    </ProForm>
  );
});

export default FiltersForm;
