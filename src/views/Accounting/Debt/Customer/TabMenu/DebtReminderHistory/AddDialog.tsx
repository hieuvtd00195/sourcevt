import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import { Button, Grid } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from 'components/ProDialog/DialogContent';
import DialogFooter from 'components/ProDialog/DialogFooter';
import DialogForm from 'components/ProDialog/DialogForm';
import DialogHeader from 'components/ProDialog/DialogHeader';
import ProFormAutocomplete from 'components/ProForm/Label/ProFormAutocomplete';
import ProFormDate from 'components/ProForm/ProFormDate';
import ProFormLabel from 'components/ProForm/ProFormLabel';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import useNotification from 'hooks/useNotification';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { APICreateDebtReminderLog } from 'services/debtReminderLog';
import { APIGetListCustomer, ICustomer } from 'services/masterdata';
import { getCustomerListApi } from 'slices/customer';
import { useTypedDispatch, useTypedSelector } from 'store';
import { ICreateDebtReminderHistory } from 'types/debtReminderLog';
import Validation from 'utils/Validation';
import { initFilter } from 'views/Customer/Customers/utils/filters';

const schema = Validation.shape({
  payDate: Validation.date()
    .required('Ngày hẹn trả bắt buộc')
    .typeError('Ngày hẹn trả bắt buộc')
    .default(null),
  customerId: Validation.string()
    .required('Tên khách hàng bắt buộc')
    .typeError('Tên khách hàng bắt buộc')
    .default(null),
});

const AddDialog = ({
  open,
  onClose,
  refetch,
}: {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
}) => {
  const { t } = useTranslation();
  const dispatch = useTypedDispatch();
  const setNotification = useNotification();
  const [customers, setCustomers] = useState<ICustomer[]>([]);

  const form = useForm<ICreateDebtReminderHistory>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const handleClose = () => {
    form.reset(schema.getDefault());
    onClose();
  };

  const handleSubmit = (data: ICreateDebtReminderHistory) => {
    APICreateDebtReminderLog(data)
      .then(() => {
        setNotification({
          message: 'Thêm lịch sử nhắc nợ thành công',
        });
        refetch();
        handleClose();
      })
      .catch((err) =>
        setNotification({
          error: 'Lỗi khi thêm lịch sử nhắc nợ',
        })
      );
  };

  const customerId = useWatch({
    control: form.control,
    name: 'customerId',
  });

  useEffect(() => {
    dispatch(getCustomerListApi({ ...initFilter, pageSize: 1000 }))
      .unwrap()
      .catch(console.log);
  }, [dispatch]);

  useEffect(() => {
    if (!customerId) return;

    const customer = customers.find((x: ICustomer) => x.id === customerId);
    if (!customerId) return;

    form.setValue('phoneNumber', customer?.phoneNumber || '');
    form.setValue('handlerStoreNames', customer?.handlerStoreNames || '');
    form.setValue('handlerEmployeeName', customer?.handlerEmployeeName || '');
  }, [customerId, customers, form]);

  useEffect(() => {
    APIGetListCustomer()
      .then((result) => {
        setCustomers(result);
      })
      .catch(console.log);
  }, []);

  return (
    <Dialog open={open} scroll="body" fullWidth>
      <DialogHeader title={t('Thêm lịch sử nhắc nợ')} />
      <DialogForm form={form} onFinish={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <ProFormLabel
                required
                title={t('Ngày hẹn trả')}
                name="payDate"
                gutterBottom
              />
              <ProFormDate name="payDate" type="start" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ProFormLabel
                required
                title={t('Tên khách hàng')}
                name="customerId"
                gutterBottom
              />
              <ProFormAutocomplete
                placeholder=""
                name="customerId"
                options={customers}
                renderLabel={(option) => option.name || ''}
                renderValue={(option) => option.id || ''}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <ProFormLabel
                title={t('Cửa hàng phụ trách')}
                name="name"
                gutterBottom
              />

              <ProFormTextField name="handlerStoreNames" disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ProFormLabel
                title={t('Số điện thoại')}
                name="phoneNumber"
                gutterBottom
              />
              <ProFormTextField name="phoneNumber" disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ProFormLabel
                title={t('Nhân viên phụ trách')}
                name="name"
                gutterBottom
              />
              <ProFormTextField name="handlerEmployeeName" disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ProFormLabel title={t('Nội dung')} name="name" gutterBottom />
              <ProFormTextField
                placeholder="Nội dung"
                name="content"
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogFooter>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={handleClose}
          >
            {t('Đóng')}
          </Button>
          <LoadingButton startIcon={<SaveIcon />} type="submit">
            {t('Thêm')}
          </LoadingButton>
        </DialogFooter>
      </DialogForm>
    </Dialog>
  );
};

export default AddDialog;
