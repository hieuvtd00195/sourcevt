import CallIcon from '@mui/icons-material/Call';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import { Grid, InputAdornment } from '@mui/material';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormAutoCompleteFreeSolo from 'components/ProForm/ProFormAutoCompleteFreeSolo';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getListCustomerProductDrop } from 'slices/billCustomerApplicationSlice';
import { getCustomerProductDropListStore } from 'slices/billCustomerApplicationSlice';
import { AppDispatch } from 'store';
interface IProps {
  handleCustomerInfo: (value: any) => void;
}

const Customer = (props: IProps) => {
  const { handleCustomerInfo } = props;
  const { control, register, reset, watch, setValue } = useFormContext();

  const [textSearchCustomerName, setTextSearchCustomerName] = useState('');
  const [textSearchCustomerPhone, setTextSearchCustomerPhone] = useState('');

  const dispatch = useDispatch<AppDispatch>();

  const customerProductDropList = useSelector(getCustomerProductDropListStore);

  const fetchCustomerDropProduct = async () => {
    const body = {
      customerName: '',
      customerPhone: '',
    };
    try {
      await dispatch(getListCustomerProductDrop(body));
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchCustomerDropProduct();
  }, [textSearchCustomerName, textSearchCustomerPhone]);

  return (
    <Grid container spacing={2} sx={{ marginTop: 1, paddingBottom: 1 }}>
      <Grid item xs={12} md={6}>
        <ProFormAutoCompleteFreeSolo
          name="customerName"
          placeholder={'Họ và tên'}
          options={customerProductDropList}
          renderLabel={(option) => option?.customerName}
          renderValue={(option) => option?.customerName}
          setTextSearchValue={setTextSearchCustomerName}
          onSelect={(value) => {
            if (value) {
              const findItem = customerProductDropList.find(
                (item) => item.customerName === value
              );
              handleCustomerInfo(findItem)
              if (findItem) {
                reset({
                  ...watch(),
                  customerPhone: findItem.customerPhone,
                  customerId: findItem.customerId,
                  customerName: findItem.customerName,
                  customerType: findItem.customerType,
                  address: findItem.address,
                  provinceId: findItem.provinceId
                });
              }
            }
          }}
          valueSelect={watch('customerName')}
          onKeyUp={(e) =>
            setTimeout(() => {
              setTextSearchCustomerName(
                (e.target as HTMLInputElement).value
              );
            }, 1000)
          }
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <ProFormTextField
          name="address"
          placeholder="Địa chỉ"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <HomeIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <ProFormAutoCompleteFreeSolo
          name="customerPhone"
          placeholder={'Số điện thoại'}
          options={customerProductDropList}
          renderLabel={(option) => option?.customerPhone}
          renderValue={(option) => option?.customerPhone}
          setTextSearchValue={setTextSearchCustomerPhone}
          onSelect={(value) => {
            if (value) {
              const findItem = customerProductDropList.find(
                (item) => item.customerPhone === value
              );
              if (findItem) {
                reset({
                  ...watch(),
                  customerPhone: findItem.customerPhone,
                  customerId: findItem.customerId,
                  customerName: findItem.customerName,
                  customerType: findItem.customerType,
                  address: findItem.address,
                  provinceId: findItem.provinceId
                });
              }
            }
          }}
          valueSelect={watch('customerPhone')}
          onKeyUp={(e) =>
            setTimeout(() => {
              setTextSearchCustomerPhone(
                (e.target as HTMLInputElement).value
              );
            }, 1000)
          }
        />
      </Grid>
    </Grid>
  );
};

export default Customer;
