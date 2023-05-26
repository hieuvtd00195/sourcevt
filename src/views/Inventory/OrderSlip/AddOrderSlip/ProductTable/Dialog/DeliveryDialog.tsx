import { yupResolver } from '@hookform/resolvers/yup';
import { Typography } from '@mui/material';
import ActionButton from 'components/ProButton/ActionButton';
import DialogContainer from 'components/ProDialog/DialogContainer';
import DialogContent from 'components/ProDialog/DialogContent';
import DialogFooter from 'components/ProDialog/DialogFooter';
import ProForm from 'components/ProForm';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import sleep from 'utils/sleep';
import TypedObject from 'utils/TypedObject';
import Validation from 'utils/Validation';

interface FormValues {
  note: string;
  search: string;
}

const schema = Validation.shape({
  note: Validation.string(),
});

interface Props {
  open: boolean;
  onClose: () => void;
}

const DeliveryDialog = (props: Props) => {
  const { open, onClose } = props;
  const { t } = useTranslation();
  const form = useForm<FormValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });
  useEffect(() => {}, [form]);

  const handleReset = async () => {
    onClose();
    await sleep(350);
    form.reset(schema.getDefault());
  };

  const handleSubmit = async (values: FormValues) => {
    handleReset();
  };

  return (
    <DialogContainer open={open} onClose={handleReset} maxWidth="md">
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
            Vận chuyển
          </Typography>
        </DialogContent>
        <DialogFooter>
          <ActionButton actionType="cancel" onClick={handleReset}>
            {t('Đóng')}
          </ActionButton>
          <ActionButton
            type="submit"
            color="success"
            disabled={TypedObject.isExist(form.formState.errors)}
          >
            {t('Áp dụng')}
          </ActionButton>
        </DialogFooter>
      </ProForm>
    </DialogContainer>
  );
};

export default DeliveryDialog;
