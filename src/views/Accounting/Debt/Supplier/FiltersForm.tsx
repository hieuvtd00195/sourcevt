import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProForm from 'components/ProForm';
import ProFormAutocomplete from 'components/ProForm/Label/ProFormAutocomplete';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormFilterAction from 'components/ProForm/ProFormFilterAction';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import useNotification from 'hooks/useNotification';
import { PriceChinaInput } from 'plugins/NumberFormat';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { APIGetListSuppliersSearchApi } from 'services/debtSupplier';
import { setNDT } from 'slices/debtSupplier';
import { ISupplier, SearchDebtSupplierParams } from 'types/debtSupplier';
import { FiltersRef } from 'types/refs';
import Validation from 'utils/Validation';

import useFilters from './utils/filters';

interface Props {
  onSearch: (params: Partial<SearchDebtSupplierParams>) => void;
  onSubmit: VoidFunction;
  onClear: VoidFunction;
}

const schema = Validation.shape({
  searchDateFrom: Validation.date().optional().default(null),
  searchDateTo: Validation.date().optional().default(null),
  phoneNumber: Validation.string().optional().default(null),
  supplierId: Validation.selectId('0').optional().nullable().default(null),
  type: Validation.select(0).optional().nullable(),
  debtType: Validation.select(0).optional().nullable(),
  ndt: Validation.number().optional().nullable().default(null),
});

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { onSubmit, onClear, onSearch } = props;

  const { t } = useTranslation();
  const { filters } = useFilters();
  const dispatch = useDispatch();
  const setNotification = useNotification();

  const [supplierList, setSupplierList] = useState<ISupplier[]>([]);

  const form = useForm<SearchDebtSupplierParams>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: filters,
  });

  const handleSubmit = (values: SearchDebtSupplierParams) => {
    onSearch(values);
  };

  const handleReset = () => {
    form.reset(schema.getDefault());
  };

  useImperativeHandle(ref, () => ({
    reset: handleReset,
    submit: form.handleSubmit(handleSubmit),
  }));

  const type = useWatch({
    control: form.control,
    name: 'type',
  });

  useEffect(() => {
    APIGetListSuppliersSearchApi(type)
      .then((res) => setSupplierList(res.data))
      .catch(() => {
        setNotification({
          error: 'Lỗi khi tải nhà cung cấp!',
        });
      });
  }, [setNotification, type]);

  return (
    <ProForm
      form={form}
      onFinish={handleSubmit}
      PaperProps={{ sx: { padding: '16px 16px 0 16px' } }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProDateRange
            label={t('Chọn ngày')}
            from="searchDateFrom"
            to="searchDateTo"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.5}>
          <ProFormSelect
            name="type"
            placeholder={t('Phân loại NCC')}
            options={[
              { value: 0, label: 'Nhà CC TQ' },
              { value: 1, label: 'Nhà CC VN' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1}>
          <ProFormTextField
            name="ndt"
            placeholder="NDT"
            InputProps={{
              inputComponent: PriceChinaInput,
            }}
            onChange={(e) => {
              if (e.target.value === '') {
                form.setValue('ndt', null);
              } else {
                form.setValue('ndt', Number(e.target.value));
              }

              dispatch(setNDT(Number(e.target.value)));
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.5}>
          <ProFormAutocomplete
            name="supplierId"
            options={supplierList}
            renderValue={(item) => item.id}
            renderLabel={(item) => item.name || ''}
            placeholder={t('Nhà cung cấp')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.5}>
          <ProFormAutocomplete
            name="phoneNumber"
            options={supplierList}
            renderValue={(item) => item.phoneNumber || ''}
            renderLabel={(item) => item.phoneNumber || ''}
            placeholder={t('Số điện thoại')}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={1.5}>
          <ProFormSelect
            name="debtType"
            placeholder={t('Công nợ')}
            options={[
              { value: 1, label: 'Phải thu' },
              { value: 2, label: 'Phải trả' },
              { value: 3, label: 'Phải thu | Phải trả' },
            ]}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={2}>
          <ProFormFilterAction onSubmit={onSubmit} onClear={onClear} />
        </Grid>
      </Grid>
    </ProForm>
  );
});

export default FiltersForm;
