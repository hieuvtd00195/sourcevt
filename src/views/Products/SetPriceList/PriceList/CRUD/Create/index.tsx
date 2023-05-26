import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Paper, Stack } from '@mui/material';
import Page from 'components/Page';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Validation from 'utils/Validation';
import Infomation from './components/Infomation';
import { ICreateSettingPriceListType } from './utils/type';
import ApplyScope from './components/ApplyScope';
import AdvancedSetting from './components/AdvancedSetting';
import ActionButton from 'components/ProButton/ActionButton';

const schema = Validation.shape({
  status: Validation.select(1).optional().nullable(),
  priceName: Validation.string().optional().nullable().default(null),
  applyStartDate: Validation.string().optional().nullable().default(null),
  applyEndDate: Validation.string().optional().nullable().default(null),
  note: Validation.string().optional().nullable().default(null),
  store: Validation.select(0).optional().nullable(),
  channel: Validation.select(1).optional().nullable().default(null),
  customerGroup: Validation.select(0).optional().nullable(),
  customerLevel: Validation.select(0).optional().nullable(),
  billCreator: Validation.string().optional().nullable().default(null),
  newPriceSelect: Validation.select(1).optional().nullable(),
  category: Validation.select(0).optional().nullable(),
  newPrice: Validation.number().nullable().default(null),
});

const Create = () => {
  const { t } = useTranslation();
  const form = useForm<ICreateSettingPriceListType>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  return (
    <Page>
      <PageWrapper title={t('Thêm mới bảng giá')}>
        <PageBreadcrumbs
          title={t('Thêm mới')}
          items={[
            { link: '/products', text: 'Sản phẩm' },
            {
              link: '/products/setting-price-list',
              text: 'Thiết lập bảng giá',
            },
          ]}
        />

        <Stack direction="column">
          <Stack direction="row" mb={2}>
            <Paper sx={{ width: '50%' }}>
              <Infomation form={form} />
            </Paper>
            <Paper sx={{ width: '50%' }}>
              <ApplyScope form={form} />
            </Paper>
          </Stack>
          <Stack direction="row" mb={2}>
            <Paper sx={{ width: '100%' }}>
              <AdvancedSetting form={form} />
            </Paper>
          </Stack>
          <Box m={2.5}>
            <ActionButton variant="contained" color="success" actionType="save">
              Lưu
            </ActionButton>
          </Box>
        </Stack>
      </PageWrapper>
    </Page>
  );
};

export default Create;
