import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProForm from 'components/ProForm';
import ProFormAutocomplete from 'components/ProForm/Label/ProFormAutocomplete';
import ProFormFilterAction from 'components/ProForm/ProFormFilterAction';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IParamsSearchPurchaseHistory } from 'types/purchaseHistory';
import { FiltersRef } from 'types/refs';
import DateTime from 'utils/DateTime';
import Validation from 'utils/Validation';

interface Props {
  onSearch: (params: Partial<IParamsSearchPurchaseHistory>) => void;
  onSubmit: VoidFunction;
  onClear: VoidFunction;
}

const schema = Validation.shape({});

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { onSearch, onSubmit, onClear } = props;
  const { t } = useTranslation();

  const form = useForm<IParamsSearchPurchaseHistory>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const handleSubmit = (values: IParamsSearchPurchaseHistory) => {
    const { from, to, ...rest } = values;

    onSearch({
      ...rest,
      from: DateTime.Format(from, 'YYYY-MM-DD'),
      to: DateTime.Format(to, 'YYYY-MM-DD'),
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
          <ProDateRange label={t('Ngày mua hàng')} from="from" to="to" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormAutocomplete
            name="billLogType"
            placeholder={t('Loại')}
            options={[
              { value: 0, label: 'Bán hàng' },
              { value: 1, label: 'Trả hàng' },
            ]}
            renderLabel={(option) => option.label}
            renderValue={(option) => option.value}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormTextField name="productName" placeholder={t('Sản phẩm')} />
        </Grid>
        <Grid item xs={6} sm={3} md={2} lg={1.2}>
          <ProFormFilterAction onSubmit={onSubmit} onClear={onClear} />
        </Grid>
      </Grid>
    </ProForm>
  );
});

export default FiltersForm;
