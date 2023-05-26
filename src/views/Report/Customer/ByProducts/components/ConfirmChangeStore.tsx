import { yupResolver } from '@hookform/resolvers/yup';
import ActionButton from 'components/ProButton/ActionButton';
import DialogContainer from 'components/ProDialog/DialogContainer';
import DialogContent from 'components/ProDialog/DialogContent';
import DialogFooter from 'components/ProDialog/DialogFooter';
import DialogHeader from 'components/ProDialog/DialogHeader';
import ProForm from 'components/ProForm';
import { useForm } from 'react-hook-form';
import TypedObject from 'utils/TypedObject';
import Validation from 'utils/Validation';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import sleep from 'utils/sleep';

interface FormValues {
  store: number | null;
}

const schema = Validation.shape({
  store: Validation.select(0).required(),
});

interface Props {
  open: boolean;
  onClose: () => void;
  confirmChange: (store: number | null) => void;
}

const ConfirmChangeStore = (props: Props) => {
  const { open, onClose, confirmChange } = props;
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const handleReset = async () => {
    onClose();
    await sleep(350);
    form.reset(schema.getDefault());
  };

  const handleSubmit = async (values: FormValues) => {
    handleReset();
    confirmChange(values.store);
  };

  return (
    <DialogContainer open={open} onClose={handleReset}>
      <DialogHeader title={t('Xác nhận xuất kho')} />
      <ProForm<FormValues> form={form} onFinish={handleSubmit}>
        <DialogContent>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 'medium',
              mb: 2,
              color: '#853a23',
              border: '1px red solid',
              borderRadius: '10px',
              padding: '10px',
              backgroundColor: '#fcf8e3',
            }}
          >
            Bạn phải chọn cửa hàng trước khi làm phiếu chuyển kho nháp
          </Typography>
          <ProFormSelect
            name="store"
            label="Từ cửa hàng"
            placeholder={t('Cửa hàng')}
            options={[
              { value: 1, label: 'Link kiện sài gòn' },
              { value: 2, label: 'Link kiện hà nội' },
            ]}
          />
        </DialogContent>
        <DialogFooter>
          <ActionButton actionType="cancel" onClick={handleReset}>
            {t('Hủy bỏ')}
          </ActionButton>
          <ActionButton
            type="submit"
            disabled={TypedObject.isExist(form.formState.errors)}
          >
            {t('Xác nhận xuất kho')}
          </ActionButton>
        </DialogFooter>
      </ProForm>
    </DialogContainer>
  );
};

export default ConfirmChangeStore;
