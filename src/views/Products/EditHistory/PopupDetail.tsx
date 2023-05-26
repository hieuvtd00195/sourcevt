import { Box, Divider, Typography } from '@mui/material';
import ActionButton from 'components/ProButton/ActionButton';
import DialogContainer from 'components/ProDialog/DialogContainer';
import DialogContent from 'components/ProDialog/DialogContent';

interface Props {
  open: boolean;
  onClose: () => void;
}

const PopupDetail = (props: Props) => {
  const { open, onClose } = props;
  return (
    <DialogContainer open={open} onClose={onClose} maxWidth="lg">
      <Box sx={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
        <Typography variant="h6">Lịch sử sửa xóa</Typography>
      </Box>
      <Divider />
      <DialogContent>Ảnh</DialogContent>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px',
          justifyContent: 'flex-end',
        }}
      >
        <ActionButton onClick={onClose}>Đóng</ActionButton>
      </Box>
    </DialogContainer>
  );
};

export default PopupDetail;
