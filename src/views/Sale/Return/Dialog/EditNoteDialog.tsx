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
import sleep from 'utils/sleep';
import TypedObject from 'utils/TypedObject';
import Validation from 'utils/Validation';

interface FormValues {
  note: string;
}

const schema = Validation.shape({
  note: Validation.string(),
});

interface Props {
  open: boolean;
  onClose: () => void;
  value: any;
}

const EditNoteDialog = (props: Props) => {
  const { open, onClose, value } = props;
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });
  useEffect(() => {
    form.reset({ note: String(value.note) });
  }, [value, form]);

  const handleReset = async () => {
    onClose();
    await sleep(350);
    form.reset(schema.getDefault());
  };

  const handleSubmit = async (values: FormValues) => {
    handleReset();
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
            Sửa giá bán lẻ sản phẩm
          </Typography>
          <ProFormTextField
            name="note"
            placeholder="Nhập giá bán lẻ"
            multiline
            rows={2}
          />
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

export default EditNoteDialog;
