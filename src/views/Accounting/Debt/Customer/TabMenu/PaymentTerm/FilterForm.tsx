import React from 'react';
import Validation from 'utils/Validation';
import { FilterParams } from './utils/filters';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import DateTime from 'utils/DateTime';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { FiltersRef } from 'types/refs';
import ProForm from 'components/ProForm';
import { Grid, Typography } from '@mui/material';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormFilterAction from 'components/ProForm/ProFormFilterAction';
import Collapse from '@mui/material/Collapse';

interface Props {
  onSearch: (params: Partial<FilterParams>) => void;
  onSubmit: VoidFunction;
  onClear: VoidFunction;
}

interface FilterValues {
  [key: string]: any;
}

const schema = Validation.shape({
  startDateCreate: Validation.string().optional().default(null),
  endDateCreate: Validation.string().optional().default(null),
  startDatePayment: Validation.string().optional().default(null),
  endDatePayment: Validation.string().optional().default(null),
  document: Validation.string().optional().default(''),
  typeDocument: Validation.select(0).optional(),
  customer: Validation.string().optional().default(null),
  creator: Validation.string().optional().default(null),
  seller: Validation.string().optional().default(null),
  paymentStatus: Validation.select(0).optional(),
  store: Validation.string().optional().default(null),
});

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { onSearch, onSubmit, onClear } = props;
  const { t } = useTranslation();

  const [isShowFilters, setIsShowFilters] = useState<boolean>();

  const form = useForm<FilterValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const handleSubmit = (values: FilterValues) => {
    const {
      startDateCreate,
      endDateCreate,
      startDatePayment,
      endDatePayment,
      ...rest
    } = values;

    onSearch({
      ...rest,
      startDateCreate: DateTime.Format(startDateCreate),
      endDateCreate: DateTime.Format(endDateCreate),
      startDatePayment: DateTime.Format(startDatePayment),
      endDatePayment: DateTime.Format(endDatePayment),
    });
  };

  const handleReset = () => {
    form.reset(schema.getDefault());
  };

  useImperativeHandle(ref, () => ({
    reset: handleReset,
    submit: form.handleSubmit(handleSubmit),
  }));

  const onExpended = () => {
    setIsShowFilters(!isShowFilters);
  };

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
              { value: 1, label: 'Linh kiện SG' },
              { value: 2, label: 'Linh kiện HN' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.2}>
          <ProFormTextField
            name="document"
            placeholder={t('Chứng từ')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProDateRange
            label={t('Ngày tạo')}
            from="startDateCreate"
            to="endDateCreate"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProDateRange
            label={t('Hạn thanh toán')}
            from="startDatePayment"
            to="endDatePayment"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.5}>
          <ProFormSelect
            name="typeDocument"
            placeholder={t('Loại chứng từ')}
            options={[
              { value: 1, label: 'Khách lẻ' },
              { value: 2, label: 'Khách sỉ' },
              { value: 3, label: 'Đại lý' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <ProFormFilterAction
            onSubmit={onSubmit}
            onClear={onClear}
            onExpanded={onExpended}
          />
        </Grid>
      </Grid>
      <Collapse in={isShowFilters} timeout="auto">
        <Grid container spacing={2} mt={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4} lg={1.15}>
            <Typography>Người lập phiếu</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={1.85}>
            <ProFormTextField
              name="creator"
              placeholder={t('Người lập phiếu')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={1.15}>
            <Typography>Khách hàng</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={1.85}>
            <ProFormTextField
              name="customer"
              placeholder={t('Khách hàng')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={1.45}>
            <Typography>Nhân viên bán hàng</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={1.65}>
            <ProFormTextField
              name="seller"
              placeholder={t('Nhân viên bán hàng')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <ProFormSelect
              name="paymentStatus"
              placeholder={t('--.--')}
              options={[
                { value: 1, label: 'Còn nợ' },
                { value: 2, label: 'Hết nợ' },
              ]}
            />
          </Grid>
        </Grid>
      </Collapse>
    </ProForm>
  );
});

export default FiltersForm;
