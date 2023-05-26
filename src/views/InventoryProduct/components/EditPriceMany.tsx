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
import sleep from 'utils/sleep';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import { PriceInput } from 'plugins/NumberFormat';
import ProInputAdornment from 'components/ProForm/ProInputAdornment';
import { useEffect } from 'react';

interface FormValues {
  price: string;
}

const schema = Validation.shape({
  price: Validation.string(),
});

interface Props {
  open: boolean;
  onClose: () => void;
  value: number | null;
  confirmChange: (store: string) => void;
}

const EditManyPrice = (props: Props) => {
  const { open, onClose, confirmChange, value } = props;
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });
  useEffect(() => {
    form.reset({ price: String(value) });
  }, [value, form]);

  const handleReset = async () => {
    onClose();
    await sleep(350);
    form.reset(schema.getDefault());
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
            Sửa giá bán sỉ sản phẩm
          </Typography>
          <ProFormTextField
            name="price"
            placeholder="Nhập giá bán sỉ"
            InputProps={{
              inputComponent: PriceInput,
              endAdornment: <ProInputAdornment>VND</ProInputAdornment>,
            }}
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

export default EditManyPrice;
