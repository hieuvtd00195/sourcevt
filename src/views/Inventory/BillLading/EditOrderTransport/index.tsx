import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormAutocomplete from 'components/ProForm/ProFormAutocomplete';
import ProFormContent from 'components/ProForm/ProFormContent';
import ProFormDateEdit from 'components/ProTable/core/EditableCell/ProFormDateEdit';
import useNotification from 'hooks/useNotification';
import useRefresh from 'hooks/useRefresh';
import { isEmpty } from 'lodash';
import { PriceDecimalInput, PriceInput } from 'plugins/NumberFormat';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getListProductApplication,
  getProductApplicationList,
} from 'slices/productApplication';
import {
  getSaleOrderbyId,
  GetSaleOrderByIdApi,
  UpdateSaleOrderApi,
} from 'slices/saleOrder';
import { AppDispatch } from 'store';
import { IDataProductApplication } from 'types/productApplication';
import { SaleOrder } from 'types/saleorder';
import Regexs from 'utils/Regexs';
import Validation from 'utils/Validation';
import ProductTable from './ProductTable';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import {
  getListSaleOrderByCode,
  getOrderTransportById,
  getOrderTransportDetail,
  getSaleOrderByCodeList,
  putUpdateOrderTransport,
} from 'slices/orderTransport';
import { OrderTransportDetail, saleOrders } from 'types/orderTransport';
import { yupResolver } from '@hookform/resolvers/yup';
import { APISearcMasterAudience } from 'services/masterdata';
import ProFormLabel from 'components/ProForm/ProFormLabel';
import ProFormAutocompleteSingal from 'components/ProForm/ProFormAutocompleteSingal';
import { IOrderTransportForm } from './utils/types';
import validationSchema from './utils/schema';
import ProFormAutocomplete2 from 'components/ProForm/Label/ProFormAutocomplete';
import ProFormDate from 'components/ProForm/ProFormDate';

interface ValueOptions {
  [key: string]: any;
}

