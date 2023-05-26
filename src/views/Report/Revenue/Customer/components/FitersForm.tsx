import { yupResolver } from '@hookform/resolvers/yup';
import { Collapse, Grid, Typography } from '@mui/material';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProForm from 'components/ProForm';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormFilterAction from 'components/ProForm/ProFormFilterAction';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FiltersRef } from 'types/refs';
import DateTime from 'utils/DateTime';
import Validation from 'utils/Validation';
import { FilterParams } from '../utils/filter';

interface FilterValues {
  startDate: string | null;
  endDate: string | null;
  store: string | number | null;
  customers: string;
  typeCustomer: string | number | null;
  province: string | number | null;
  district: string | number | null;
  price: number;
  seller: string;
  level: string | number | null;
  customerGroup: string | number | null;
  filterRevenue: string | number | null;
  options: string | number | null;
}

const schema = Validation.shape({
  startDate: Validation.string().optional().default(null),
  endDate: Validation.string().optional().default(null),
  store: Validation.select(0),
  customers: Validation.string().optional(),
  typeCustomer: Validation.select(0),
  province: Validation.select(0),
  district: Validation.select(0),
  price: Validation.number().optional(),
  seller: Validation.string().optional(),
  level: Validation.select(0),
  customerGroup: Validation.select(0),
  filterRevenue: Validation.select(0),
  options: Validation.select(0),
});

interface Props {
  onSearch: (params: Partial<FilterParams>) => void;
  onSubmit: VoidFunction;
  onClear: VoidFunction;
}

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { t } = useTranslation();
  const [openMoreFilter, setOpenMoreFilter] = useState<boolean>(false);

  const { onSearch, onSubmit, onClear } = props;

  const form = useForm<FilterValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

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

  const onExpended = () => {
    setOpenMoreFilter(!openMoreFilter);
  };

  return (
    <ProForm form={form} onFinish={handleSubmit} PaperProps={{ sx: { p: 2 } }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProDateRange
            label={t('Khoảng ngày')}
            from="startDate"
            to="endDate"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormSelect
            name="store"
            placeholder={t('Chọn cửa hàng')}
            options={[
              { value: 1, label: 'Linh kiện SG' },
              { value: 2, label: 'Linh kiện HN' },
            ]}
            renderLabel={(option) => option.label}
            renderValue={(option) => option.value}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2} lg={2.4}>
          <ProFormTextField
            name="customer"
            placeholder="Khách hàng"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={6} sm={3} md={2} lg={2.4}>
          <ProFormSelect
            name="typeCustomer"
            placeholder="Loại khách hàng"
            options={[
              { value: 1, label: 'Khách sỉ' },
              { value: 2, label: 'Khách lẻ' },
              { value: 3, label: 'Đại lý' },
            ]}
            renderLabel={(option) => option.label}
            renderValue={(option) => option.value}
          />
        </Grid>

        <Grid item xs={6} sm={3} md={2} lg={1.2}>
          <ProFormFilterAction
            onSubmit={onSubmit}
            onClear={onClear}
            onExpanded={onExpended}
          />
        </Grid>
      </Grid>
      <Collapse in={openMoreFilter} timeout="auto">
        <Grid container spacing={2} mt={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4} lg={0.85}>
            <Typography>Thành phố</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.15}>
            <ProFormSelect
              name="province"
              placeholder={t('Thành phố')}
              options={[
                { value: 1, label: 'Hà Nội' },
                { value: 2, label: 'Sài Gòn' },
              ]}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={0.75}>
            <Typography>Số tiền</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.25}>
            <ProFormTextField
              name="price"
              placeholder={t('Số tiền')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={0.85}>
            <Typography>Cấp độ</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2.15}>
            <ProFormSelect
              name="level"
              placeholder={t('Cấp độ')}
              options={[
                { value: 1, label: '--' },
                { value: 2, label: '--' },
              ]}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={0.85}>
            <Typography>Lọc doanh thu</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2.15}>
            <ProFormSelect
              name="filterRevenue"
              placeholder={t('Lọc doanh thu')}
              options={[
                { value: 1, label: '--' },
                { value: 2, label: '--' },
              ]}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={0.85}>
            <Typography>Quận huyện</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2.15}>
            <ProFormSelect
              name="district"
              placeholder={t('Quận huyện')}
              options={[
                { value: 1, label: 'Hà Nội' },
                { value: 2, label: 'Sài Gòn' },
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={0.85}>
            <Typography>Nhân viên bán hàng</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.15}>
            <ProFormTextField
              name="seller"
              placeholder={t('Nhân viên bán hàng')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={0.85}>
            <Typography>Nhóm khách hàng</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2.15}>
            <ProFormSelect
              name="customerGroup"
              placeholder={t('Nhóm khách hàng')}
              options={[
                { value: 1, label: '---' },
                { value: 2, label: '---' },
              ]}
            />
          </Grid>

					<Grid item xs={12} sm={6} md={4} lg={0.85}>
            <Typography>Tùy chọn</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2.15}>
            <ProFormSelect
              name="options"
              placeholder={t('Tùy chọn')}
              options={[
                { value: 1, label: '---' },
                { value: 2, label: '---' },
              ]}
            />
          </Grid>
        </Grid>
      </Collapse>
    </ProForm>
  );
});
export default FiltersForm;
