import React from 'react';

import { Grid, Tooltip } from '@mui/material';
import ProForm from 'components/ProForm';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormContent from 'components/ProForm/ProFormContent';
import ProFormHeader from 'components/ProForm/ProFormHeader';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ICreateSettingPriceListType } from '../utils/type';

import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ProFormAutocomplete from 'components/ProForm/ProFormAutocomplete';
interface Props {
  form: UseFormReturn<ICreateSettingPriceListType>;
}

const ApplyScope = (props: Props) => {
  const { form } = props;
  const { t } = useTranslation();
  return (
    <ProForm form={form}>
      <ProFormContent m={2}>
        <ProFormHeader>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12} sm={12} md={10} lg={11}>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <SettingsIcon sx={{ marginRight: '8px' }} color="inherit" />
                Phạm vi áp dụng
              </div>
            </Grid>
          </Grid>
        </ProFormHeader>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          mt={1}
        >
          <Grid item xs={12} sm={12} md={10} lg={10}>
            <ProFormSelect
              name="store"
              placeholder={t('Cửa hàng')}
              options={[
                { value: 1, label: 'Hà Nội' },
                { value: 2, label: 'Sài Gòn' },
                { value: 3, label: 'Đà Nẵng' },
              ]}
              renderLabel={(option) => option.label}
              renderValue={(option) => option.value}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={10} lg={1}>
            <Tooltip title="Để trống nếu muốn áp dụng toàn bộ cửa hàng">
              <HelpOutlineIcon color="info" />
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={12} md={10} lg={10}>
            <ProFormAutocomplete
              name="channel"
              placeholder={t('Kênh bán')}
              InputLabelProps={{ shrink: true }}
              options={[
                { value: 1, label: 'Tất cả' },
                { value: 2, label: 'Bán lẻ' },
                { value: 3, label: 'Bán sỉ' },
                { value: 4, label: 'Đặt hàng online' },
              ]}
              renderLabel={(option) => option.label}
              renderValue={(option) => option.value}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={10} lg={1}></Grid>
          <Grid item xs={12} sm={12} md={10} lg={10}>
            <ProFormSelect
              name="customerGroup"
              placeholder={t('Nhóm khách hàng')}
              options={[
                { value: 1, label: 'Sơn Già' },
                { value: 2, label: 'Hoàng' },
                { value: 3, label: 'Đạt Vinh' },
                { value: 4, label: 'Vtech' },
              ]}
              renderLabel={(option) => option.label}
              renderValue={(option) => option.value}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={10} lg={1}></Grid>
          <Grid item xs={12} sm={12} md={10} lg={10}>
            <ProFormSelect
              name="customerLevel"
              placeholder={t('Cáp độ khách hàng')}
              options={[{ value: 1, label: '-Cấp độ khách hàng-' }]}
              renderLabel={(option) => option.label}
              renderValue={(option) => option.value}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={10} lg={1}></Grid>
          <Grid item xs={12} sm={12} md={10} lg={10}>
            <ProFormTextField
              name="billCreator"
              placeholder={t('NV tạo hóa đơn')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={10} lg={1}></Grid>
        </Grid>
      </ProFormContent>
    </ProForm>
  );
};

export default ApplyScope;
