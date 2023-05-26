import { yupResolver } from '@hookform/resolvers/yup';
import { Checkbox } from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/system';
import { nanoid } from '@reduxjs/toolkit';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProForm from 'components/ProForm';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';
import ProFormFilterAction from 'components/ProForm/ProFormFilterAction';
import ProFormHiddenInput from 'components/ProForm/ProFormHiddenInput';
import ProNumberRange from 'components/ProNumberInput/ProNumberRange';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { FiltersRef } from 'types/refs';
import Validation from 'utils/Validation';
import { STATUS } from './utils/constants';
import type { FilterParams } from './utils/filters';

const priceOptions = [
  { value: 1, label: '' },
  { value: 2, label: 'Giá nhập' },
  { value: 3, label: 'Giá bán' },
  { value: 4, label: 'Giá cũ' },
];

const brandOptions = [
  { value: 1, label: '- Thương hiệu -' },
  { value: 2, label: 'Chưa gắn thương hiệu' },
];

const linkOptions = [
  { value: 1, label: '' },
  { value: 2, label: 'Sản phẩm cha' },
  { value: 3, label: 'Sản phẩm độc lập' },
  { value: 4, label: 'Sản phẩm con' },
  { value: 5, label: 'Sản phẩm cha + độc lập' },
  { value: 6, label: 'Sản phẩm con + độc lập' },
];

const typeOptions = [
  { value: 1, label: '' },
  { value: 11, label: 'Sản phẩm' },
  { value: 2, label: 'Voucher' },
  { value: 3, label: 'Sản phẩm cân đo' },
  { value: 4, label: 'Sản phẩm theo IMEI' },
  { value: 5, label: 'Gói sản phẩm' },
  { value: 6, label: 'Dịch vụ' },
  { value: 7, label: 'Dụng cụ' },
  { value: 8, label: 'Sản phẩm bán theo Lô' },
  { value: 9, label: 'Combo' },
  { value: 10, label: 'Sản phẩm nhiều đơn vị tính' },
];

const existenceStatus = [
  { value: 1, label: '' },
  { value: 10, label: 'Đang giao hàng' },
  { value: 2, label: 'Đang chuyển kho' },
  { value: 3, label: 'Tạm giữ' },
  { value: 4, label: 'Lỗi' },
  { value: 5, label: 'Có thể bán <= 0' },
  { value: 6, label: 'Có thể bán > 0' },
];

const saleStatus = [
  { value: 1, label: '' },
  { value: 10, label: 'Tất cả trạng thái' },
  { value: 2, label: 'Chưa có trạng thái' },
  { value: 3, label: 'Mới' },
  { value: 4, label: 'Đang bán' },
  { value: 5, label: 'Ngừng bán' },
  { value: 6, label: 'Hết hàng' },
];

interface FilterValues {
  searchText: string;
  status: number;
}

const schema = Validation.shape({
  name: Validation.string().optional(),
  status: Validation.select(STATUS.ALL),
  inventory: Validation.select(1),
});

