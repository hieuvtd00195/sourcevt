import { yupResolver } from '@hookform/resolvers/yup';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HouseIcon from '@mui/icons-material/House';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import PersonIcon from '@mui/icons-material/Person';
import PrintIcon from '@mui/icons-material/Print';
import { Grid, Link, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import { useForm } from 'react-hook-form';
import Validation from 'utils/Validation';
import ProductTable from './ProductTable';
import EntriesTable from './EntiresTable';
import RestoreIcon from '@mui/icons-material/Restore';
import { useSelector } from 'react-redux';
import { getBillCustomerDetailByIdView } from 'slices/billCustomerApplicationSlice';
import Numeral from 'utils/Numeral';
import DateTime from 'utils/DateTime';
import DropzoneFileDinhKem from './DropZoneFile';
import { useRef } from 'react';
import { DragDropRef } from 'components/ProTable/types/refs';

const schema = Validation.shape({
  name: Validation.string().optional(),
});

const Info = () => {
  const customerInformation = useSelector(getBillCustomerDetailByIdView);
  const dropRef = useRef<DragDropRef>(null);
  const handleSubmit = (values: any) => {};

  const handleOpen = () => {
    dropRef.current?.onOpenDrop();
  };

  return (
    <Grid container spacing={2} sx={{ paddingTop: '5px' }}>
      <Grid item xs={12} md={8} lg={8}>
        <Box
          sx={{
            border: '1px solid #E6E8F0',
            marginBottom: '10px',
            padding: '5px',
          }}
        >
          <Box sx={{ display: 'flex', padding: '10px' }}>
            <PersonIcon />
            Khách hàng
          </Box>
          <Box>
            <Divider />
          </Box>
          <Grid container sx={{ padding: '10px' }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex' }}>
                <PersonIcon />
                <span style={{ color: '#2196f3' }}>
                  {customerInformation?.customerName}
                </span>
              </Box>
              <Box sx={{ display: 'flex' }} mt={0.5}>
                <LocalPhoneIcon />
                {customerInformation?.customerPhone}
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ border: '1px solid #E6E8F0', marginBottom: '10px' }}>
          <ProductTable idBill={customerInformation?.id} />
        </Box>
        <Box sx={{ border: '1px solid #E6E8F0', marginBottom: '10px' }}>
          <EntriesTable idBill={customerInformation?.id} />
        </Box>
        <Box
          sx={{
            border: '1px solid #E6E8F0',
            marginBottom: '10px',
            padding: '5px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 1,
            }}
          >
            <Box>
              {' '}
              <AttachFileIcon />
              File đính kèm
            </Box>
            <ActionButton
              actionType="upload"
              type="button"
              onClick={() => handleOpen()}
            >
              Chọn File
            </ActionButton>
          </Box>

          <Box>
            <Divider />
          </Box>
          <Grid container sx={{ padding: '10px', width: '100%' }}>
            <Grid item>
              <DropzoneFileDinhKem attachments={customerInformation?.attachments} ref={dropRef} billId={customerInformation?.id}/>
            </Grid>
          </Grid>
       
        </Box>
      </Grid>

      <Grid item xs={12} md={4} lg={4} sx={{ fontSize: '14px' }}>
        <Box
          sx={{
            border: '1px solid #E6E8F0',
            marginBottom: '10px',
          }}
        >
          <Box sx={{ display: 'flex', padding: '10px 15px' }}>
            <MoneyOutlinedIcon />
            <span
              style={{
                fontWeight: 'bold',
                display: 'inline-block',
                marginLeft: '10px',
              }}
            >
              Thanh toán
            </span>
          </Box>
          <Box>
            <Divider />
          </Box>
          <Grid
            container
            sx={{
              padding: '5px 15px',
            }}
          >
            <Grid item xs={12} md={6}>
              Tổng tiền
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>
                {Numeral.price(customerInformation?.amountTotal)}
              </Typography>
            </Grid>
            {/* <Grid item xs={12} md={6}>
              Lợi nhuận
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>
                (31.7%) 304.551
              </Typography>
            </Grid> */}
            <Grid item xs={12} md={6}>
              Khách còn nợ
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
              <ProMenu
                position="left"
                items={[
                  {
                    label: 'Tạo phiếu thu tiền mặt',
                    value: 1,
                    actionType: 'money',
                  },
                  {
                    label: 'Nhận chuyển khoản ngân hàng(Báo có)',
                    value: 2,
                    actionType: 'bank',
                  },
                ]}
              >
                <ActionButton
                  variant="outlined"
                  sx={{ padding: 0, marginRight: 1 }}
                >
                  +
                  <ExpandMoreIcon />
                </ActionButton>
              </ProMenu>
              {Numeral.price(customerInformation?.customerDebt) ?? 0}
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            border: '1px solid #E6E8F0',
            marginBottom: '10px',
          }}
        >
          <Box sx={{ display: 'flex', padding: '10px 15px' }}>
            <ErrorOutlineOutlinedIcon />
            <span
              style={{
                fontWeight: 'bold',
                display: 'inline-block',
                marginLeft: '10px',
              }}
            >
              Thông tin
            </span>
          </Box>
          <Box>
            <Divider />
          </Box>
          <Box sx={{ padding: '15px' }}>
            <Box sx={{ display: 'flex', paddingBottom: '15px' }}>
              <HouseIcon />
              {customerInformation?.storeText}
            </Box>
            <Grid container>
              <Grid item xs={12} md={6} container alignItems="center">
                Thu ngân
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">
                  {' '}
                  {customerInformation?.creatorText}
                </Typography>
                <Typography variant="subtitle2">14:39 03/02</Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box
          sx={{
            border: '1px solid #E6E8F0',
            marginBottom: '10px',
          }}
        >
          <Grid
            container
            justifyContent="space-between"
            sx={{ padding: '10px 15px' }}
          >
            <Grid item>
              <Box sx={{ display: 'flex' }}>
                <PrintIcon />
                <span
                  style={{
                    fontWeight: 'bold',
                    display: 'inline-block',
                    marginLeft: '10px',
                  }}
                >
                  Lịch sử in
                </span>
              </Box>
            </Grid>
            <Grid item>
              <Box
                sx={{
                  background: '#00bcd4',
                  color: '#fff',
                  borderRadius: '50%',
                  minWidth: '23px',
                  textAlign: 'center',
                }}
              >
                1
              </Box>
            </Grid>
          </Grid>
          <Box>
            <Divider />
          </Box>
          <Box sx={{ padding: '10px 15px' }}>
            <Grid container>
              <Grid item xs={12} md={6}>
                Hòa SG
              </Grid>
              <Grid item xs={12} md={6}>
                14:39 03/02
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box
          sx={{
            border: '1px solid #E6E8F0',
            marginBottom: '10px',
          }}
        >
          <Grid
            container
            justifyContent="space-between"
            sx={{ padding: '10px 15px' }}
          >
            <Grid item>
              <Box sx={{ display: 'flex' }}>
                <RestoreIcon />
                <span
                  style={{
                    fontWeight: 'bold',
                    display: 'inline-block',
                    marginLeft: '10px',
                  }}
                >
                  Lịch trình
                </span>
              </Box>
            </Grid>
          </Grid>
          <Box>
            <Divider />
          </Box>
          {customerInformation?.transportInformationLogs?.map(
            (item: any, index: any) => (
              <Box sx={{ padding: '10px 15px' }}>
                <Grid container>
                  <Grid item xs={12} md={6}>
                    <Stack direction={'column'}>
                      <Link href="#" color="info">
                        {item?.shipperText}
                      </Link>
                      {DateTime.Format(item?.createTime, 'h:mm DD/MM')}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack direction={'column'} spacing={0}>
                      <Link href="#" color="info">
                        {item?.statusText}
                      </Link>
                      <Box>
                        ID hóa đơn:{' '}
                        <Link href="#" color="info">
                          {item?.transportInformationCode}
                        </Link>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            )
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default Info;
