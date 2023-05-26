import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import LocalStorage from 'utils/LocalStorage';

interface Props {
  open: boolean;
  onClose: () => void;
}

const LogOutDialog = (props: Props) => {
  const { open, onClose } = props;

  const handleLogOut = () => {
    LocalStorage.clear();
    window.location.reload();
  };
  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth={'xs'}>
        <DialogTitle id="alert-dialog-title">
          <Stack direction={'row'} alignItems={'center'}>
            <LogoutIcon />
            <Typography variant={'subtitle2'} fontSize={'18px'}>
              Xác nhận đăng xuất
            </Typography>
          </Stack>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText sx={{ pt: 3, pb: 3 }}>
            <Typography variant={'subtitle2'}>
              Bạn muốn đăng xuất khỏi hệ thống?
            </Typography>
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button variant="contained" onClick={handleLogOut}>
            Đăng xuất
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LogOutDialog;
