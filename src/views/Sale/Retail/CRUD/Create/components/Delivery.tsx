import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
} from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import { useState } from 'react';
import DeliveryDialog from './ProductTable/Dialog/DeliveryDialog';
import ProFormDate from 'components/ProForm/ProFormDate';
import { useFormContext } from 'react-hook-form';

const Delivery = () => {
  const form = useFormContext();
  const [openDeliveryDialog, setOpenDeliveryDialog] = useState<boolean>(false);

  const handleClickShowInput = () => {
    setOpenDeliveryDialog(true);
  };
  return (
    <Paper sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px 15px',
        }}
      >
        <Box sx={{ display: 'flex', fontSize: '17px', fontWeight: 'bold' }}>
          Giao hàng
        </Box>
      </Box>
      <Box>
        <Divider />
      </Box>
      <Box pr="15px" pl="15px" pb="15px">
        <Grid
          xs={12}
          container
          item
          md={12}
          sx={{ marginBottom: 1, marginTop: 1 }}
          spacing={1}
        >
          <Grid item xs={12} mt={-1.5}>
            <ProFormSelect
              {...form.register('transportForm')}
              name="transportForm"
              options={[
                { value: 1, label: 'Không vận chuyển' },
                { value: 2, label: 'Giao hàng nội bộ' },
                { value: 3, label: 'Giao hàng qua hãng' },
              ]}
              placeholder="Giao hàng"
            />
            {/* <ProFormSelect
              name="unit"
              options={[
                { id: 1, label: 'Không Vận chuyển' },
                { id: 2, label: 'Giao hàng' },
                { id: 3, label: 'Grap' },
              ]}
              renderValue={(item) => item.id}
              renderLabel={(item) => item.label}
              placeholder="Giao hàng"
            /> */}
          </Grid>
        </Grid>
        {form.watch('transportForm') && form.watch('transportForm') !== 1 && (
          <>
            <Grid
              xs={12}
              container
              item
              md={12}
              sx={{ marginBottom: 1, marginTop: 1 }}
              spacing={1}
            >
              <Grid item xs={12} mt={-1.5}>
                <ProFormDate
                  name="transportDate"
                  type="start"
                  placeholder="dd/mm/yyyy"
                  disabled={false}
                  
                />
              </Grid>
            </Grid>
          </>
        )}
        {form.watch('transportForm') && form.watch('transportForm') === 3 && (
          <Grid
            xs={12}
            container
            item
            md={12}
            sx={{ marginBottom: 1, marginTop: 1 }}
            style={{ display: 'flex', flexDirection: 'row' }}
          >
            <Checkbox {...form.register('cod')} name="cod" />
            COD
          </Grid>
        )}
      </Box>
      {/* <DeliveryDialog
        open={openDeliveryDialog}
        onClose={() => {
          setOpenDeliveryDialog(!openDeliveryDialog);
        }}
      /> */}
    </Paper>
  );
};

export default Delivery;
