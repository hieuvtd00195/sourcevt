import { yupResolver } from '@hookform/resolvers/yup';
import { Button, ButtonGroup, Collapse } from '@mui/material';
import Grid from '@mui/material/Grid';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProForm from 'components/ProForm';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormHiddenInput from 'components/ProForm/ProFormHiddenInput';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Validation from 'utils/Validation';
import type { FilterParams } from './utils/filters';
import { FiltersRef } from 'types/refs';
import DateTime from 'utils/DateTime';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';

interface FilterValues {
  id: string;
  startDate: Date | null;
  endDate: Date | null;
  product: string;
  customer: string;
  supplier: string;
  salesAgent: string;
}

const schema = Validation.shape({
  id: Validation.string().optional(),
  startDate: Validation.date(),
  endDate: Validation.date(),
  product: Validation.string().optional(),
  customer: Validation.string().optional(),
  supplier: Validation.string().optional(),
  salesAgent: Validation.string().optional(),
});

interface Props {
  onSearch: (params: Partial<FilterParams>) => void;
}

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { onSearch } = props;
  const { t } = useTranslation();
  const [openExpand, setOpenExpand] = useState<boolean>(false);

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

  const handleExpand = () => {
    setOpenExpand((prev) => !prev);
  };

  return (
    <ProForm
      form={form}
      onFinish={handleSubmit}
      PaperProps={{ sx: { padding: '16px 16px 0 16px' } }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <ProDateRange from="startDate" to="endDate" label="Chọn ngày" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <ProFormCheckboxSelect
            name="store"
            placeholder={t('Cửa hàng')}
            options={[
              { value: 1, label: 'Chưa gắn kho' },
              { value: 2, label: 'Linh kiện Sài Gòn' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <ProFormTextField name="product" placeholder={t('Sản phẩm')} />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <ProFormTextField name="customer" placeholder={t('Khách hàng')} />
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={1.5}>
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button type="submit">Lọc</Button>
            <Button
              variant="contained"
              endIcon={openExpand ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              onClick={handleExpand}
              size="medium"
            />
          </ButtonGroup>
        </Grid>
        <Grid item xs={12} lg={12}>
          <Collapse in={openExpand} timeout="auto">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <ProFormTextField
                  name="supplier"
                  placeholder={t('Nhà cung cấp')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <ProFormCheckboxSelect
                  name="category"
                  placeholder={t('Danh mục')}
                  options={[
                    { value: 1, label: 'Chưa gắn danh mục' },
                    { value: 2, label: 'Tuy vít' },
                  ]}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <ProFormCheckboxSelect
                  name="category"
                  placeholder={t('Danh mục nội bộ')}
                  options={[
                    { value: 1, label: 'Vỏ' },
                    { value: 2, label: 'Vỏ Độ' },
                  ]}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}></Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <ProFormTextField
                  name="salesAgent"
                  placeholder={t('Nhân viên bán hàng')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <ProFormCheckboxSelect
                  name="brand"
                  placeholder={t('Thương hiệu')}
                  options={[{ value: 1, label: 'Chưa gắn thương hiệu' }]}
                />
              </Grid>
            </Grid>
          </Collapse>
        </Grid>
      </Grid>
      <ProFormHiddenInput />
    </ProForm>
  );
});

export default FiltersForm;
