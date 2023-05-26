// import { yupResolver } from '@hookform/resolvers/yup';
import MoneyIcon from '@mui/icons-material/Money';
import ReplyIcon from '@mui/icons-material/Reply';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Checkbox, Grid, InputAdornment, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useFormContext } from 'react-hook-form';
import Divider from '@mui/material/Divider';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import { PriceDecimalInput, PriceInput, SaleInput } from 'plugins/NumberFormat';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import Numeral from 'utils/Numeral';
import { useCallback, useMemo, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import Validation from 'utils/Validation';
// const schema = Validation.shape({
//   name: Validation.string().optional(),
// });
interface IProps {
  form: any;
}

const Tag = (props: IProps) => {
  const { form } = props;
  const { control, register, reset, watch, setValue } = useFormContext();
  // const form = useForm<any>({
  //   mode: 'onChange',
  //   resolver: yupResolver(schema),
  //   defaultValues: schema.getDefault(),
  // });

  // const handleSubmit = (values: any) => {};

  const fetchReturnTotal = useCallback(() => {
    const total = form.watch('form');
    const discountUnit = form.watch('discountUnit');
    const discountValue = form.watch('discountValue');


    // if (unit === 1) {
    //   totalVnd = requestPriceAsNumber * requestQuantityAsNumber - requestDiscountAsNumber;
    // } else {
    //   totalVnd = (requestPriceAsNumber * requestQuantityAsNumber) - (requestPriceAsNumber * requestQuantityAsNumber) * (requestDiscountAsNumber / 100);
    // }
    var totalReturnDiscount = 0;
    var totalReturn = 0;
    if (!discountValue) {
      // if (total) {
      //   for (const obj of total) {
      //     const quantity = parseInt(obj.quantity);
      //     const price = parseFloat(obj.price);
      //     let subTotal;
      //     subTotal = quantity * price;
      //     totalReturn += subTotal;
      //   }
      // } else {
      if (total) {
        for (const obj of total) {
          const quantity = parseInt(obj.quantity);
          const price = parseFloat(obj.price);
          const discount = parseFloat(obj.discount);
          const unit = obj.unit;

          let subTotal;

          if (unit === 1) {
            subTotal = quantity * price - discount;
          } else {
            subTotal = quantity * price - quantity * price * (discount / 100);
          }

          totalReturn += subTotal;
        }
      }
    } else {
      if (total) {
        for (const obj of total) {
          const quantity = parseInt(obj.quantity);
          const price = parseFloat(obj.price);
          let subTotal;
          subTotal = quantity * price;
          totalReturn += subTotal;
        }
      }
    }

    if (discountValue) {
      if (discountUnit === 1) {
        totalReturnDiscount = totalReturn - discountValue
      } else {
        totalReturnDiscount = totalReturn - (discountValue / 100) * totalReturn
      }
    } else {
      totalReturnDiscount = totalReturn
    }

    return <>{Numeral.price(totalReturnDiscount)}</>;
  }, []);


  return (
    <Box
      sx={{
        border: '1px solid #E6E8F0',
        marginBottom: '10px',
      }}
    >
      <Grid
        xs={12}
        container
        item
        md={12}
        sx={{ padding: '10px 15px' }}
        spacing={2}
      >
        <Grid item xs={3}>
          <ProFormSelect
            name="discountUnit"
            placeholder={'Đơn vị'}
            options={[
              { value: 0, label: '%' },
              { value: 1, label: 'VND' },
            ]}
            onSelect={(value) => {
              setValue('discountUnit', value);
            }}
          />
        </Grid>
        <Grid item xs={9}>
          <ProFormTextField
            name="discountValue"
            // placeholder="Chiết khấu"
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
      </Grid>

      <Grid
        container
        justifyContent="space-between"
        sx={{ padding: '10px 15px' }}
      >
        <Box sx={{ display: 'flex' }}>
          <MoneyIcon />
          <span
            style={{
              fontWeight: 'bold',
              display: 'inline-block',
              marginLeft: '10px',
            }}
          >
            Tổng trả
          </span>
        </Box>
        <Typography
          gutterBottom
          variant="subtitle2"
          align="right"
          sx={{ color: 'primary.main' }}
        >
          {fetchReturnTotal()}
        </Typography>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Checkbox {...form.register('horizontalExchange')} name="horizontalExchange" /> Đổi trả ngang
        </Grid>
      </Grid>
      <Box>
        <Divider />
      </Box>

      <Box sx={{ padding: '10px 15px' }}>
        <ProFormTextField
          sx={{ marginBottom: 1 }}
          name="returnAmount"
          placeholder={'Phí trả hàng'}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            inputComponent: PriceInput,
            startAdornment: (
              <InputAdornment position="start">
                <ReplyIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      {/* <Grid container justifyContent="space-between" sx={{ padding: '0 10px' }}>
        <Box sx={{ display: 'flex' }}>
          <span
            style={{
              fontWeight: 'bold',
              display: 'inline-block',
              marginLeft: '10px',
            }}
          >
            Trả lại khách
          </span>
        </Box>
        <Typography
          gutterBottom
          variant="subtitle2"
          align="right"
          sx={{ color: 'primary.main' }}
        >
          0
        </Typography>
      </Grid> */}
    </Box>
  );
};

export default Tag;
