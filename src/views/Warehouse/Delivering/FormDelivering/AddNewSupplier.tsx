import { yupResolver } from '@hookform/resolvers/yup';
import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import ActionButton from 'components/ProButton/ActionButton';
import DialogContainer from 'components/ProDialog/DialogContainer';
import DialogContent from 'components/ProDialog/DialogContent';
import ProForm from 'components/ProForm';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormContent from 'components/ProForm/ProFormContent';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import { useForm } from 'react-hook-form';
import Validation from 'utils/Validation';
import { IImportTable } from './utils/types';
import InfoIcon from '@mui/icons-material/Info';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import PinIcon from '@mui/icons-material/Pin';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import NoteAltIcon from '@mui/icons-material/NoteAlt';

interface Props {
  open: boolean;
  onClose: () => void;
}

const schema = Validation.shape({
  type: Validation.select(1),
});

const AddNewSupplier = (props: Props) => {
  const { open, onClose } = props;
  const form = useForm<IImportTable>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });
  const handleSubmit = (data: any) => {
    console.log(data);
  };
  return (
    <DialogContainer open={open} onClose={onClose} maxWidth="lg">
      <Box sx={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
        <AddIcon />
        <Typography variant="h6">Thêm nhà cung cấp</Typography>
      </Box>
      <Divider />
      <DialogContent>
        <ProForm form={form} onFinish={handleSubmit}>
          <div
            style={{
              marginTop: '10px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              columnGap: '40px',
            }}
          >
            <Stack direction={'column'} sx={{ minHeight: '100%' }}>
              <ProFormContent sx={{ minHeight: '100%' }}>
                <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                  <InfoIcon />
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 'medium', marginLeft: '4px' }}
                  >
                    {'Thông tin'}
                  </Typography>
                </Box>
                <Divider />
                <Grid container spacing={2} marginTop={1} marginBottom={1}>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormTextField
                      name="name"
                      placeholder="Tên"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormTextField
                      name="code"
                      placeholder="Mã"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <KeyIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormTextField
                      name="telephone"
                      placeholder="Điện thoại"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CallIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormTextField
                      name="email"
                      placeholder="Email"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormTextField
                      name="address"
                      placeholder="Địa chỉ"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HomeIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormTextField
                      name="tax"
                      placeholder="Mã số thuế"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PinIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormSelect
                      name="type"
                      options={[
                        { value: 1, label: 'Cá nhân' },
                        { value: 2, label: 'Doanh nghiệp' },
                      ]}
                      placeholder={'Loại'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormTextField
                      name="identity"
                      placeholder="Số CMND"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ContactMailIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </ProFormContent>
            </Stack>
            <Stack direction={'column'} sx={{ minHeight: '100%' }}>
              <ProFormContent sx={{ minHeight: '100%' }}>
                <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                  <CreditCardIcon />
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 'medium', marginLeft: '4px' }}
                  >
                    {'Thanh toán'}
                  </Typography>
                </Box>
                <Divider />
                <Grid container spacing={2} marginTop={1} marginBottom={1}>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormTextField
                      name="bank"
                      placeholder="Ngân hàng"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountBalanceIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormTextField
                      name="branch"
                      placeholder="Chi nhánh"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationCityIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormTextField
                      name="accountNumber"
                      placeholder="Số tài khoản"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PinIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormTextField
                      name="accountHolder"
                      placeholder="Chủ tài khoản"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ContactMailIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormTextField
                      name="note"
                      multiline
                      rows={4}
                      placeholder="Ghi chú"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <NoteAltIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </ProFormContent>
            </Stack>
            <Box margin={'20px 0px'}>
              <ActionButton actionType="save" type="submit">
                Lưu
              </ActionButton>
            </Box>
          </div>
        </ProForm>
      </DialogContent>
    </DialogContainer>
  );
};

export default AddNewSupplier;
