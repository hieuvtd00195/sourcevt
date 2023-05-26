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
import { useDispatch, useSelector } from 'react-redux';
import {
  getListShipperTransport,
  getShipperTransportList,
  putUpdateShipperTransport,
} from 'slices/transportApplication';
import { AppDispatch } from 'store';
import { IDataShipperTransport } from 'types/transportApplication';
import Validation from 'utils/Validation';
import { IDataSelectd } from '../utils/type';

interface Props {
  dataSelectd: IDataSelectd | null;
  open: boolean;
  onClose: () => void;
  refetch: () => void;
}

interface UpdateShipper {
  id: string;
}

const schema = Validation.shape({});

const UpdateShipperDialog = (props: Props) => {
  const { dataSelectd, open, onClose, refetch } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const setNotification = useNotification();

  const [loading, setLoading] = useState<boolean>(false);
  const [shipperOption, setShipperOption] = useState<IDataShipperTransport[]>(
    []
  );

  const shipperTransporData = useSelector(getShipperTransportList);

  const form = useForm<UpdateShipper>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  // fetch api Store
  const fetchDataShipperTransport = async () => {
    try {
      await dispatch(getListShipperTransport({}));
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchDataShipperTransport();
  }, []);

  useEffect(() => {
    setShipperOption(shipperTransporData);
  }, [shipperTransporData]);

  useEffect(() => {
    if (shipperOption.length === 0) return;
    // form.setValue('id', dataSelectd.id)
  }, [shipperOption]);

  const handleSubmit = (data: UpdateShipper) => {
    const dataShipper: any = shipperOption.find((item) => item.id === data.id);

    const params = {
      id: dataSelectd?.id,
      idShipper: dataShipper?.id,
      code: dataShipper?.code,
      name: dataShipper?.name,
      phone: dataShipper?.phone,
    };

    setLoading(true);

    dispatch(putUpdateShipperTransport(params))
      .unwrap()
      .then(() => {
        setNotification({
          message: 'Cập nhật nhân viên giao hàng thành công',
          severity: 'success',
        });
        onClose();
        refetch();
      })
      .catch((error) => {
        setNotification({
          error: 'Lỗi khi cập nhật nhân viên giao hàng!',
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
              Cập nhật nhân viên giao hàng
            </Typography>
          </DialogTitle>
          <DialogContent>
            <ProFormAutocomplete
              name="id"
              placeholder={t('Nhân viên giao hàng')}
              options={shipperOption}
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

export default UpdateShipperDialog;
