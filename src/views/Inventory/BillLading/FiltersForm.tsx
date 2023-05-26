import { yupResolver } from '@hookform/resolvers/yup';
import Grid from '@mui/material/Grid';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProForm from 'components/ProForm';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormFilterAction from 'components/ProForm/ProFormFilterAction';
import ProFormHiddenInput from 'components/ProForm/ProFormHiddenInput';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { FiltersRef } from 'types/refs';
import Validation from 'utils/Validation';
import { STATUS } from './utils/constants';
import type { FilterParams } from './utils/filters';
import ProFormAutocomplete from 'components/ProForm/Label/ProFormAutocomplete';
import dayjs from 'dayjs';

interface FilterValues {
  [key: string]: any;
}

const schema = Validation.shape({});

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
    const params = {
      ...values,
      fromDate: values?.fromDate
        ? dayjs(values?.fromDate).format('YYYY-MM-DD')
        : null,
      toDate: values?.toDate
        ? dayjs(values?.toDate).format('YYYY-MM-DD')
        : null,
    };
    onSearch(params);
  };

  const handleReset = () => {
    form.reset(schema.getDefault());
  };

  useImperativeHandle(ref, () => ({
    reset: handleReset,
    submit: form.handleSubmit(handleSubmit),
  }));

  const trimSpace = (event: any, name: string) => {
    const value = event.target.value;
    form.setValue(name, value.trim());
  };

  return (
    <ProForm form={form} onFinish={handleSubmit} PaperProps={{ sx: { p: 2 } }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={2.5} xl={2.2}>
          <ProDateRange label={t('Từ - Đến')} from="fromDate" to="toDate" />
        </Grid>

        <Grid item xs={6} sm={3} md={4} lg={1.5} xl={1.5}>
          <ProFormTextField
            name="saleOrderCode"
            placeholder={t('ID yêu cầu')}
            InputLabelProps={{ shrink: true }}
            onBlur={(event) => trimSpace(event, 'saleOrderCode')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={1.5} xl={1.5}>
          <ProFormTextField
            name="orderTransportCode"
            placeholder={t('Mã vận đơn')}
            InputLabelProps={{ shrink: true }}
            onBlur={(event) => trimSpace(event, 'orderTransportCode')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2} xl={1.5}>
          <ProFormTextField
            name="suplier"
            placeholder={t('Nhà cung cấp')}
            InputLabelProps={{ shrink: true }}
            onBlur={(event) => trimSpace(event, 'suplier')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2} xl={1.5}>
          <ProFormTextField
            name="transporter"
            placeholder={t('Nhà vận chuyển')}
            InputLabelProps={{ shrink: true }}
            onBlur={(event) => trimSpace(event, 'transporter')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={1.5} xl={1.5}>
          <ProFormAutocomplete
            name="status"
            placeholder="Trạng thái"
            options={[
              { value: 0, label: 'Chưa nhận' },
              { value: 1, label: 'Đã nhận' },
            ]}
            renderLabel={(option) => option.label}
            renderValue={(option) => option.value}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2} lg={1} xl={1.2}>
          <ProFormFilterAction onSubmit={onSubmit} onClear={onClear} />
        </Grid>
      </Grid>

      <ProFormHiddenInput />
    </ProForm>
  );
});

export default FiltersForm;
