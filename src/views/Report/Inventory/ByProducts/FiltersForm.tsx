import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiltersRef } from 'types/refs';
import Validation from 'utils/Validation';
import { FilterParams } from './utils/filters';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DateTime from 'utils/DateTime';
import ProForm from 'components/ProForm';
import { Collapse, Grid, Typography } from '@mui/material';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';
import ProFormFilterAction from 'components/ProForm/ProFormFilterAction';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';

interface Props {
  onSearch: (params: Partial<FilterParams>) => void;
  onSubmit: VoidFunction;
  onClear: VoidFunction;
}

interface FilterValues {
  timeUnit: number;
  startDate: string | null;
  endDate: string | null;
  immigrationType: number | null;
  store: number | null;
  brand: number | null;
  cost: number | null;
  currentInventory: number | null;
  category: number | null;
  categoryType: number | null;
  supplier: string | null;
  supplierType: number | null;
  familyProducts: number | null;
  immigrationArise: number | null;
  product: string | null;
}

const schema = Validation.shape({
  startDate: Validation.string().optional().default(null),
  endDate: Validation.string().optional().default(null),
  timeUnit: Validation.select(1).optional(),
  immigrationType: Validation.select(0).optional(),
  store: Validation.select(0).optional(),
  brand: Validation.select(0).optional(),
  cost: Validation.select(1).optional(),
  currentInventory: Validation.select(1).optional(),
  category: Validation.select(0).optional(),
  categoryType: Validation.select(0).optional(),
  supplier: Validation.string().optional().default(null),
  supplierType: Validation.select(0).optional(),
  familyProducts: Validation.select(0).optional(),
  immigrationArise: Validation.select(0).optional(),
  product: Validation.string().optional().default(null),
});

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { onSearch, onSubmit, onClear } = props;
  const { t } = useTranslation();

  const form = useForm<FilterValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const [isShowFilter, setIsShowFilter] = useState<boolean>(false);

  const handleShowFilter = () => {
    setIsShowFilter(!isShowFilter);
  };

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
        <Grid item xs={12} sm={6} md={3} lg={1.5}>
          <ProFormSelect
            name="timeUnit"
            placeholder={t('Theo ngày')}
            options={[
              { value: 1, label: 'Theo ngày' },
              { value: 2, label: 'Theo tháng' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.2}>
          <ProDateRange
            label={t('Khoảng ngày')}
            from="startDate"
            to="endDate"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2.2}>
          <ProFormCheckboxSelect
            name="immigrationType"
            placeholder={t('Kiểu XNK')}
            options={[
              { value: 1, label: '[N] Nhà cung cấp' },
              { value: 2, label: '[C] Chuyển kho' },
              { value: 3, label: '[G] Giao hàng' },
              { value: 4, label: '[L] Bán lẻ' },
              { value: 5, label: '[B] Bán sỉ' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2.2}>
          <ProFormCheckboxSelect
            name="store"
            placeholder={t('- Cửa hàng -')}
            options={[
              { value: 1, label: 'Hà Nội' },
              { value: 2, label: 'Sài Gòn' },
              { value: 3, label: 'Đà Nẵng' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2.2}>
          <ProFormCheckboxSelect
            name="brand"
            placeholder={t('- Thương hiệu -')}
            options={[
              { value: 1, label: 'Cọc 10 (Túi)' },
              { value: 2, label: 'Cọc 25' },
              { value: 3, label: 'Cọc 5' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={1}>
          <ProFormFilterAction
            onSubmit={onSubmit}
            onClear={onClear}
            onExpanded={handleShowFilter}
          />
        </Grid>
      </Grid>

      <Collapse in={isShowFilter} timeout="auto">
        <Grid container spacing={2} mt={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4} lg={0.75}>
            <Typography>Danh mục</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.25}>
            <ProFormCheckboxSelect
              name="category"
              placeholder={t('Danh mục')}
              options={[
                { value: 1, label: 'Chưa gắn danh mục' },
                { value: 2, label: 'DM cha' },
                { value: 3, label: 'Vỏ thu mua' },
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={0.75}>
            <Typography>Loại</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.25}>
            <ProFormSelect
              name="categoryType"
              placeholder={t('--')}
              options={[
                { value: 1, label: 'Sản phẩm' },
                { value: 2, label: 'Voucher' },
                { value: 3, label: 'Sản phẩm cân đo' },
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={0.75}>
            <Typography>Giá vốn</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.25}>
            <ProFormSelect
              name="cost"
              placeholder={t('--')}
              options={[
                { value: 1, label: 'Tính theo giá vốn cuối kỳ' },
                { value: 2, label: 'Tính theo giá vốn trung bình trong kì' },
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={0.75}>
            <Typography>Tồn hiện tại</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.25}>
            <ProFormSelect
              name="currentInventory"
              placeholder={t('--')}
              options={[
                { value: 1, label: 'Tất cả sản phẩm' },
                { value: 2, label: 'Còn tồn hiện tại' },
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={0.75}>
            <Typography>Nhà cung cấp</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.25}>
            <ProFormTextField name="supplier" placeholder={t('Nhà cung cấp')} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={0.75}>
            <Typography>Loại</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.25}>
            <ProFormSelect
              name="supplierType"
              placeholder={t('--')}
              options={[
                { value: 1, label: 'Mới' },
                { value: 2, label: 'Đang bán' },
                { value: 3, label: 'Ngưng bán' },
                { value: 4, label: 'Hết hàng' },
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={0.75}>
            <Typography>SP cha con</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.25}>
            <ProFormSelect
              name="familyProducts"
              placeholder={t('--')}
              options={[
                { value: 1, label: 'Tính theo từng SP con' },
                { value: 2, label: 'Cộng tổng SP con theo SP cha' },
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={0.75}>
            <Typography>Phát sinh XNK</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.25}>
            <ProFormSelect
              name="immigrationArise"
              placeholder={t('--')}
              options={[{ value: 1, label: 'Có phát sinh XNK' }]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={0.75}>
            <Typography>Sản phẩm</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.25}>
            <ProFormTextField name="product" placeholder={t('Sản phẩm')} />
          </Grid>
        </Grid>
      </Collapse>
    </ProForm>
  );
});

export default FiltersForm;
