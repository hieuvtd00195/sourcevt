import { yupResolver } from '@hookform/resolvers/yup';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Button,
  ButtonGroup,
  Checkbox,
  Collapse,
  Typography
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Stack } from '@mui/system';
import { nanoid } from '@reduxjs/toolkit';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProForm from 'components/ProForm';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';
import ProFormHiddenInput from 'components/ProForm/ProFormHiddenInput';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { FiltersRef } from 'types/refs';
import Validation from 'utils/Validation';
import type { FilterParams } from './utils/filters';

interface FilterValues {
  [key: string]: any;
}

const schema = Validation.shape({
  theongay: Validation.select(1),
});

interface Props {
  onSearch: (params: Partial<FilterParams>) => void;
  onSubmit: VoidFunction;
  onClear: VoidFunction;
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
    onSearch(values);
  };

  const handleExpand = () => {
    setOpenExpand((prev) => !prev);
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
          <ProFormSelect
            name="theongay"
            placeholder={t('')}
            options={[
              { value: 1, label: 'Theo ngày' },
              { value: 2, label: 'Theo tháng' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProDateRange label={t('Từ - đến')} from="startDate" to="endDate" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormCheckboxSelect
            name="kieuXuatkho"
            placeholder={t('Chọn kiểu xuất kho')}
            options={[
              { value: nanoid(), label: 'Bán lẻ' },
              { value: nanoid(), label: 'Bán sỉ' },
              { value: nanoid(), label: 'Giao hàng' },
            ]}
            renderLabel={(option) => option.label}
            renderValue={(option) => option.value}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormCheckboxSelect
            name="store"
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
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormTextField
            name="sanpham"
            placeholder={t('Nhập sản phẩm')}
            InputLabelProps={{ shrink: true }}
          />
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
              <Grid item container xs={6} sm={6} md={6} lg={6} spacing={2}>
                <Grid item xs={6} sm={6} md={6} lg={6}>
                  <ProFormCheckboxSelect
                    name="Danh mục"
                    label={t('Danh mục')}
                    placeholder={t('Chọn danh mục')}
                    options={[
                      { value: nanoid(), label: 'TM' },
                      { value: nanoid(), label: 'HN-1' },
                      { value: nanoid(), label: 'HN-2' },
                    ]}
                    renderLabel={(option) => option.label}
                    renderValue={(option) => option.value}
                  />
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6}>
                  <Stack direction={'row'} spacing={2}>
                    <Checkbox />
                    <Typography>Sản phẩm cha</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6}>
                  <ProFormCheckboxSelect
                    name="thuonghieu"
                    label={t('Thương hiệu')}
                    placeholder={t('Chọn thương hiệu')}
                    options={[
                      { value: nanoid(), label: 'TM' },
                      { value: nanoid(), label: 'HN-1' },
                      { value: nanoid(), label: 'HN-2' },
                    ]}
                    renderLabel={(option) => option.label}
                    renderValue={(option) => option.value}
                  />
                </Grid>
              </Grid>
              <Grid item container xs={6} sm={6} md={6} lg={6} spacing={2}>
                <Grid item xs={6} sm={6} md={6} lg={6}>
                  <ProFormCheckboxSelect
                    name="Danh mục nội bộ"
                    label={t('Danh mục nội bộ')}
                    placeholder={t('Chọn danh mục nội bộ')}
                    options={[
                      { value: nanoid(), label: 'TM' },
                      { value: nanoid(), label: 'HN-1' },
                      { value: nanoid(), label: 'HN-2' },
                    ]}
                    renderLabel={(option) => option.label}
                    renderValue={(option) => option.value}
                  />
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6}>
                  <ProFormTextField
                    name="nhacc"
                    placeholder={t('Nhà cung cấp')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
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
