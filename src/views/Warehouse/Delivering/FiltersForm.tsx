import { yupResolver } from '@hookform/resolvers/yup';
import Grid from '@mui/material/Grid';
import ProForm from 'components/ProForm';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';
import ProFormFilterAction from 'components/ProForm/ProFormFilterAction';
import ProFormHiddenInput from 'components/ProForm/ProFormHiddenInput';
import { NumberInput } from 'plugins/NumberFormat';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { APIGetStore } from 'services/warehouseTransfer';
import type { FiltersRef } from 'types/refs';
import { ISearchWarehouseTransferMoving } from 'types/warehouseDelivering';
import Validation from 'utils/Validation';
import {
  IResponseStore,
  IStore,
} from 'views/Inventory/OrderSlip/AddOrderSlip/utils/types';

const schema = Validation.shape({
  // name: Validation.string().optional(),
  // status: Validation.select(STATUS.ALL),
  // toStoreIds: Validation.string().optional(),
  // fromStoreIds: Validation.string().optional(),
  // warehouseTransferCode: Validation.string().optional(),
  // billType: Validation.string().optional(),
  // fromData: Validation.string().optional(),
  // toDate: Validation.string().optional(),
});

interface Props {
  onSearch: (params: Partial<ISearchWarehouseTransferMoving>) => void;
  onSubmit: VoidFunction;
  onClear: VoidFunction;
}

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { onSearch, onSubmit, onClear } = props;
  const { t } = useTranslation();

  const [storeListOption, setStoreListOption] = useState<IStore[]>([]);

  const form = useForm<ISearchWarehouseTransferMoving>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const handleSubmit = (values: ISearchWarehouseTransferMoving) => {
    onSearch(values);
  };

  const handleReset = () => {
    form.reset(schema.getDefault());
  };

  useImperativeHandle(ref, () => ({
    reset: handleReset,
    submit: form.handleSubmit(handleSubmit),
  }));

  useEffect(() => {
    Promise.all([
      APIGetStore(),
      // APIGetProductWarehouse(),
    ])
      .then(([storeRes]) => {
        // setProductListOption(productRes);
        setStoreListOption(
          storeRes.map((item: IResponseStore) => ({
            value: item.id,
            label: item.name,
          }))
        );
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  }, []);

  return (
    <ProForm form={form} onFinish={handleSubmit} PaperProps={{ sx: { p: 2 } }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormCheckboxSelect
            name="fromStoreIds"
            label={t('Kho hàng')}
            placeholder={t('Từ kho')}
            options={storeListOption}
            renderLabel={(option) => option.label}
            renderValue={(option) => option.value}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2.4}>
          <ProFormCheckboxSelect
            name="toStoreIds"
            label={t('Kho hàng')}
            placeholder={t('Đến kho')}
            options={storeListOption}
            renderLabel={(option) => option.label}
            renderValue={(option) => option.value}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={1.2}>
          <ProFormTextField
            name="warehouseTransferCode"
            placeholder={t('Nhập ID')}
            InputProps={{
              inputComponent: NumberInput,
            }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={1.2}>
          <ProFormTextField
            name="warehouseBillCode"
            placeholder={t('ID phiếu XNK')}
            InputProps={{
              inputComponent: NumberInput,
            }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        {/* <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProDateRange label={t('Ngày tạo')} from="startDate" to="endDate" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={1.2}>
          <ProFormSelect
            name="inventory"
            placeholder={t('loại')}
            options={[
              { value: nanoid(), label: 'Nhập' },
              { value: nanoid(), label: 'Xuất' },
            ]}
          />
        </Grid> */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormFilterAction onSubmit={onSubmit} onClear={onClear} />
        </Grid>
      </Grid>
      <ProFormHiddenInput />
    </ProForm>
  );
});

export default FiltersForm;
