import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import { Grid, InputAdornment, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ProFormAutocomplete from 'components/ProForm/ProFormAutocomplete';
// import ProFormSelect from 'components/ProForm/ProFormSelect';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import { PriceInput } from 'plugins/NumberFormat';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ProFormAutocompleteSingal from 'components/ProForm/ProFormAutocompleteSingal';
import { useDispatch, useSelector } from 'react-redux';
import { getListMasterDataPaymentAccount, getMasterDataListPaymentAccount } from 'slices/masterData';
import { AppDispatch } from 'store';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import Numeral from 'utils/Numeral';

interface ICheckShow {
  tienMat: boolean;
  chuyenKhoan: boolean;
  tienKhachDua: boolean;
}

interface IProps {
  form: any;
}

const Payment = (props: IProps) => {

  const { form } = props;

  const { watch } = useFormContext();
  // const [collapse, setCollapse] = useState<boolean>(false);
  const [checkShow, setCheckShow] = useState<ICheckShow>({
    tienMat: false,
    chuyenKhoan: false,
    tienKhachDua: false,
  });

  const dispatch = useDispatch<AppDispatch>()

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

  const fetchData = async () => {
    try {
      await dispatch(
        getListMasterDataPaymentAccount({
          pageIndex: 0,
          pageSize: 50,
        })
      );
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // console.log('watch', watch('horizontalExchange'));


  const fetchPaymentTotal = () => {
    let banking = form.watch('banking') ?? 0;
    let cash = form.watch('cash') ?? 0;
    let paymentTotal = 0;
    paymentTotal = parseFloat(banking) + parseFloat(cash)
    return paymentTotal ?? 0;
  }


  const masterDataLisPaymentAccount = useSelector(
    getMasterDataListPaymentAccount
  );

  return (
    <Box
      sx={{
        border: '1px solid #E6E8F0',
        marginBottom: '10px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          padding: '10px 15px',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex' }}>
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
        <Typography
          gutterBottom
          variant="subtitle2"
          align="right"
          sx={{ color: 'primary.main' }}
        >
          {Numeral.price(fetchPaymentTotal())}
        </Typography>
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
        {/* quỹ tiền mặt */}
        <Grid
          xs={12}
          container
          item
          md={12}
          sx={{ marginBottom: 1, marginTop: 1 }}
          spacing={2}
        >
          <Grid item xs={12} sm={12}>
            <ProFormTextField
              name="payNote"
              placeholder={'Ghi chú'}
              InputLabelProps={{ shrink: true }}
              multiline
              rows={3}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EventNoteIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <ProFormTextField
              name="cash"
              placeholder="Tiền mặt trả khách"
              InputProps={{
                inputComponent: PriceInput,
                startAdornment: (
                  <InputAdornment position="start" sx={{ cursor: 'pointer' }}>
                    <MoneyOutlinedIcon />
                  </InputAdornment>
                ),
              }}
              disabled={watch('horizontalExchange')}
            />
          </Grid>
          <Grid item xs={12}>
            <ProFormAutocompleteSingal
              name="accountCode"
              placeholder={'Tài khoản'}
              options={[
                { value: 1, label: 'TM' },
                { value: 2, label: 'HN-1' },
              ]}
              renderLabel={(option) => option.label}
              renderValue={(option) => option.value}
              disabled={watch('horizontalExchange')}
            />
          </Grid>

          {/* Tài khoản ngân hàng */}
          <Grid item xs={12}>
            <ProFormTextField
              name="banking"
              sx={{
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: '#000000',
                },
              }}
              placeholder="Chuyển khoản trả khách"
              InputProps={{
                inputComponent: PriceInput,
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleClickShowInput('chuyenKhoan')}
                  >
                    <MoneyOutlinedIcon />
                  </InputAdornment>
                ),
              }}
              disabled={watch('horizontalExchange')}
            />
          </Grid>

          <Grid item xs={12}>
            <ProFormAutocompleteSingal
              name="accountCodeBanking"
              placeholder={'Tài khoản'}
              options={masterDataLisPaymentAccount}
              renderLabel={(option) =>
                `${option?.name} - ${option?.code}`
              }
              renderValue={(option) => option?.code}
              disabled={watch('horizontalExchange')}
            />
            {/* <ProFormAutocomplete
              name="account"
              placeholder={'Tài khoản ngân hàng'}
              options={[
                { value: 1, label: 'TM' },
                { value: 2, label: 'HN-1' },
              ]}
              renderLabel={(option) => option.label}
              renderValue={(option) => option.value}
            /> */}
          </Grid>
          <Grid item xs={12}>
            <ProFormAutocompleteSingal
              name="continues"
              placeholder={'Tiếp tục trả hàng'}
              options={[
                { value: 1, label: 'Tiếp tục trả hàng' },
                { value: 2, label: 'Về danh sách hóa đơn trả hàng' },
              ]}
              renderLabel={(option) => option.label}
              renderValue={(option) => option.value}
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Payment;
