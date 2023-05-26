import { yupResolver } from '@hookform/resolvers/yup';
import Validation from 'utils/Validation';
import DateTime from 'utils/DateTime';
import { Button, Grid } from '@mui/material';
import ProForm from 'components/ProForm';
import { forwardRef, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiltersRef } from 'types/refs';
import { FilterParams } from './utils/filters';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import { useTranslation } from 'react-i18next';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormTextFiedTrim from 'components/ProForm/Label/ProFormTextFiedTrim';
import ProFormSelectSorted from 'components/ProForm/Label/ProFormSelectSorted';

interface FiltersValues {
  code: string | null;
  startCreated: string | null;
  endCreated: string | null;
  startTransaction: string | null;
  endTransaction: string | null;
  action: number | null;
  documentDetailType: number | null;
  documentCode: string | null;
  ticketType: number | null;
  audienceType: number | null;
  audience: string | null;
  userAction: string | null;
}
interface Props {
  onSearch: (params: Partial<FilterParams>) => void;
  checkReset: boolean;
}

const schema = Validation.shape({
  // transactionId: Validation.string().optional(),
  code: Validation.string().optional().trim(),
  // startDate: Validation.date().optional(),
  // endDate: Validation.date().optional(),
  // transStartDate: Validation.date().optional(),
  documentCode: Validation.string().optional().trim(),
  // actionType: Validation.select(0),
  // style: Validation.select(0),
  // document: Validation.string().optional(),
  // type: Validation.select(0),
  // objectType: Validation.select(0),
  // object: Validation.string().optional(),
  // operator: Validation.string().optional(),
});

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { t } = useTranslation();
  const { onSearch, checkReset } = props;
  const form = useForm<FiltersValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });
  const handleSubmit = (values: FiltersValues) => {
    const { startCreated, endCreated, startTransaction, endTransaction, ...rest } =
      values;

    onSearch({
      ...rest,
      startCreated: DateTime.Format(values.startCreated, 'YYYY-MM-DD'),
      endCreated: DateTime.Format(values.endCreated, 'YYYY-MM-DD'),
      startTransaction: DateTime.Format(values.startTransaction, 'YYYY-MM-DD'),
      endTransaction: DateTime.Format(values.endTransaction, 'YYYY-MM-DD'),
      action: values.action === 3 ? null : values.action
    });
  };

  useEffect(() => {
    form.reset({
      code: '',
      startCreated: null,
      endCreated: null,
      startTransaction: null,
      endTransaction: null,
      action: null,
      documentDetailType: null,
      documentCode: '',
      ticketType: null,
      audienceType: null,
      audience: '',
      userAction: '',
    });
  }, [checkReset]);

  const options = [
    { value: 26, label: 'Bán hàng' },
    { value: 25, label: 'Trả hàng' },
    { value: 0, label: 'Nhập - Khách hàng' },
    { value: 1, label: 'Nhập - Nhà cung cấp' },
    { value: 27, label: 'Nhập - Nhà cung cấp VAT' },
    { value: 2, label: 'Nhập - Chuyển kho' },
    { value: 3, label: 'Nhập - Bù trừ kiểm kho ' },
    { value: 4, label: "Nhập - Sản xuất" },
    { value: 5, label: "Nhập - Chuyển mã" },
    { value: 6, label: "Nhập - Khác" },
    { value: 7, label: "Xuất - Khách hàng" },
    { value: 8, label: "Xuất - Nhà cung cấp" },
    { value: 28, label: "Xuất - Nhà cung cấp VAT" },
    { value: 9, label: "Xuất - Chuyển kho" },
    { value: 10, label: "Xuất - Bù trừ kiểm kho" },
    { value: 11, label: "Xuất - Sản xuất" },
    { value: 12, label: "Xuất - Chuyển mã" },
    { value: 13, label: "Xuất - Bảo hành" },
    { value: 14, label: "Xuất - Hủy" },
    { value: 15, label: "Xuất - Quà tặng" },
    { value: 16, label: "Xuất - Khác" },
    { value: 17, label: "Xuất VAT" },
    { value: 18, label: "Nhập VAT" },
    { value: 19, label: "Phiếu đặt hàng" },
    { value: 20, label: "Đơn vận chuyển" },
    { value: 23, label: "Phiếu thu" },
    { value: 24, label: "Phiếu chi" },
    { value: 21, label: "Báo nợ" },
    { value: 22, label: "Báo có" },
  ];

  return (
    <ProForm
      form={form}
      onFinish={handleSubmit}
      PaperProps={{ sx: { padding: '16px 16px 0px 16px' } }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <ProFormTextFiedTrim
            name="code"
            placeholder={t('ID giao dịch')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <ProDateRange label={t('Chọn ngày')} from="startCreated" to="endCreated" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <ProDateRange
            label={t('Ngày giao dịch')}
            from="startTransaction"
            to="endTransaction"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <ProFormSelect
            name="action"
            label={t('Thao tác')}
            placeholder={t('Thao tác')}
            options={[
              { value: 1, label: 'Sửa' },
              { value: 2, label: 'Xóa' },
              { value: 3, label: 'Tất cả' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <ProFormSelectSorted
            name="documentDetailType"
            label={t('Kiểu')}
            placeholder={t('Kiểu')}
            options={options}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <ProFormTextFiedTrim
            name="documentCode"
            placeholder={t('Chứng từ')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <ProFormSelectSorted
            name="ticketType"
            label={t('Loại phiếu')}
            placeholder={t('Loại phiếu')}
            options={[
              { value: 0, label: 'Phiếu nhập' },
              { value: 1, label: 'Phiếu xuất' },
              { value: 2, label: 'Báo nợ' },
              { value: 3, label: 'Báo có' },
              { value: 4, label: 'Phiếu thu' },
              { value: 5, label: 'Phiếu chi' },
              { value: 6, label: 'Kết chuyển' },
              { value: 7, label: 'Khác' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <ProFormSelect
            name="audienceType"
            label={t('Loại đối tượng')}
            placeholder={t('Loại đối tượng')}
            options={[
              { value: 0, label: 'Khách hàng' },
              { value: 1, label: 'Nhà cung cấp VN' },
              { value: 2, label: 'Nhà cung cấp TQ ' },
              { value: 3, label: 'Nhân viên' },
              { value: 4, label: 'Khác' },
            ]}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={2}>
          <ProFormTextField
            name="audience"
            placeholder={t('Đối tượng')}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={2}>
          <ProFormTextField
            name="userAction"
            placeholder={t('Người thao tác')}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={2}>
          <Button type="submit" sx={{ height: '100%' }}>
            Lọc
          </Button>
        </Grid>
      </Grid>
    </ProForm>
  );
});

export default FiltersForm;