interface Props {
  onSearch: (params: Partial<FilterParams>) => void;
  onSubmit: VoidFunction;
  onClear: VoidFunction;
}

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { onSearch, onSubmit, onClear } = props;
  const { t } = useTranslation();
  const [openMoreFilter, setOpenMoreFilter] = useState<boolean>(false);

  const form = useForm<FilterValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const handleSubmit = (values: FilterValues) => {
    onSearch(values);
  };

  const handleReset = () => {
    form.reset(schema.getDefault());
  };

  useImperativeHandle(ref, () => ({
    reset: handleReset,
    submit: form.handleSubmit(handleSubmit),
  }));

  const onExpanded = () => setOpenMoreFilter(!openMoreFilter);

  return (
    <ProForm form={form} onFinish={handleSubmit} PaperProps={{ sx: { p: 2 } }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormCheckboxSelect
            name="store"
            label={t('Cửa hàng')}
            placeholder={t('Chọn cửa hàng')}
            options={[
              { value: nanoid(), label: 'TM' },
              { value: nanoid(), label: 'HN-1' },
              { value: nanoid(), label: 'HN-2' },
              { value: nanoid(), label: 'Sài Gòn' },
              { value: nanoid(), label: 'Hàng trên đường' },
              { value: nanoid(), label: 'Thái nguyên' },
              { value: nanoid(), label: 'Vinh' },
              { value: nanoid(), label: 'Màn hình' },
              { value: nanoid(), label: 'VTech Thanh Hóa' },
              { value: nanoid(), label: 'Linh Kiện HN' },
              { value: nanoid(), label: 'Xe TH' },
              { value: nanoid(), label: 'Anh Vương' },
            ]}
            renderLabel={(option) => option.label}
            renderValue={(option) => option.value}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2} lg={1.2}>
          <ProFormTextField
            name="name"
            placeholder={t('ID')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormTextField
            name="name"
            placeholder={t('Tên, mã sản phẩm')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormCheckboxSelect
            name="status"
            label={t('Danh mục')}
            placeholder={t('Chọn danh mục')}
            options={[
              { value: nanoid(), label: 'Chưa gắn danh mục' },
              { value: nanoid(), label: 'Vỏ' },
              { value: nanoid(), label: 'Vỏ Độ' },
              { value: nanoid(), label: 'Pin ZIN' },
              { value: nanoid(), label: 'Lõi Pin' },
              { value: nanoid(), label: 'Pin EU' },
              { value: nanoid(), label: 'Màn hình' },
            ]}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2} lg={1.2}>
          <ProFormSelect
            name="inventory"
            placeholder={t('- Tồn -')}
            options={[
              { value: 1, label: '- Tồn -' },
              { value: nanoid(), label: 'Còn tồn' },
              { value: nanoid(), label: 'Còn có thể bán' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormFilterAction
            onSubmit={onSubmit}
            onClear={onClear}
            onExpanded={onExpanded}
            openMoreFilter={openMoreFilter}
          />
        </Grid>
      </Grid>
      {openMoreFilter && (
        <Grid
          container
          spacing={1}
          columnSpacing={3}
          mt={2}
          alignItems="center"
        >
          <StyledLabel item xs={12} sm={6} md={4} lg={1}>
            ID cha
          </StyledLabel>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <ProFormTextField name="brand" />
          </Grid>
          <StyledLabel item xs={12} sm={6} md={4} lg={1}>
            IMEI
          </StyledLabel>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <ProFormTextField name="brand" />
          </Grid>
          <StyledLabel item xs={12} sm={6} md={4} lg={1}>
            Giá
          </StyledLabel>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <ProFormSelect
              name="inventory"
              placeholder=""
              options={priceOptions}
              renderLabel={(option) => option.label}
              renderValue={(option) => option.value}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Checkbox /> Tồn theo SP cha
          </Grid>

          <StyledLabel item xs={12} sm={6} md={4} lg={1}>
            ID từ API
          </StyledLabel>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <ProFormTextField name="brand" />
          </Grid>
          <StyledLabel item xs={12} sm={6} md={4} lg={1}>
            Thương hiệu
          </StyledLabel>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <ProFormSelect
              name="inventory"
              placeholder=""
              options={brandOptions}
              renderLabel={(option) => option.label}
              renderValue={(option) => option.value}
            />
          </Grid>
          <StyledLabel item xs={12} sm={6} md={4} lg={1}>
            Giá
          </StyledLabel>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <ProNumberRange
              label={t('Từ - Đến')}
              from="startDate"
              to="endDate"
            />
          </Grid>
          <StyledLabel item xs={12} sm={6} md={4} lg={1}>
            Tồn
          </StyledLabel>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <ProNumberRange
              label={t('Từ - Đến')}
              from="startDate"
              to="endDate"
            />
          </Grid>
          <StyledLabel item xs={12} sm={6} md={4} lg={1}>
            Cha con
          </StyledLabel>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <ProFormSelect
              name="inventory"
              placeholder=""
              options={linkOptions}
              renderLabel={(option) => option.label}
              renderValue={(option) => option.value}
            />
          </Grid>
          <StyledLabel item xs={12} sm={6} md={4} lg={1}>
            Loại
          </StyledLabel>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <ProFormSelect
              name="inventory"
              placeholder=""
              options={typeOptions}
              renderLabel={(option) => option.label}
              renderValue={(option) => option.value}
            />
          </Grid>
          <StyledLabel item xs={12} sm={6} md={4} lg={1}>
            Đặc điểm
          </StyledLabel>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <ProFormCheckboxSelect
              name="store"
              label={t('Đặc điểm')}
              placeholder={t('Đặc điểm')}
              options={[
                { value: nanoid(), label: 'TM' },
                { value: nanoid(), label: 'HN-1' },
                { value: nanoid(), label: 'HN-2' },
                { value: nanoid(), label: 'Sài Gòn' },
                { value: nanoid(), label: 'Hàng trên đường' },
                { value: nanoid(), label: 'Thái nguyên' },
                { value: nanoid(), label: 'Vinh' },
                { value: nanoid(), label: 'Màn hình' },
                { value: nanoid(), label: 'VTech Thanh Hóa' },
                { value: nanoid(), label: 'Linh Kiện HN' },
                { value: nanoid(), label: 'Xe TH' },
                { value: nanoid(), label: 'Anh Vương' },
              ]}
              renderLabel={(option) => option.label}
              renderValue={(option) => option.value}
            />
          </Grid>
          <StyledLabel item xs={12} sm={6} md={4} lg={1}>
            Trạng thái tồn
          </StyledLabel>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <ProFormSelect
              name="inventory"
              placeholder=""
              options={existenceStatus}
              renderLabel={(option) => option.label}
              renderValue={(option) => option.value}
            />
          </Grid>
          <StyledLabel item xs={12} sm={6} md={4} lg={1}>
            Danh mục nội bộ
          </StyledLabel>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <ProFormCheckboxSelect
              name="status"
              label={t('Danh mục nội bộ')}
              placeholder={t('Danh mục nội bộ')}
              options={[
                { value: nanoid(), label: 'Chưa gắn danh mục' },
                { value: nanoid(), label: 'Vỏ' },
                { value: nanoid(), label: 'Vỏ Độ' },
                { value: nanoid(), label: 'Pin ZIN' },
                { value: nanoid(), label: 'Lõi Pin' },
                { value: nanoid(), label: 'Pin EU' },
                { value: nanoid(), label: 'Màn hình' },
              ]}
            />
          </Grid>
          <StyledLabel item xs={12} sm={6} md={4} lg={1}>
            Nhà cung cấp
          </StyledLabel>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <ProFormTextField name="brand" />
          </Grid>
          <StyledLabel item xs={12} sm={6} md={4} lg={1}>
            Tags
          </StyledLabel>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <ProFormTextField name="brand" />
          </Grid>
          <StyledLabel item xs={12} sm={6} md={4} lg={1}>
            Trạng thái bán
          </StyledLabel>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <ProFormSelect
              name="inventory"
              placeholder=""
              options={saleStatus}
              renderLabel={(option) => option.label}
              renderValue={(option) => option.value}
            />
          </Grid>
          <StyledLabel item xs={12} sm={6} md={4} lg={1}>
            Ngày tạo
          </StyledLabel>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <ProDateRange label={t('Từ - Đến')} from="startDate" to="endDate" />
          </Grid>
        </Grid>
      )}

      <ProFormHiddenInput />
    </ProForm>
  );
});

const StyledLabel = styled(Grid)`
  text-align: right;
`;

export default FiltersForm;
