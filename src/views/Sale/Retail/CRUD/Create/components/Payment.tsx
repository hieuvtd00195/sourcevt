import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SyncIcon from '@mui/icons-material/Sync';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
  Button,
  Collapse,
  FormControl,
  Grid,
  InputAdornment,
  Paper,
  Tab,
  styled,
} from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { nanoid } from '@reduxjs/toolkit';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import { PriceDecimalInput, PriceInput, SaleInput } from 'plugins/NumberFormat';
import { useEffect, useState } from 'react';
import Numeral from 'utils/Numeral';
import ActionButton from 'components/ProButton/ActionButton';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import {
  getAccountPaymentById,
  getAccountPaymentByIdList,
} from 'slices/billCustomerApplicationSlice';
import ProFormLabel from 'components/ProForm/ProFormLabel';
import ProFormAutocompleteSingal from 'components/ProForm/ProFormAutocompleteSingal';
import { useNavigate } from 'react-router-dom';

interface ICheckShow {
  tienMat: boolean;
  chuyenKhoan: boolean;
  tienKhachDua: boolean;
}
const ValueTextStyle = styled(Typography)`
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 32px;
  color: #ff0000;
`;

const Payment = () => {
  const form = useFormContext();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const accountPaymentList = useSelector(getAccountPaymentByIdList);
  const [checkShow, setCheckShow] = useState<ICheckShow>({
    tienMat: false,
    chuyenKhoan: false,
    tienKhachDua: false,
  });

  const [collapse, setCollapse] = useState<boolean>(false);

  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleClickShowInput = (type: string) => {
    if (!type) return;
    if (type === 'tienMat') {
      setCheckShow({ ...checkShow, tienMat: !checkShow.tienMat });
      return;
    }
    if (type === 'chuyenKhoan') {
      setCheckShow({ ...checkShow, chuyenKhoan: !checkShow.chuyenKhoan });
    }
  };

  const fetchAccountPaymentByStoreId = async () => {
    const idStore = form.watch('storeId');
    try {
      if (form.watch('storeId') !== null) {
        await dispatch(getAccountPaymentById(idStore));
      }
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchAccountPaymentByStoreId();
  }, [form.watch('storeId')]);

  const fetchTotalPayment = () => {
    const total = form.watch('form');
    let TTParent = 0;
    let TTChild = 0;
    total?.forEach((item: any, index: any) => {
      TTParent += item.quantity * item.price;
      if (item.productChildren) {
        item.productChildren.forEach((ch: any) => {
          TTChild += ch.quantity * ch.price;
        });
      }
    });
    const totalEnd = TTParent + TTChild;
    return <>{Numeral.price(totalEnd)}</>;
  };

  const fetchTotalNeedPay = () => {
    const total = form.watch('form');
    let TTParent = 0;
    let TTChild = 0;
    let totalBeforeDisscount = 0;
    let totalBeforeVat = 0;
    const discountType = form.watch('discountUnit');
    const discountRate = form.watch('discountValue');
    const vatValue = form.watch('vatValue');
    const vatUnit = form.watch('vatUnit');
    total?.forEach((item: any, index: any) => {
      TTParent += item.quantity * item.price;
      if (item.productChildren) {
        item.productChildren.forEach((ch: any) => {
          TTChild += ch.quantity * ch.price;
        });
      }
    });
    const totalValue = TTParent + TTChild;
    if (discountType === 0) {
      totalBeforeDisscount = (totalValue * discountRate) / 100;
    } else {
      totalBeforeDisscount = totalValue - discountRate;
    }
    
    if (vatUnit === 0) {
      totalBeforeVat = ((totalValue - totalBeforeDisscount ) * vatValue) / 100;
    } else {
      totalBeforeVat = vatValue;
    }
    
    const lastTotalBeforeDisscountVAT =
      totalValue - totalBeforeDisscount + Number(totalBeforeVat);
    return <>{Numeral.price(lastTotalBeforeDisscountVAT)}</>;
  };

  const fetchTotalMissPay = () => {
    const total = form.watch('form');
    let TTParent = 0;
    let TTChild = 0;
    let totalBeforeDisscount = 0;
    let totalBeforeVat = 0;
    const discountType = form.watch('discountUnit');
    const discountRate = form.watch('discountValue');
    const vatValue = form.watch('vatValue');
    const vatUnit = form.watch('vatUnit');
    const Tienmat = form.watch('cash') ?  form.watch('cash') : 0;
    const Chuyenkhoan = form.watch('banking') ? form.watch('banking') : 0;
    total?.forEach((item: any, index: any) => {
      TTParent += item.quantity * item.price;
      if (item.productChildren) {
        item.productChildren.forEach((ch: any) => {
          TTChild += ch.quantity * ch.price;
        });
      }
    });
    const totalValue = TTParent + TTChild;
    if (discountType === 0) {
      totalBeforeDisscount = (totalValue * discountRate) / 100;
    } else {
      totalBeforeDisscount = totalValue - discountRate;
    }
    if (vatUnit === 0) {
      totalBeforeVat = ((totalValue - totalBeforeDisscount ) * vatValue) / 100;
    } else {
      totalBeforeVat = vatValue;
    }
    const lastTotalBeforeDisscountVAT =
      totalValue - totalBeforeDisscount + Number(totalBeforeVat);
    const totalMoneyVendorHave = Number(Tienmat) + Number(Chuyenkhoan);
    const totalMissing = lastTotalBeforeDisscountVAT - totalMoneyVendorHave;

    return <>{Numeral.price(totalMissing)}</>;
  };

  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          <Tab
            style={{
              padding: '0 12px 10px 12px',
              backgroundColor: value === '1' ? '#ffffff' : '#c6c6c6',
              borderRadius: '5px 5px 0 0',
              width: '50%',
              textTransform: 'none',
            }}
            label=" Tổng tiền hàng"
            value="1"
          />
          <Tab
            style={{
              padding: '0 12px 10px 12px',
              backgroundColor: value === '2' ? '#ffffff' : '#c6c6c6',
              borderRadius: '5px 5px 0 0',
              width: '50%',
              textTransform: 'none',
            }}
            label="Ghi chú"
            value="2"
          />
        </TabList>
      </Box>

      <Paper sx={{ p: 3 }}>
        {value === '1' ? (
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 15px',
              }}
            >
              <Box
                sx={{ display: 'flex', fontSize: '17px', fontWeight: 'bold' }}
              >
                Tổng tiền hàng
              </Box>
              <Box sx={{ display: 'flex' }}>
                <ValueTextStyle>{fetchTotalPayment()}</ValueTextStyle>
              </Box>
            </Box>

            <Box sx={{ padding: '15px 20px' }}>
              <Grid
                xs={12}
                container
                item
                md={12}
                sx={{ marginBottom: 1, marginTop: 1 }}
                spacing={1}
              >
                <Grid item xs={3} container alignContent="center">
                  Trạng thái
                </Grid>
                <Grid item xs={9}>
                  <ProFormSelect
                    {...form.register('customerBillPayStatus')}
                    name="customerBillPayStatus"
                    placeholder={'Trạng Thái'}
                    options={[
                      { value: '0', label: 'Khách hàng đặt' },
                      { value: '1', label: 'Chờ gọi hàng' },
                      { value: '2', label: 'Lên đơn' },
                      { value: '3', label: 'Đã đặt hàng' },
                      { value: '4', label: 'Đã kiểm xong' },
                      { value: '5', label: 'Đang giao hàng' },
                      { value: '6', label: 'Thành công' },
                    ]}
                    onSelect={(e) => {
                      navigate(`/sales/retail/create/${e}`, { replace: true })

                    }}
                  />
                </Grid>
                {/* chiết khấu */}

                <Grid item xs={3} container alignContent="center">
                  Chiết khấu (F6)
                </Grid>

                <Grid item xs={3}>
                  <ProFormSelect
                    {...form.register('discountUnit')}
                    name="discountUnit"
                    defaultValue={0}
                    options={[
                      { value: 0, label: '%' },
                      { value: 1, label: 'VND' },
                    ]}
                    placeholder="%"
                  />
                </Grid>
                <Grid item xs={6}>
                  <ProFormTextField
                    name="discountValue"
                    placeholder={
                      form.watch('discountUnit') === 0 ? 'Phần trăm' : 'Số tiền'
                    }
                    InputProps={{
                      inputComponent:
                        form.watch('discountUnit') === 0
                          ? SaleInput
                          : PriceDecimalInput,
                      startAdornment: (
                        <InputAdornment position="start">
                          <ArrowForwardIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                {/* coupon */}

                {/* <Grid item xs={3} container alignContent="center">
                  Coupon
                </Grid>
                <Grid item xs={9}>
                  <ProFormTextField
                    name="price"
                    placeholder=""
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <SyncIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid> */}
              </Grid>
              <Grid item xs={12} md={2} sx={{ marginBottom: 2, marginTop: 1 }}>
                <Grid alignContent="center">
                  VAT
                  <ActionIconButton
                    actionType="vat"
                    sx={!collapse ? { transform: 'rotate(180deg)' } : null}
                    onClick={() => setCollapse(!collapse)}
                  />
                </Grid>
              </Grid>
              <Box>
                <Collapse in={collapse} timeout="auto">
                  <Grid xs={12} container item md={12} spacing={1}>
                    <Grid item xs={3} container alignContent="center">
                      VAT
                    </Grid>
                    <Grid item xs={3}>
                      <ProFormSelect
                        {...form.register('vatUnit')}
                        name="vatUnit"
                        defaultValue={0}
                        options={[
                          { value: 0, label: '%' },
                          { value: 1, label: 'VND' },
                        ]}
                        placeholder="%"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <ProFormTextField
                        {...form.register('vatValue')}
                        name="vatValue"
                        placeholder={
                          form.watch('discountUnit') === 0
                            ? 'Phần trăm'
                            : 'Số tiền'
                        }
                        InputProps={{
                          inputComponent:
                            form.watch('discountUnit') === 0
                              ? SaleInput
                              : PriceDecimalInput,
                          startAdornment: (
                            <InputAdornment position="start">
                              <ArrowForwardIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Collapse>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                }}
              >
                <Box
                  sx={{ display: 'flex', fontSize: '17px', fontWeight: 'bold' }}
                >
                  Khách cần trả
                </Box>
                <Typography
                  gutterBottom
                  variant="subtitle1"
                  align="right"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '21px',
                    color: '#038151',
                  }}
                >
                  {fetchTotalNeedPay()}
                </Typography>
              </Box>
              <Grid container spacing={2} sx={{ marginBottom: 1 }}>
                <Grid item xs={3} container alignContent="center">
                  Tiền mặt(F8)
                </Grid>
                <Grid item xs={9}>
                  <ProFormTextField
                    name="cash"
                    placeholder="Tiền mặt"
                    InputProps={{
                      inputComponent: PriceDecimalInput,
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleClickShowInput('tienMat')}
                        >
                          <ArrowForwardIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ marginBottom: 1 }}>
                <Grid item xs={3} container alignContent="center">
                  Tài khoản
                </Grid>
                <Grid item xs={9}>
                  <ProFormAutocompleteSingal
                    name="accountCode"
                    placeholder={'Tài khoản'}
                    options={accountPaymentList}
                    renderLabel={(option) =>
                      `${option?.name} - ${option?.code}`
                    }
                    renderValue={(option) => option?.code}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ marginBottom: 1 }}>
                {/* Tài khoản ngân hàng */}
                <Grid item xs={3} container alignContent="center">
                  Chuyển khoản
                </Grid>
                <Grid item xs={9}>
                  <ProFormTextField
                    name="banking"
                    placeholder="Chuyển khoản"
                    InputProps={{
                      inputComponent: PriceDecimalInput,
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleClickShowInput('chuyenKhoan')}
                        >
                          <ArrowForwardIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ marginBottom: 1 }}>
                <Grid item xs={3} container alignContent="center">
                  Tài khoản
                </Grid>
                <Grid item xs={9}>
                  <ProFormAutocompleteSingal
                    name="accountCodeBanking"
                    placeholder={'Tài khoản'}
                    options={accountPaymentList}
                    renderLabel={(option) =>
                      `${option?.name} - ${option?.code}`
                    }
                    renderValue={(option) => option?.code}
                  />
                </Grid>
              </Grid>

              <Grid
                container
                spacing={2}
                sx={{ marginBottom: 1, fontSize: '17px', fontWeight: 'bold' }}
              >
                <Grid item xs={12} md={6}>
                  Còn thiếu
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    gutterBottom
                    variant="subtitle1"
                    align="right"
                    sx={{ color: 'primary.main', fontSize: '21px' }}
                  >
                    {fetchTotalMissPay()}
                  </Typography>
                </Grid>
              </Grid>
              <ProFormTextField
                fullWidth
                multiline
                name="payNote"
                placeholder="&#xe616; Ghi chú"
                InputProps={{
                  sx: {
                    '.MuiInputBase-input': {
                      fontFamily:
                        'Roboto,Helvetica,Arial,sans-serif , Material Icons !important',
                    },
                  },
                }}
                rows={3}
              />
            </Box>
          </>
        ) : (
          <Grid item xs={12} md={12}>
            <ProFormTextField
              fullWidth
              multiline
              name="note"
              placeholder="&#xe616; Ghi chú của nhân viên"
              InputProps={{
                sx: {
                  '.MuiInputBase-input': {
                    fontFamily:
                      'Roboto,Helvetica,Arial,sans-serif , Material Icons !important',
                  },
                },
              }}
              rows={20}
            />
          </Grid>
        )}
      </Paper>
    </TabContext>
  );
};

export default Payment;
