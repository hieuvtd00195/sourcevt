import { yupResolver } from '@hookform/resolvers/yup';
import PersonIcon from '@mui/icons-material/Person';
import TokenIcon from '@mui/icons-material/Token';
import { Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Validation from 'utils/Validation';
import Customer from './Customer';
import Information from './Information';
import Payment from './Payment';
import ProductTable from './ProductTable';

interface IForm {}
const schema = Validation.shape({});

const EditRetail = () => {
  const { t } = useTranslation();
  const form = useForm<IForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const handleSubmit = () => {};
  return (
    <PageWrapper title={t('Sửa hóa đơn')}>
      <PageBreadcrumbs
        title={t('Sửa hóa đơn')}
        items={[
          { link: '/sales', text: 'Bán hàng' },
          { link: '/sales/retail', text: 'Bán lẻ' },
        ]}
      />
      <ProForm
        form={form}
        onFinish={handleSubmit}
        PaperProps={{ sx: { p: 2, background: '#fff' } }}
      >
        <Grid container spacing={2} sx={{ paddingTop: '5px' }}>
          <Grid item xs={12} md={8} lg={8}>
            <Box
              sx={{
                border: '1px solid #E6E8F0',
                marginBottom: '10px',
                padding: '5px',
              }}
            >
              {/* customer */}
              <Grid container>
                <Grid item xs={12} md={1.7}>
                  <Box sx={{ display: 'flex', padding: '10px' }}>
                    <PersonIcon />
                    Khách hàng
                  </Box>
                </Grid>
                <Grid item xs={12} md={4.5} container alignContent={'center'}>
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
                <Grid item xs={12} md={8} container spacing={1}>
                  <Grid item xs={12} md={4}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={1}
                      label="Age"
                      onChange={() => {}}
                    >
                      <MenuItem value={1}>Tìm sản phẩm</MenuItem>
                      <MenuItem value={2}>Bán theo ri</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      placeholder="(F3) Gõ tên, mã sản phẩm hoặc dùng đầu đọc mã vạch"
                    />
                  </Grid>
                </Grid>
              </Grid>

              <ProductTable />
            </Box>
          </Grid>
          <Grid item xs={12} md={4} lg={4} sx={{ fontSize: '14px' }}>
            {/* tag */}
            {/* <Tag /> */}
            {/* end tag */}
            {/* payment */}
            <Payment />
            {/* end payment */}
            {/* info */}
            <Information />
            {/* end info */}

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ActionButton
                sx={{ marginRight: 1 }}
                iconPosition="start"
                actionType="save"
                color="success"
              >
                {t('Lưu hóa đơn')}
              </ActionButton>
              {/* <ActionButton
                iconPosition="start"
                actionType="print"
                color="info"
              >
                {t('Lưu và in')}
              </ActionButton> */}
            </Box>
          </Grid>
        </Grid>
      </ProForm>
    </PageWrapper>
  );
};

export default EditRetail;
