import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import ProFormAutocomplete from 'components/ProForm/Label/ProFormAutocomplete';
import useNotification from 'hooks/useNotification';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { putUpdateStatusTransport } from 'slices/transportApplication';
import { AppDispatch } from 'store';
import Validation from 'utils/Validation';
import { statusOption } from '../utils/constants';
import { IDataSelectd } from '../utils/type';

interface Props {
  dataSelectd: IDataSelectd | null;
  open: boolean;
  onClose: () => void;
  refetch: () => void;
}

interface UpdateStatus {
  status: number;
}

const schema = Validation.shape({});

const UpdateStatusDialog = (props: Props) => {
  const { dataSelectd, open, onClose, refetch } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const setNotification = useNotification();

  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<UpdateStatus>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  useEffect(() => {
    form.setValue('status', dataSelectd?.status);
  }, [dataSelectd]);

  const handleSubmit = (data: UpdateStatus) => {
    const params = {
      id: dataSelectd?.id,
      status: data?.status,
    };

    setLoading(true);

    dispatch(putUpdateStatusTransport(params))
      .unwrap()
      .then(() => {
        setNotification({
          message: 'Cập nhật trạng thái thành công',
          severity: 'success',
        });
        onClose();
        refetch();
      })
      .catch((errors) => {
        setNotification({
          error: 'Lỗi khi cập nhật trạng thái!',
        });
      })
      .finally(() => setLoading(false));
    return;
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <ProForm
          form={form}
          onFinish={handleSubmit}
          PaperProps={{ sx: { p: 2 } }}
        >
          <DialogTitle>
            <Typography variant="subtitle2" fontSize={'18px'}>
              Cập nhật trạng thái
            </Typography>
          </DialogTitle>
          <DialogContent>
            <ProFormAutocomplete
              name="status"
              placeholder={t('Trạng thái')}
              options={statusOption}
              renderLabel={(option) => option.value}
              renderValue={(option) => option.id}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={onClose}>
              Hủy
            </Button>
            <ActionButton loading={loading} variant="contained" type="submit">
              Cập nhật
            </ActionButton>
          </DialogActions>
        </ProForm>
      </Dialog>
    </>
  );
};

export default UpdateStatusDialog;
