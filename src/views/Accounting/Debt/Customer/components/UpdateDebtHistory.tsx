import { yupResolver } from '@hookform/resolvers/yup';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import ProFormSelect from 'components/ProForm/ProFormSelect';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Validation from 'utils/Validation';
import ProFormDate from 'components/ProForm/ProFormDate';
import ProFormLabel from 'components/ProForm/ProFormLabel';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import {
  getListStoreApplication,
  getStoreApplicationList,
} from 'slices/storeApplication';
import ProFormAutocomplete from 'components/ProForm/Label/ProFormAutocomplete';

interface Props {
  open: boolean;
  handleClose: VoidFunction;
}

interface UpdateDebtHistoryType {
  [key: string]: any;
}

const schema = Validation.shape({});

const UpdateDebtHistory = (props: Props) => {
  const { open, handleClose } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const storeApplicationList = useSelector(getStoreApplicationList);

  const form = useForm<UpdateDebtHistoryType>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  // fetch api Store
  const fetchDataStoreApplication = async () => {
    try {
      await dispatch(getListStoreApplication({}));
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchDataStoreApplication();
  }, []);

  const trimSpaceForm = (event: any, name: string) => {
    const value = event.target.value;
    form.setValue(name, value.trim());
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Cập nhật lịch sử nhắc nợ</DialogTitle>

      <DialogContent>
        <ProForm
          form={form}
          // onFinish={handleSubmit}
          PaperProps={{ sx: { p: 2 } }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <ProFormLabel title={'Ngày hẹn trả'} name="date" />
              <ProFormDate name="date" type="start" />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <ProFormLabel title={'Tên khách hàng'} name="customerName" />
              <ProFormTextField
                name="customerName"
                placeholder={t('Tên Khách hàng')}
                InputLabelProps={{ shrink: true }}
                onBlur={(event) => trimSpaceForm(event, 'customerName')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <ProFormLabel title={'Tên cửa hàng'} name="storeName" />
              <ProFormAutocomplete
                name="storeName"
                placeholder={t('Tên cửa hàng')}
                options={storeApplicationList}
                renderLabel={(option) => option.value}
                renderValue={(option) => option.id}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <ProFormLabel title={'Nội dung'} name="content" />
              <ProFormTextField
                name="content"
                placeholder={t('Nội dung')}
                InputLabelProps={{ shrink: true }}
                onBlur={(event) => trimSpaceForm(event, 'content')}
              />
            </Grid>
          </Grid>
        </ProForm>
      </DialogContent>
      <DialogActions>
        <ActionButton variant="contained" color="primary" onClick={handleClose}>
          Hủy
        </ActionButton>
        <ActionButton variant="contained" color="success" type="submit">
          Tạo
        </ActionButton>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateDebtHistory;
