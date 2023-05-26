import { Checkbox, FormControlLabel, FormGroup, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormDate from 'components/ProForm/ProFormDate';
import ProFormSelect from 'components/ProForm/ProFormSelect';
import { useState } from 'react';
import DeliveryDialog from './ProductTable/Dialog/DeliveryDialog';

const Delivery = () => {
  const [openDeliveryDialog, setOpenDeliveryDialog] = useState<boolean>(false);

  const handleClickShowInput = () => {
    setOpenDeliveryDialog(true);
  };
  return (
    <>
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
        {/* <Box sx={{ display: 'flex', fontSize: '21px' }}>720.000</Box> */}
      </Box>
      <Box>
        <Divider />
      </Box>
      <Box sx={{ padding: '15px' }}>
        <Grid
          xs={12}
          container
          item
          md={12}
          sx={{ marginBottom: 1, marginTop: 1 }}
          spacing={1}
        >
          <Grid item xs={12}>
            <ProFormSelect
              name="unit"
              options={[
                { id: 1, label: 'Không VC' },
                { id: 2, label: 'Giao hàng' },
                { id: 3, label: 'Grap' },
              ]}
              renderValue={(item) => item.id}
              renderLabel={(item) => item.label}
              placeholder="Giao hàng"
            />
          </Grid>
          <Grid item xs={12}>
            <ProFormDate name="firstDate" type="start" />
          </Grid>
          <Grid item xs={12}>
            <FormGroup sx={{ display: 'flex', marginLeft: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => {
                      handleClickShowInput();
                    }}
                  />
                }
                label="Chuyển phát"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => {
                      handleClickShowInput();
                    }}
                  />
                }
                label="COD"
              />
            </FormGroup>
          </Grid>
        </Grid>
      </Box>
      <DeliveryDialog
        open={openDeliveryDialog}
        onClose={() => {
          setOpenDeliveryDialog(!openDeliveryDialog);
        }}
      />
    </>
  );
};

export default Delivery;
