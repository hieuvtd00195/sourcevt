import { yupResolver } from '@hookform/resolvers/yup';
import ActionButton from 'components/ProButton/ActionButton';
import DialogContainer from 'components/ProDialog/DialogContainer';
import DialogContent from 'components/ProDialog/DialogContent';
import DialogFooter from 'components/ProDialog/DialogFooter';
import ProForm from 'components/ProForm';
import { useForm } from 'react-hook-form';
import TypedObject from 'utils/TypedObject';
import Validation from 'utils/Validation';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import { useEffect } from 'react';

interface FormValues {
  note: string;
}

const schema = Validation.shape({
  note: Validation.string().optional(),
});

interface Props {
  open: boolean;
  onClose: () => void;
  value: string;
  confirmChange: (store: string) => void;
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
    form.reset({ note: value });
  }, [value, form]);

  const handleReset = () => {
    onClose();
  };

  const handleSubmit = async (values: FormValues) => {
    handleReset();
    confirmChange(values.note);
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
            Sửa lưu ý
          </Typography>
          <ProFormTextField name="note" placeholder="Nhập lưu ý" multiline />
        </DialogContent>
        <DialogFooter>
          <ActionButton actionType="cancel" onClick={handleReset}>
            {t('Đóng')}
          </ActionButton>
          <ActionButton
            type="submit"
            disabled={TypedObject.isExist(form.formState.errors)}
          >
            {t('Lưu')}
          </ActionButton>
        </DialogFooter>
      </ProForm>
    </DialogContainer>
  );
};

export default EditNote;
