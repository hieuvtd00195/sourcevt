import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { nanoid } from '@reduxjs/toolkit';
import ActionButton from 'components/ProButton/ActionButton';
import DialogContainer from 'components/ProDialog/DialogContainer';
import DialogContent from 'components/ProDialog/DialogContent';
import DialogFooter from 'components/ProDialog/DialogFooter';
import ProForm from 'components/ProForm';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Validation from 'utils/Validation';
interface Props {
  open: boolean;
  onClose: () => void;
}

interface IForm {
  idBill: string;
}

const schema = Validation.shape({
  idBill: Validation.string().optional(),
});

const AttackSelectedBillDialog = (props: Props) => {
  const { open, onClose } = props;
  const { t } = useTranslation();
  // const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<IForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const handleSubmit = (values: IForm) => {};

  return (
    <DialogContainer open={open} onClose={onClose} maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: '5px',
        }}
      >
        <Box>
          <Typography variant="h6">Gắn nhãn danh sách đã chọn</Typography>
        </Box>
        <Box>
          <CloseIcon onClick={onClose} style={{ cursor: 'pointer' }} />
        </Box>
      </Box>
      <Box>
        <Divider />
      </Box>
      <DialogContent>
        <ProForm
          form={form}
          onFinish={handleSubmit}
          PaperProps={{ sx: { p: 2 } }}
        >
          <ProFormCheckboxSelect
            name="idBill"
            placeholder={t('Chọn nhãn')}
            options={[
              { value: nanoid(), label: 'TM' },
              { value: nanoid(), label: 'HN-1' },
              { value: nanoid(), label: 'HN-2' },
              { value: nanoid(), label: 'Sài Gòn' },
              { value: nanoid(), label: 'VTech Thanh Hóa' },
            ]}
          />
        
        </ProForm>
      </DialogContent>
      <DialogFooter>
        <ActionButton iconPosition="end" color="success">
          {t('Gán nhãn')}
        </ActionButton>
        <ActionButton iconPosition="end" color="inherit" onClick={onClose}>
          {t('Đóng')}
        </ActionButton>
      </DialogFooter>
    </DialogContainer>
  );
};

export default AttackSelectedBillDialog;
