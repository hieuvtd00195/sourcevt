import { yupResolver } from '@hookform/resolvers/yup';
import Grid from '@mui/material/Grid';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProForm from 'components/ProForm';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';
import ProFormFilterAction from 'components/ProForm/ProFormFilterAction';
import ProFormHiddenInput from 'components/ProForm/ProFormHiddenInput';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { APIGetStore, APIGetSupplier } from 'services/saleOrder';
import type { FiltersRef } from 'types/refs';
import DateTime from 'utils/DateTime';
import Regexs from 'utils/Regexs';
import Validation from 'utils/Validation';
// import { IStore, ISupplier } from './utils/types';


interface FilterValues {
  // toStoreIds: string[] | null;
  // fromStoreIds: string[] | null;
  // warehouseTransferCode: string | null;
  // transferBillType: string | null;
  // fromDate: string | null;
  // toDate: string | null;
  [key: string]: any;
}

const schema = Validation.shape({
  // fromStoreIds: Validation.string().optional(),
  // toStoreIds: Validation.string().optional(),
  warehouseTransferCode: Validation.pattern(Regexs.decimal, "Vui lòng nhập ký tự số").optional().trim()
  // billType: Validation.string().optional(),
  // fromData: Validation.string().optional(),
  // toDate: Validation.string().optional(),
});

interface IFilter {
  [key: string]: any
}

interface Props {
  onSearch: (params: Partial<FilterValues>) => void;
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
    const newParam = {
      ...values,
      transferBillType: form.watch('transferBillType') === 2
        ? null
        : form.watch('transferBillType') === 0
          ? 0
          : form.watch('transferBillType') ? 1 : null,
    }

    onSearch({
      ...newParam,
      fromDate: DateTime.Format(values.fromDate, 'YYYY-MM-DD'),
      toDate: DateTime.Format(values.toDate, 'YYYY-MM-DD'),
    });
  };

  const handleReset = () => {
    form.reset(schema.getDefault());
  };

  useImperativeHandle(ref, () => ({
    reset: handleReset,
    submit: form.handleSubmit(handleSubmit),
  }));

  const [storeListOption, setStoreListOption] = useState<IFilter[]>([])
  const [supplierListOption, setSupplierListOption] = useState<IFilter[]>([])

  useEffect(() => {
    Promise.all([
      APIGetSupplier(),
      APIGetStore()
    ])
      .then(([supplierRes, storeRes]) => {
        setSupplierListOption(supplierRes.map((item: any) => ({ value: item.id, label: item.name })));
        setStoreListOption(storeRes.map((item: any) => ({ value: item.id, label: item.name })));
      })
      .catch(error => console.error(error))
      .finally(() => {
      });
  }, []);

  return (
    <ProForm form={form} onFinish={handleSubmit} PaperProps={{ sx: { p: 2 } }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormCheckboxSelect
            name="fromStoreIds"
            label={t('Kho hàng')}
            placeholder={t('Từ cửa hàng')}
            options={storeListOption}
            renderLabel={(option) => option.label}
            renderValue={(option) => option.value}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2.4}>
          <ProFormCheckboxSelect
            name="toStoreIds"
            label={t('Kho hàng')}
            placeholder={t('Đến cửa hàng')}
            options={storeListOption}
            renderLabel={(option) => option.label}
            renderValue={(option) => option.value}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={1.2}>
          <ProFormTextField
            name="warehouseTransferCode"
            placeholder={t('Nhập ID')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProDateRange label={t('Ngày tạo')} from="fromDate" to="toDate" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={1.2}>
          <ProFormSelect
            name="transferBillType"
            placeholder={t('Chọn loại phiếu')}
            options={[
              { value: 1, label: 'Xuất kho' },
              { value: 0, label: 'Nhập kho' },
              { value: 2, label: 'Tất cả' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormFilterAction onSubmit={onSubmit} onClear={onClear} />
        </Grid>
      </Grid>
      <ProFormHiddenInput />
    </ProForm>
  );
});

export default FiltersForm;
