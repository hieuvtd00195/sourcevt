import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ActionButton from 'components/ProButton/ActionButton';
import DialogContainer from 'components/ProDialog/DialogContainer';
import DialogContent from 'components/ProDialog/DialogContent';
import DialogFooter from 'components/ProDialog/DialogFooter';
import ProForm from 'components/ProForm';
import ProFormTextField from 'components/ProForm/ProFormTextField';
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

const CreateBillDialog = (props: Props) => {
  const { open, onClose } = props;
  const { t } = useTranslation();
//   const [loading, setLoading] = useState<boolean>(false);
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
          <Typography variant="h6">Tạo phiếu trả hàng</Typography>
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
          <ProFormTextField
            name="idBill"
            label={t('ID hóa đơn bán hàng:')}
            placeholder={t('ID hóa đơn bán hàng:')}
            InputLabelProps={{ shrink: true }}
          />
        </ProForm>
      </DialogContent>
      <DialogFooter>
        <ActionButton iconPosition="end" color="success">
          {t('Lập phiếu trả hàng')}
        </ActionButton>
      </DialogFooter>
    </DialogContainer>
  );
};

export default CreateBillDialog;
