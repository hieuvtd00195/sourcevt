import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProForm from 'components/ProForm';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormHiddenInput from 'components/ProForm/ProFormHiddenInput';
import { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { FiltersRef } from 'types/refs';
import Validation from 'utils/Validation';
import type { FilterParams } from './utils/filters';
import DateTime from 'utils/DateTime';
import { PriceInput } from 'plugins/NumberFormat';

interface FilterValues {
  status: number;
  billCreator: string;
  startDate: Date | null;
  endDate: Date | null;
}

const schema = Validation.shape({
  status: Validation.select(0),
  billCreator: Validation.string().optional(),
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
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <ProDateRange from="startDate" to="endDate" label="Chọn ngày" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <ProFormSelect
            name="status"
            placeholder={t('Trạng thái')}
            options={[
              { value: 0, label: '-Trạng thái-' },
              { value: 1, label: 'Kích hoạt' },
              { value: 2, label: 'Không kích hoạt' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <ProFormTextField
            name="billCreator"
            placeholder="Nhân viên lập phiếu"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={0.6}>
          <Button type="submit" size="medium">
            Lọc
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <ProFormTextField
            name="money"
            placeholder="Nhân dân tệ"
            InputProps={{
              inputComponent: PriceInput,
            }}
          />
        </Grid>
      </Grid>
      <ProFormHiddenInput />
    </ProForm>
  );
});

export default FiltersForm;
