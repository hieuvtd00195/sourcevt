import { Box, Grid, Stack } from '@mui/material';
import Paper from '@mui/material/Paper';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import ProFormContent from 'components/ProForm/ProFormContent';
import ProFormHeader from 'components/ProForm/ProFormHeader';
import ProFormLabel from 'components/ProForm/ProFormLabel';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import { useForm } from 'react-hook-form';
const EditImexProducts = () => {
  const form = useForm<any>({
    mode: 'onChange',
  });
  const handleSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <PageWrapper title={'Sửa sản phẩm xuất nhập kho'}>
      <PageBreadcrumbs
        title={'Sửa sản phẩm xuất nhập kho'}
        items={[{ link: '/inventory', text: 'Sản phẩm xuất nhập kho' }]}
      />
      <Stack direction="column" marginTop={'10px'}>
        <ProForm form={form} onFinish={handleSubmit}>
          <ProFormContent>
            <Paper sx={{ p: 2 }}>
              <ProFormHeader>{'XNK tại kho: Linh kiện sài gòn'}</ProFormHeader>
              <Grid container spacing={2} marginTop={1} marginBottom={1}>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <ProFormLabel title={'Sản phẩm'} name="product" />
                  <ProFormTextField name="product" placeholder={'Sản phẩm'} />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}></Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <ProFormLabel title={'Số lượng'} name="quantity" />
                  <ProFormTextField name="quantity" placeholder={'Số lượng'} />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}></Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <ProFormLabel title={'Giá tiền'} name="price" />
                  <ProFormTextField name="price" placeholder={'Giá tiền'} />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}></Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <ProFormLabel title={'Mô tả'} name="des" />
                  <ProFormTextField name="des" placeholder={'Mô tả'} />
                </Grid>
              </Grid>
              <Box sx={{ marginTop:'25px' }}>
                <Stack direction="row" spacing={1}>
                  <ActionButton actionType="save" type="submit">
                    Lưu
                  </ActionButton>
                </Stack>
              </Box>
            </Paper>
          </ProFormContent>
        </ProForm>
      </Stack>
    </PageWrapper>
  );
};

export default EditImexProducts;
