import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ActionButton from 'components/ProButton/ActionButton';
import DialogContainer from 'components/ProDialog/DialogContainer';
import DialogContent from 'components/ProDialog/DialogContent';
import DialogFooter from 'components/ProDialog/DialogFooter';
import DialogHeader from 'components/ProDialog/DialogHeader';
import ProForm from 'components/ProForm';
import ProFormAutocomplete from 'components/ProForm/ProFormAutocomplete';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import ProTable from 'components/ProTable';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import TypedObject from 'utils/TypedObject';
import Validation from 'utils/Validation';
import useTableColumns from '../OrderColumns';

interface IProps {
  open: boolean;
  onClose: () => void;
}

const DATA = [
  {
    id: 1,
    code: 'V12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    markCode: 200002,
    importPrice: '772.00',
    costPrice: '772.00',
    price: '772.00',
    priceVAT: '772.00',
    wholesalePrice: '772.00',
    inventory: 15,
    totalInventory: 25,
    shipping: 23,
  },
  {
    id: 2,
    code: 'A12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    markCode: 200002,
    importPrice: '772.00',
    costPrice: '772.00',
    price: '772.00',
    priceVAT: '772.00',
    wholesalePrice: '772.00',
    inventory: 15,
    totalInventory: 25,
    shipping: 221,
  },
  {
    id: 3,
    code: 'G12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    markCode: 200002,
    importPrice: '772.00',
    costPrice: '772.00',
    price: '772.00',
    priceVAT: '772.00',
    wholesalePrice: '772.00',
    inventory: 22,
    totalInventory: 25,
    shipping: 45,
  },
  {
    id: 4,
    code: 'HV12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    markCode: 200002,
    importPrice: '772.00',
    costPrice: '772.00',
    price: '772.00',
    priceVAT: '772.00',
    wholesalePrice: '772.00',
    inventory: 15,
    totalInventory: 25,
    shipping: 11,
  },
  {
    id: 5,
    code: 'L12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    markCode: 200002,
    importPrice: '772.00',
    costPrice: '772.00',
    price: '772.00',
    priceVAT: '772.00',
    wholesalePrice: '772.00',
    inventory: 10,
    totalInventory: 25,
    shipping: 22,
  },
  {
    id: 6,
    code: 'E12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    markCode: 200002,
    importPrice: '772.00',
    costPrice: '772.00',
    price: '772.00',
    priceVAT: '772.00',
    wholesalePrice: '772.00',
    inventory: 5,
    totalInventory: 25,
    shipping: 32,
  },
  {
    id: 7,
    code: 'C12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    markCode: 200002,
    importPrice: '772.00',
    costPrice: '772.00',
    price: '772.00',
    priceVAT: '772.00',
    wholesalePrice: '772.00',
    inventory: 25,
    totalInventory: 25,
    shipping: 66,
  },
  {
    id: 8,
    code: 'M12PRMTRDE',
    name: 'Vỏ 12PRM 5G trắng đẹp',
    markCode: 200002,
    importPrice: '772.00',
    costPrice: '772.00',
    price: '772.00',
    priceVAT: '772.00',
    wholesalePrice: '772.00',
    inventory: 3,
    totalInventory: 25,
    shipping: 2,
  },
];

interface FormValues {}

const schema = Validation.shape({});

const ConfirmDialog = (props: IProps) => {
  const { open, onClose } = props;
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  useEffect(() => {
    form.reset({ note: '' });
  }, [form]);

  const handleReset = () => {
    onClose();
  };

  const handleSubmit = async (values: FormValues) => {
    handleReset();
    // confirmChange(values.note);
  };

  const { columns } = useTableColumns();

  return (
    <DialogContainer open={open} onClose={handleReset} maxWidth="lg" fullWidth>
      <ProForm<FormValues> form={form} onFinish={handleSubmit}>
        <DialogHeader title={t('Xác nhận phiếu đặt hàng')} />
        <DialogContent>
          <Typography variant="subtitle1" fontWeight="medium">
            Thông tin cơ bản
          </Typography>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={12} lg={6}>
              <ProFormAutocomplete
                name="acv"
                options={[{ id: 1, label: '123' }]}
                renderValue={(item) => item.id}
                renderLabel={(item) => item.label}
                placeholder={'Nhà cung cấp'}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={6}>
              <ProFormCheckboxSelect
                name="store"
                label={t('Cửa hàng')}
                placeholder={t('Cửa hàng')}
                options={[
                  { value: 1, label: 'Chưa gắn kho' },
                  { value: 2, label: 'Linh kiện Sài Gòn' },
                ]}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={6}>
              <ProFormTextField name="store" placeholder={t('Số kiện')} />
            </Grid>
            <Grid item xs={12} sm={12} lg={6}>
              <ProFormTextField
                name="store"
                placeholder={t('VAT của hóa đơn')}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={6}>
              <ProFormTextField
                name="store"
                placeholder={t('Số hóa đơn VAT')}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={6}>
              <ProFormTextField name="store" placeholder={t('Chiết khấu')} />
            </Grid>
            <Grid item xs={12} sm={12} lg={6}>
              <ProFormTextField name="store" placeholder={t('Tiền mặt')} />
            </Grid>
            <Grid item xs={12} sm={12} lg={6}>
              <ProFormTextField
                name="store"
                placeholder={t('Tiền chuyển khoản')}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <ProFormTextField name="store" placeholder={t('Ghi chú')} />
            </Grid>
          </Grid>
          <Typography variant="subtitle1" fontWeight="medium">
            Thông tin đơn hàng
          </Typography>
          <Box height="500px" mb={2}>
            <ProTable<any>
              title="Danh sách sản phẩm"
              columns={columns}
              data={DATA}
            />
          </Box>
          <Typography fontWeight="bold" textAlign="right">
            Tổng cộng: 38,554,800 VNĐ
          </Typography>
        </DialogContent>
        <DialogFooter>
          <ActionButton actionType="cancel" onClick={handleReset}>
            {t('Hủy')}
          </ActionButton>
          <ActionButton
            type="submit"
            disabled={TypedObject.isExist(form.formState.errors)}
          >
            {t('Duyệt')}
          </ActionButton>
        </DialogFooter>
      </ProForm>
    </DialogContainer>
  );
};

export default ConfirmDialog;
