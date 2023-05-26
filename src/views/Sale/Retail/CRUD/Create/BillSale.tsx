import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Paper, Switch, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import DropdownCustom from 'components/DropdownCustom';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import { ForwardedRef, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import Validation from 'utils/Validation';
import Customer from './components/Customer';
import Delivery from './components/Delivery';
import Payment from './components/Payment';
import ProductTable from './components/ProductTable';
import { TableRef, TableRefParent } from 'components/ProTable/types/refs';

interface Props<T> {

}
const schema = Validation.shape({});

const BillSale = <T extends object>(
  props: Props<T>,
  refAction: ForwardedRef<TableRefParent>
) => {
  // const { t } = useTranslation();
  // const {
  //   control,
  //   register,
  //   reset,
  //   watch,
  //   setValue,
  //   formState: { errors }
  // } = useFormContext() 
  const [openSwitch, setOpenSwitch] = useState<boolean>(false);

  const tableRef = useRef<TableRefParent>(null);

  
  const handleSubmit = () => {
    // console.log(errors)
  };
  const handleTrigger =() => {
    tableRef.current?.onExpandedOpen();
  }
  
  useImperativeHandle(refAction, () => ({
    onExpandedOpen: handleTrigger
  }));

  return (
    // <Paper sx={{ p: 1, pb: 5 }}>
    <Grid container spacing={2}>
      <Grid item xs={9} md={9}>
        <Customer />
        <Box sx={{ my: 2 }}>
          <Typography
            gutterBottom
            variant="subtitle2"
            sx={{ color: '#2196f3' }}
          >
            Lịch sử mua hàng
          </Typography>
        </Box>
        <ProductTable ref={tableRef}/>
      </Grid>

      <Grid item xs={3} md={3}>
        <Box
          sx={{
            marginBottom: '10px',
          }}
        >
          <Payment />
        </Box>
        <Box
          sx={{
            marginBottom: '10px',
          }}
        >
          <Delivery />
        </Box>
        <Box sx={{ marginBottom: 2, textAlign: 'right' }}>
          <ActionButton
            type="submit"
            iconPosition="start"
            color="success"
            actionType="save"
          >
            Lưu (F9)
          </ActionButton>
          <DropdownCustom
            open={openSwitch}
            setOpen={() => setOpenSwitch(!openSwitch)}
            actionType="arrowDown"
          >
            <>
              <Switch defaultChecked color="info" />
              Tự động in sau khi lưu hóa đơn (F10)
            </>
          </DropdownCustom>
        </Box>
      </Grid>
    </Grid>
    // </Paper>
  );
};

export default forwardRef(BillSale);
