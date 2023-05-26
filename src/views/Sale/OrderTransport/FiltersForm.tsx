import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProForm from 'components/ProForm';
import ProFormAutocomplete from 'components/ProForm/Label/ProFormAutocomplete';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormHiddenInput from 'components/ProForm/ProFormHiddenInput';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import DateTime from 'utils/DateTime';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { FiltersRef } from 'types/refs';
import DateFns from 'utils/DateFns';
import Validation from 'utils/Validation';
import type { FilterParams } from './utils/filters';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import { getListStore, getStoreList } from 'slices/saleOrderTransport';
import ProFormAutoCompleteDoubleFind from 'components/ProForm/ProFormAutoCompleteDoubleFind';

interface FilterValues {
  searchDateFrom: string | null;
  searchDateTo: string | null;
  code: string | null;
  customerName: string | null;
  transportName: string | null;
  phoneNumber: string | null;
  shipper: string | null;
  fromStoreId: string | null;
  status: number | null;
}

const schema = Validation.shape({
  // name: Validation.string().optional(),
  // startDate: Validation.date().optional(),
  // endDate: Validation.date().optional(),
  // product: Validation.string().optional(),
  // customer: Validation.string().optional(),
  // idBill: Validation.string().optional(),
});

interface Props {
  onSearch: (params: Partial<FilterParams>) => void;
}

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { onSearch } = props;
  const { t } = useTranslation();
  const storeList = useSelector(getStoreList);
  const form = useForm<FilterValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const handleSubmit = (values: FilterValues) => {
    const { searchDateFrom, searchDateTo, ...rest } = values;

    onSearch({
      ...values,
      searchDateFrom: DateTime.Format(searchDateFrom, 'YYYY-MM-DD'),
      searchDateTo: DateTime.Format(searchDateTo, 'YYYY-MM-DD'),
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
          <ProDateRange label={t('Ngày tạo')} from="searchDateFrom" to="searchDateTo" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormTextField
            name="transportInformationCode"
            placeholder={t('ID')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormTextField
            name="customerName"
            placeholder={t('Tên khách hàng')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormTextField
            name="transportName"
            placeholder={t('Tên nhà vận chuyển')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormTextField
            name="phoneNumber"
            placeholder={t('Số điện thoại')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormTextField
            name="shipper"
            placeholder={t('Nhân viên giao hàng')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormAutocomplete
            name="status"
            placeholder={t('Trạng thái')}
            options={[
              { value: 0, label: 'Chờ giao hàng' },
              { value: 1, label: 'Đang giao' },
              { value: 6, label: 'Thành công' },
              { value: 9, label: 'Đã hủy' },
              // { value: 2, label: 'Tạo đơn' },
              // { value: 3, label: 'Lấy hàng' },
              // { value: 4, label: 'Ngày lấy hàng' },
              // { value: 5, label: 'Đã lấy hàng' },
              // { value: 6, label: 'Hoàn thành' },
              // { value: 7, label: 'Đối soát' },
              // { value: 8, label: 'Trả hàng' },
            ]}
            renderLabel={(option) => option.label}
            renderValue={(option) => option.value}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormAutocomplete
            name="fromStoreId"
            placeholder={t('Cửa hàng')}
            options={storeList}
            renderLabel={(option) => option?.name}
            renderValue={(option) => option?.id}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={1.5}>
          <Button variant="contained" size="medium" type="submit">
            Lọc
          </Button>
        </Grid>
      </Grid>
      <ProFormHiddenInput />
    </ProForm>
  );
});

export default FiltersForm;
