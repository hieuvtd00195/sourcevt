import { Box, Divider, Typography } from '@mui/material';
import ActionButton from 'components/ProButton/ActionButton';
import DialogContainer from 'components/ProDialog/DialogContainer';
import DialogContent from 'components/ProDialog/DialogContent';
import DialogFooter from 'components/ProDialog/DialogFooter';
import { useTranslation } from 'react-i18next';
import sleep from 'utils/sleep';

interface Props {
  open: boolean;
  onClose: () => void;
  // value?: any;
}

const ChangePriceDialog = (props: Props) => {
  const { open, onClose } = props;
  const { t } = useTranslation();

  const handleReset = async () => {
    onClose();
    await sleep(350);
  };

  return (
    <DialogContainer open={open} onClose={handleReset} maxWidth="sm">
      <DialogContent>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 'medium',
            mb: 2,
            padding: '10px',
          }}
        >
          Thay đổi bảng giá
        </Typography>
        <Box>
          <Divider />
        </Box>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 'medium',
            mb: 2,
            padding: '10px',
          }}
        >
          Bạn có muốn loại bỏ những sản phẩm không nằm trong bảng giá{' '}
          <span style={{ color: '#f44336' }}>SL 1</span>?
        </Typography>
        <ul style={{ color: '#00bcd4' }}>
          <li>Phím XSM Vàng</li>
          <li>Phím XSM Vàng</li>
        </ul>
      </DialogContent>
      <DialogFooter>
        <ActionButton actionType="cancel" onClick={handleReset}>
          {t('Không')}
        </ActionButton>
        <ActionButton type="submit" color="success">
          {t('Có')}
        </ActionButton>
      </DialogFooter>
    </DialogContainer>
  );
};

export default ChangePriceDialog;