const EditOrderTransport = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const setNotification = useNotification();
  const [, refetch] = useRefresh();

  const orderTransportDetail = useSelector(getOrderTransportDetail);
  const saleOrderByCodeList = useSelector(getSaleOrderByCodeList);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingBTN, setLoadingBTN] = useState<boolean>(false);
  const [dataOrderSlip, setDataOrderSlip] = useState<saleOrders[]>([]);

  const [supplierOptions, setSupplierOptions] = useState<ValueOptions[]>([]);
  const [saleOrderOptions, setsaleOrderOptions] = useState<saleOrders[]>([]);

  const form = useForm<IOrderTransportForm>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: 'saleOrders',
  });

  const fetchSaleOrderByCode = async () => {
    if (!id) {
      return;
    }
    try {
      await dispatch(
        getListSaleOrderByCode({ code: '', orderTransportId: id })
      );
    } catch (error) {
    } finally {
    }
  };

  const fetchDataById = async () => {
    if (!id) {
      return;
    }
    try {
      setLoading(true);
      const response = await dispatch(getOrderTransportById(id));
      if (!response.payload) {
        setNotification({
          error: 'Lỗi khi lấy dữ liệu!',
        });
      }
    } catch (error) {
      setNotification({
        error: 'Lỗi khi lấy dữ liệu!',
      });
    } finally {
      setLoading(false);
    }
  };

  //* useEffect
  useEffect(() => {
    fetchDataById();
  }, [id]);

  useEffect(() => {
    fetchSaleOrderByCode();
  }, [id]);

  useEffect(() => {
    Promise.all([
      APISearcMasterAudience({
        audienceType: 1,
        searchText: '',
      }),
    ])
      .then(([supplierRes]) => {
        setSupplierOptions(supplierRes);
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  }, []);

  useEffect(() => {
    setDataOrderSlip(orderTransportDetail?.saleOrders ?? []);
    const dataReset = {
      saleOrders: orderTransportDetail?.saleOrders,
      transporterId: orderTransportDetail?.transporterId,
      supplierName: orderTransportDetail?.supplierName,
      status: orderTransportDetail?.status,
      totalPrice:
        orderTransportDetail?.totalPrice === 0
          ? '0'
          : orderTransportDetail?.totalPrice,
      transportCode: orderTransportDetail?.transportCode,
      dateTransport: orderTransportDetail?.dateTransport,
      dateArrive: orderTransportDetail?.dateArrive,
      saleOrderId: null,
    };
    form.reset(dataReset);
  }, [orderTransportDetail]);

  useEffect(() => {
    setsaleOrderOptions(saleOrderByCodeList);
  }, [saleOrderByCodeList]);

  // function
  const onSelectOrderSlip = (id: string[] | null) => {
    if (!id || id.length === 0) return;
    const arrPush = dataOrderSlip.map((item) => item);
    id.forEach((item) => {
      const dataFind = saleOrderOptions.find((value) => value?.id === item);
      const result = {
        id: dataFind?.id,
        code: dataFind?.code,
        supplierId: null,
        supplierName: dataFind?.suplierText,
        invoiceNumber: dataFind?.invoiceNumber,
      };
      arrPush.push(result);
      append(result);
    });

    setDataOrderSlip(arrPush);
    form.setValue('saleOrderId', null);
  };

  const handleDeleteRow = (index: number, value: any) => {
    const dataRemove = dataOrderSlip.map((item) => item);
    dataRemove.splice(index, 1);
    setDataOrderSlip(dataRemove);
    remove(index);
  };

  // Submit form
  const handleSubmit = async (data: IOrderTransportForm) => {
    if (!id) {
      setNotification({
        error: 'ID đơn vận chuyển không tồn tại!',
      });
      return;
    }
    if (dataOrderSlip.length === 0) {
      setNotification({
        error: 'Cần ít nhất 1 phiếu đặt hàng để cập nhật đơn vận chuyển!',
      });
      return;
    }

    const saleOrdersId =
      data.saleOrders.length !== 0 && data.saleOrders.map((item) => item.id);

    const params = {
      orderTransportId: id ?? null,
      transporter: data?.transporterId,
      transportCode: data?.transportCode,
      status: data?.status,
      dateTransport: new Date(data.dateTransport ?? '').toJSON(),
      dateArrive: new Date(data?.dateArrive ?? '').toJSON(),
      totalPrice: data?.totalPrice ? parseFloat(data?.totalPrice) : null,
      saleOrdersId: saleOrdersId ?? [],
    };

    setLoadingBTN(true);
    dispatch(putUpdateOrderTransport(params))
      .unwrap()
      .then(() => {
        setNotification({
          message: 'Cập nhật đơn vận chuyển thành công',
          severity: 'success',
        });
        navigate('/inventory/order-slip?value=filter2');
      })
      .catch((error) => {
        setNotification({
          error: 'Lỗi khi cập nhật đơn vận chuyển!',
        });
      })
      .finally(() => setLoadingBTN(false));
    return;
  };

  return (
    <PageWrapper title="Sửa đơn vận chuyển">
      <PageBreadcrumbs
        title="Sửa đơn vận chuyển"
        items={[
          { link: '/inventory', text: 'Kho hàng' },
          {
            link: '/inventory/order-slip?value=filter2',
            text: 'Đơn vận chuyển TQ',
          },
        ]}
      />
      <ProForm form={form} onFinish={handleSubmit}>
        <ProFormContent sx={{ mb: 3 }}>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Paper sx={{ p: 2, pb: 5 }}>
                <Stack mb={1.5}>
                  <ErrorOutlineIcon />
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {t('Thông tin cơ bản')}
                  </Typography>
                </Stack>
                <Divider />
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <ProFormLabel
                      title={'Tên nhà vận chuyển'}
                      name="transporterId"
                    />
                    <ProFormAutocompleteSingal
                      name="transporterId"
                      placeholder={'Tên nhà vận chuyển'}
                      options={supplierOptions}
                      renderLabel={(option) => option?.value}
                      renderValue={(option) => option?.id}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <ProFormLabel title={'Trạng thái'} name="status" />
                    <ProFormAutocomplete2
                      name="status"
                      placeholder={t('Trạng thái')}
                      options={[
                        { value: 0, label: 'Chưa nhận' },
                        { value: 1, label: 'Đã nhận' },
                      ]}
                      renderLabel={(option) => option.label}
                      renderValue={(option) => option.value}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <ProFormLabel title={'Số tiền'} name="totalPrice" />
                    <ProFormTextField
                      name="totalPrice"
                      placeholder="Số tiền"
                      InputProps={{
                        inputComponent: PriceDecimalInput,
                        sx: {
                          '& .MuiInputBase-input.Mui-disabled': {
                            WebkitTextFillColor: '#000000',
                          },
                          '.MuiInputBase-input': { fontWeight: 700 },
                        },
                      }}
                      InputLabelProps={{
                        sx: {
                          '& .MuiInputBase-input.Mui-disabled': {
                            fontWeight: 700,
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <ProFormLabel title={'Mã vận đơn'} name="transportCode" />
                    <ProFormTextField
                      name="transportCode"
                      placeholder="Mã vận đơn"
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <ProFormLabel
                      title={'Ngày vận chuyển'}
                      name="dateTransport"
                    />
                    <ProFormDateEdit
                      name="dateTransport"
                      DatePickerProps={{
                        label: '',
                        toolbarPlaceholder: '',
                      }}
                      // validate={Validation.date()
                      //   .required('Ngày đặt hàng không được để trống')
                      //   .default(null)}
                    />
                    {/* <ProFormDate
                      name="dateTransport"
                      DatePickerProps={{ label: '' }}
                      type="start"
                      max={true}
                      valueMax={new Date()}
                    /> */}
                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <ProFormLabel title={'Ngày về'} name="dateArrive" />
                    <ProFormDateEdit
                      name="dateArrive"
                      DatePickerProps={{
                        label: '',
                        toolbarPlaceholder: '',
                      }}
                      // validate={Validation.date()
                      //   .required('Ngày đặt hàng không được để trống')
                      //   .default(null)}
                    />
                    {/* <ProFormDate
                      name="dateArrive"
                      DatePickerProps={{ label: '' }}
                      type="start"
                      max={true}
                      valueMax={new Date()}
                    /> */}
                  </Grid>
                </Grid>
              </Paper>

              <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                  <TextField
                    disabled
                    value="Phiếu đặt hàng"
                    InputProps={{
                      sx: {
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: '#000000',
                        },
                        '.MuiInputBase-input': { fontWeight: 700 },
                      },
                    }}
                    InputLabelProps={{
                      sx: {
                        '& .MuiInputBase-input.Mui-disabled': {
                          fontWeight: 700,
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={9} lg={9}>
                  <ProFormAutocomplete
                    name="saleOrderId"
                    options={saleOrderOptions}
                    renderValue={(item) => item.id}
                    renderLabel={(item) => `${item.code} - ${item.suplierText}`}
                    placeholder={'Phiếu đặt hàng'}
                    onSelect={onSelectOrderSlip}
                  />
                </Grid>
              </Grid>

              <Paper sx={{ p: 2 }}>
                <ProductTable
                  dataProductTable={dataOrderSlip}
                  handleDeleteRow={handleDeleteRow}
                />
                <Stack spacing={2} sx={{ pt: 4 }}>
                  <ActionButton
                    actionType="cancel"
                    sx={{ background: 'white' }}
                    onClick={() =>
                      navigate('/inventory/order-slip?value=filter2')
                    }
                  >
                    Hủy
                  </ActionButton>
                  <ActionButton
                    loading={loadingBTN}
                    actionType="save"
                    variant="contained"
                    type="submit"
                  >
                    Lưu
                  </ActionButton>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </ProFormContent>
      </ProForm>
    </PageWrapper>
  );
};

const Label = styled(Typography)`
  font-weight: 500;
`;

export default EditOrderTransport;
