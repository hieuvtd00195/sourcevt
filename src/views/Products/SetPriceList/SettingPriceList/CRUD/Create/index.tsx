import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Paper, Stack } from '@mui/material';
import Page from 'components/Page';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Validation from 'utils/Validation';
import Infomation from './components/Infomation';
import { ICreateSettingPriceListType } from './utils/type';
import ApplyScope from './components/ApplyScope';
import AdvancedSetting from './components/AdvancedSetting';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import ProFormContent from 'components/ProForm/ProFormContent';
import { useParams } from 'react-router-dom';
import useNotification from 'hooks/useNotification';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store';
import { createPriceTable, updatePriceTable } from 'slices/priceTable';

const schema = Validation.shape({
  // status: Validation.select(1).optional().nullable(),
  // priceName: Validation.string().required().default(null),
  // applyStartDate: Validation.string().required("Bắt buộc"),
  // applyStartDate: Validation.string().required('Không được để trống'),
  // applyEndDate: Validation.string().optional().nullable().default(null),
  // note: Validation.string().optional().nullable().default(null),
  // store: Validation.select(0).optional().nullable(),
  // channel: Validation.select(1).optional().nullable().default(null),
  // customerGroup: Validation.select(0).optional().nullable(),
  // customerLevel: Validation.select(0).optional().nullable(),
  // billCreator: Validation.string().optional().nullable().default(null),
  // newPriceSelect: Validation.select(1).optional().nullable(),
  // category: Validation.select(0).optional().nullable(),
  // newPrice: Validation.number().nullable().default(null),
});

const Create = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const setNotification = useNotification();
  const form = useForm<ICreateSettingPriceListType>({
    mode: 'onSubmit',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });



  const handleSubmit = async (data: any) => {
    console.log('data', data);
    const body = {};
    // if (id) {
    //   dispatch(updatePriceTable({ id, ...body }))
    //     .unwrap()
    //     .then(() => {
    //       setNotification({
    //         message: 'Cập nhật thành công',
    //         severity: 'success',
    //       });
    //     })
    //     .catch((error) => {
    //       setNotification({
    //         error: 'Lỗi khi cập nhật!',
    //       });
    //     });
    //   return;
    // }
    // try {
    //   setLoading(true);
    //   const response = await dispatch(createPriceTable(data));
    //   if (response.payload === true) {
    //     setNotification({
    //       message: 'Tạo mới thành công',
    //       severity: 'success',
    //     });
    //   } else {
    //     setNotification({
    //       error: 'Lỗi khi tạo mới!',
    //     });
    //   }
    // } catch (error) {
    // } finally {
    //   setLoading(false);
    // }
  }


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
        <ProForm form={form} onFinish={handleSubmit} >
          <Stack direction="column">
            <Stack direction="row" mb={2}>
              <Paper sx={{ width: '50%' }}>
                <Infomation />
              </Paper>
              {/* <Paper sx={{ width: '50%' }}>
              <ApplyScope form={form} />
            </Paper> */}
            </Stack>
            {/* <Stack direction="row" mb={2}>
            <Paper sx={{ width: '100%' }}>
              <AdvancedSetting form={form} />
            </Paper>
          </Stack> */}
            <Box m={2.5}>
              <ActionButton variant="contained" color="success" actionType="save" type="submit">
                Lưu
              </ActionButton>
            </Box>
          </Stack>
        </ProForm>

      </PageWrapper>
    </Page>
  );
};

export default Create;
