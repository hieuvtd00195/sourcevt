import { yupResolver } from '@hookform/resolvers/yup';
import { Typography } from '@mui/material';
import ActionButton from 'components/ProButton/ActionButton';
import DialogContainer from 'components/ProDialog/DialogContainer';
import DialogContent from 'components/ProDialog/DialogContent';
import DialogFooter from 'components/ProDialog/DialogFooter';
import ProForm from 'components/ProForm';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import TypedObject from 'utils/TypedObject';
import Validation from 'utils/Validation';

interface FormValues {
  price: number;
}

const schema = Validation.shape({
  price: Validation.number().optional(),
});

interface Props {
  open: boolean;
  onClose: () => void;
  value: number;
  confirmChange: (store: number) => void;
}

const EditNote = (props: Props) => {
  const { open, onClose, confirmChange, value } = props;
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });
  useEffect(() => {
    form.reset({ price: value });
  }, [value, form]);

  const handleReset = () => {
    onClose();
  };

  const handleSubmit = async (values: FormValues) => {
    handleReset();
    confirmChange(values.price);
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
            Cập nhật giá
          </Typography>
          <ProFormTextField name="note" placeholder="Cập nhật giá" />
        </DialogContent>
        <DialogFooter>
          <ActionButton actionType="cancel" onClick={handleReset}>
            {t('Hủy')}
          </ActionButton>
          <ActionButton
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
