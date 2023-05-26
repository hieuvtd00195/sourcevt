import { yupResolver } from '@hookform/resolvers/yup';
import { Typography } from '@mui/material';
import ActionButton from 'components/ProButton/ActionButton';
import DialogContainer from 'components/ProDialog/DialogContainer';
import DialogContent from 'components/ProDialog/DialogContent';
import DialogFooter from 'components/ProDialog/DialogFooter';
import ProForm from 'components/ProForm';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import { PriceDecimalInput } from 'plugins/NumberFormat';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import TypedObject from 'utils/TypedObject';
import Validation from 'utils/Validation';

interface FormValues {
  requestPrice: string | null;
}

const schema = Validation.shape({});

interface Props {
  open: boolean;
  onClose: () => void;
  value: string | null;
  confirmChange: (store: string | null) => void;
  loadingBTN: boolean;
}

const EditNote = (props: Props) => {
  const { open, onClose, confirmChange, value, loadingBTN } = props;

  const { t } = useTranslation();

  const form = useForm<FormValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });
  useEffect(() => {
    form.reset({ requestPrice: value });
  }, [value, form]);

  const handleReset = () => {
    onClose();
  };

  const handleSubmit = async (values: FormValues) => {
    handleReset();
    confirmChange(values.requestPrice);
  };

  return (
    <DialogContainer open={open} onClose={handleReset}>
      <ProForm<FormValues> form={form} onFinish={handleSubmit}>
        <DialogContent>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 'medium',
              mb: 2,
              padding: '10px',
            }}
          >
            Sửa giá yêu cầu
          </Typography>
          <ProFormTextField
            name="requestPrice"
            placeholder="Giá yêu cầu"
            InputProps={{
              inputComponent: PriceDecimalInput,
              sx: {
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: '#000000',
                },
                '.MuiInputBase-input': { fontWeight: 700 },
              },
            }}
            InputLabelProps={{
              sx: {
                '& .MuiInputBase-input.Mui-disabled': {
                  fontWeight: 700,
                },
              },
            }}
          />
        </DialogContent>
        <DialogFooter>
          <ActionButton actionType="cancel" onClick={handleReset}>
            {t('Hủy')}
          </ActionButton>
          <ActionButton
            loading={loadingBTN}
            type="submit"
            disabled={TypedObject.isExist(form.formState.errors)}
          >
            {t('Cập nhật')}
          </ActionButton>
        </DialogFooter>
      </ProForm>
    </DialogContainer>
  );
};

export default EditNote;
