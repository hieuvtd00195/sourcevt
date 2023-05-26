import { yupResolver } from '@hookform/resolvers/yup';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Box, Stack } from '@mui/system';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProForm from 'components/ProForm';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';
import ProFormHiddenInput from 'components/ProForm/ProFormHiddenInput';
import { hours, minutes } from 'constants/time';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { FiltersRef } from 'types/refs';
import Validation from 'utils/Validation';
import { rangeOptions, STATUS, storeOptions } from '../utils/constants';
import type { FilterParams } from '../utils/filters';

interface FilterValues {
  range: number;
  startDate: Date;
  endDate: Date;
  store: number;
  fromHour: number;
  fromMinute: number;
  toHour: number;
  toMinute: number;
  brand: string;
  internalDirectory: string;
  directory: string;
  type: string;
}

const schema = Validation.shape({
  range: Validation.select(1),
  name: Validation.string().optional(),
  status: Validation.select(STATUS.ALL),
  store: Validation.select(1),
});

interface Props {
  onSearch: (params: Partial<FilterParams>) => void;
}

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { t } = useTranslation();
  const [openMoreFilter, setOpenMoreFilter] = useState<boolean>(false);

  const form = useForm<FilterValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const handleSubmit = (values: FilterValues) => {
    // handle filter
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
        <Grid item xs={6} sm={3} md={2} lg={1.2}>
          <ProFormSelect
            name="range"
            placeholder="range"
            options={rangeOptions}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProDateRange
            label={t('Khoảng ngày')}
            from="startDate"
            to="endDate"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormCheckboxSelect
            name="store"
            label={t('Cửa hàng')}
            placeholder={t('Chọn cửa hàng')}
            options={storeOptions}
            renderLabel={(option) => option.label}
            renderValue={(option) => option.value}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2} lg={1.2}>
          <ProFormSelect
            name="fromHour"
            placeholder=" "
            label="- Từ giờ -"
            options={hours}
          />
        </Grid>

        <Grid item xs={6} sm={3} md={2} lg={1.2}>
          <ProFormSelect
            name="fromMinute"
            placeholder=" "
            label="- Từ phút -"
            options={minutes}
          />
        </Grid>

        <Grid item xs={6} sm={3} md={2} lg={1.2}>
          <ProFormSelect
            name="toHour"
            placeholder=" "
            label="- Tới giờ -"
            options={hours}
          />
        </Grid>

        <Grid item xs={6} sm={3} md={2} lg={1.2}>
          <ProFormSelect
            name="toMinute"
            placeholder=" "
            label="- Tới phút -"
            options={minutes}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2} lg={1.2}>
          <Box height="100%">
            <Stack
              flexDirection="row"
              height="100%"
              sx={{ background: '#AB1D1D', borderRadius: '10px' }}
              spacing={0}
              width="fit-content"
            >
              <LoadingButton>Lọc</LoadingButton>
              <Button
                onClick={() => setOpenMoreFilter(!openMoreFilter)}
                sx={{ minWidth: '40px', width: '40px' }}
              >
                <KeyboardArrowDownIcon
                  sx={openMoreFilter ? { transform: 'rotate(180deg)' } : null}
                />
              </Button>
            </Stack>
          </Box>
        </Grid>
        {openMoreFilter && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <ProFormCheckboxSelect
                name="brand"
                label={t('Thương hiệu')}
                placeholder={t('Chọn thương hiệu')}
                options={storeOptions}
                renderLabel={(option) => option.label}
                renderValue={(option) => option.value}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <ProFormCheckboxSelect
                name="internalDirectory"
                label={t('Danh mục nội bộ')}
                placeholder={t('Chọn danh mục nội bộ')}
                options={storeOptions}
                renderLabel={(option) => option.label}
                renderValue={(option) => option.value}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ProFormCheckboxSelect
                name="directory"
                label={t('Danh mục')}
                placeholder={t('Chọn danh mục')}
                options={storeOptions}
                renderLabel={(option) => option.label}
                renderValue={(option) => option.value}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ProFormCheckboxSelect
                name="type"
                label={t('Kiểu')}
                placeholder={t('Chọn kiểu')}
                options={storeOptions}
                renderLabel={(option) => option.label}
                renderValue={(option) => option.value}
              />
            </Grid>
          </>
        )}
      </Grid>
      <ProFormHiddenInput />
    </ProForm>
  );
});

export default FiltersForm;
