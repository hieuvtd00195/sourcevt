import { yupResolver } from '@hookform/resolvers/yup';
import PersonIcon from '@mui/icons-material/Person';
import TokenIcon from '@mui/icons-material/Token';
import { Grid, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import ProFormAutocomplete from 'components/ProForm/ProFormAutocomplete';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Validation from 'utils/Validation';
import ChangePriceDialog from './ChangePriceDialog';
import Customer from './Customer';
import Delivery from './Delivery';
import Information from './Information';
import Payment from './Payment';
import ProductTable from './ProductTable';
import Tag from './Tag';

interface IForm {}
const schema = Validation.shape({});

const EditRetail = () => {
  const { t } = useTranslation();
  const form = useForm<IForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const [openDialogChangePrice, setOpenDialogChangePrice] =
    useState<boolean>(false);

  const handleSubmit = () => {};
  return (
    <PageWrapper title={t('Sửa hóa đơn')}>
      <PageBreadcrumbs
        title={t('Sửa hóa đơn')}
        items={[{ link: '/products', text: 'Bán hàng' }]}
      />
      <ProForm
        form={form}
        onFinish={handleSubmit}
        PaperProps={{ sx: { p: 2, background: '#fff' } }}
      >
        <Grid container spacing={2} sx={{ paddingTop: '5px' }}>
          <Grid item xs={12} md={8} lg={8}>
            <Box sx={{ marginBottom: 1 }}>
              <Typography
                gutterBottom
                variant="subtitle2"
                sx={{ color: '#2196f3' }}
              >
                Lịch sử mua hàng
              </Typography>
            </Box>
            <Box
              sx={{
                border: '1px solid #E6E8F0',
                marginBottom: '10px',
              }}
            >
              {/* customer */}
              <Grid container>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      display: 'flex',
                      padding: '10px',
                    }}
                  >
                    <PersonIcon />
                    Khách hàng (Tổng điểm: 10)
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={6}
                  container
                  spacing={1}
                  sx={{
                    padding: '10px',
                  }}
                >
                  <Grid item xs={2}>
                    <Typography
                      gutterBottom
                      variant="subtitle2"
                      sx={{ color: 'primary.main' }}
                    >
                      GHCN
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      gutterBottom
                      variant="subtitle2"
                      sx={{ color: 'primary.main' }}
                    >
                      Tổng: 3.700.00
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography gutterBottom variant="subtitle2">
                      CN: 0
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      gutterBottom
                      variant="subtitle2"
                      sx={{ color: 'primary.main' }}
                    >
                      CN cuối: 3.700.00
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Box>
                <Divider />
              </Box>
              <Customer />
            </Box>
            {/* endCustomer */}

            <Box sx={{ border: '1px solid #E6E8F0', marginBottom: '10px' }}>
              <Grid container spacing={1} sx={{ padding: '10px' }}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex' }}>
                    <TokenIcon />
                    Sản phẩm
                  </Box>
                </Grid>
                <Grid item xs={12} md={6} container spacing={1}>
                  <Grid item xs={12} md={4}>
                    <ProFormAutocomplete
                      name="store"
                      placeholder="Tìm sản phẩm"
                      options={[
                        { value: 1, label: 'Tìm sản phẩm' },
                        { value: 2, label: 'Bán theo ri' },
                      ]}
                      renderLabel={(option) => option.label}
                      renderValue={(option) => option.value}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      placeholder="Tìm sản phẩm"
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} md={2}>
                  <ProFormAutocomplete
                    name="store"
                    placeholder="Chọn bảng giá"
                    options={[
                      { value: 1, label: 'Chọn bảng giá' },
                      { value: 2, label: 'SL1' },
                    ]}
                    renderLabel={(option) => option.label}
                    renderValue={(option) => option.value}
                  />
                </Grid>
              </Grid>

              <ProductTable />
            </Box>
          </Grid>
          <Grid item xs={12} md={4} lg={4} sx={{ fontSize: '14px' }}>
            {/* payment */}
            <Payment />

            {/* end payment */}
            {/* info */}
            <Information />
            {/* end info */}
            {/* tag */}
            {/* <Tag /> */}
            {/* end tag */}
            <Box
              sx={{
                border: '1px solid #E6E8F0',
                marginBottom: '10px',
              }}
            >
              <Delivery />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ActionButton
                sx={{ marginRight: 1 }}
                iconPosition="start"
                actionType="save"
                color="success"
              >
                {t('Lưu hóa đơn')}
              </ActionButton>
              <ActionButton
                iconPosition="start"
                actionType="print"
                color="info"
              >
                {t('Lưu và in')}
              </ActionButton>
            </Box>
          </Grid>
        </Grid>
        <ChangePriceDialog
          open={openDialogChangePrice}
          onClose={() => {
            setOpenDialogChangePrice(!openDialogChangePrice);
          }}
        />
      </ProForm>
    </PageWrapper>
  );
};

export default EditRetail;
