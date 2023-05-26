import { yupResolver } from '@hookform/resolvers/yup';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import { nanoid } from '@reduxjs/toolkit';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import FormRadioGroup from 'components/ProForm/FormRadioGroup';
import ProFormAutocomplete from 'components/ProForm/Label/ProFormAutocomplete';
import ProFormCheckbox from 'components/ProForm/Label/ProFormCheckbox';
import ProFormTextFiedTrim from 'components/ProForm/Label/ProFormTextFiedTrim';
import ProFormContent from 'components/ProForm/ProFormContent';
import ProFormLabel from 'components/ProForm/ProFormLabel';
import ProTable from 'components/ProTable';
import { TableRef } from 'components/ProTable/types/refs';
import useNotification from 'hooks/useNotification';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { APIUpdateTransport } from 'services/transportApplication';
import {
  getCustomerListAll,
  getListCustomer,
  getListStore,
  getStoreList,
} from 'slices/saleOrderTransport';
import {
  getDataTransportById,
  getTransportById,
} from 'slices/transportApplication';
import { AppDispatch } from 'store';
import type { FiltersRef } from 'types/refs';
import {
  IDataTransportById,
  ITransportByIdParams,
} from 'types/transportApplication';
import useTableColumns from './TableColumns';
import { schema } from './utils/schema';
import {
  ICustomerOption,
  TableCreateOrder,
  UpdateOrderTransport,
} from './utils/type';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { LoadingButton } from '@mui/lab';

interface IStoreOptions {
  [key: string]: any;
}

interface IValTransport {
  idOrder: string | null;
  customerNameOrders: string | null;
}

const UpdateTransport = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [, refetch] = useRefresh();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const setNotification = useNotification();
  const tableRef = useRef<TableRef>(null);
  const formRef = useRef<FiltersRef>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [dataTransport, setDataTransport] = useState<IDataTransportById | null>(
    null
  );
  const [storeOptions, setStoreOptions] = useState<IStoreOptions[]>([]);
  const [storeSelect, setStoreSelect] = useState<any[]>([]);
  const [storeSelectDefault, setStoreSelectDefault] = useState<any[]>([]);
  const [valueRadio, setValueRadio] = useState<number>(2);
  const [valTransport, setValTransport] = useState<IValTransport>({
    idOrder: null,
    customerNameOrders: null,
  });
  const [customerOption, setCustomerOption] = useState<ICustomerOption[]>([]);

  const [filters] = useState<any>({
    pageNumber: 1,
    pageSize: 25,
  });

  const storeList = useSelector(getStoreList);
  const customerProductDropList = useSelector(getCustomerListAll);
  const dataTransportById = useSelector(getDataTransportById);

  const form = useForm<UpdateOrderTransport>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const {
    fields: fieldsTransfers,
    append: appendTransfers,
    remove: removeTransfers,
  } = useFieldArray({
    control: form.control,
    name: 'attachment',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'toStoreId',
  });

  const fetchDataById = async (params: ITransportByIdParams) => {
    try {
      setLoading(true);
      const response = await dispatch(getTransportById(params));
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

  useEffect(() => {
    if (!id) return;
    fetchDataById({ id: id });
  }, [id]);

  useEffect(() => {
    setDataTransport(dataTransportById);
  }, [dataTransportById]);

  useEffect(() => {
    if (!dataTransport) return;
    const rowId = nanoid();
    const toStoreId = dataTransport?.toStoreId
      ? dataTransport?.toStoreId.split(',')
      : [];

    const toStoreIdArr = toStoreId.map((item: any) => {
      return { storeId: item };
    });
    const attachmentToJson = dataTransport?.attachment
      ? JSON.parse(dataTransport?.attachment)
      : [];
    const attachment =
      attachmentToJson && attachmentToJson.length !== 0
        ? attachmentToJson.map((item: any) => {
            return {
              id: rowId,
              orderId: item?.TransportCode,
              customerName: item?.CustomerName,
              customerId: null,
            };
          })
        : [];

    form.reset(
      {
        ...dataTransport,
        toStoreId: toStoreIdArr,
        attachment: attachment ?? [],
      } ?? {}
    );
    setValueRadio(Number(dataTransport?.transportForm));
  }, [dataTransport]);

  useEffect(() => {
    setStoreOptions(storeList);
  }, [storeList]);

  useEffect(() => {
    setCustomerOption(customerProductDropList);
  }, [customerProductDropList]);

  useEffect(() => {
    if (form.watch('transportForm') === 3) {
      form.setValue('transportId', null);
      form.setValue('transportName', null);
      form.setValue('transportPhoneNumber', null);
    }
  }, [form.watch('transportForm')]);

  useEffect(() => {
    let select: any[] = [];
    fields.forEach((item, index) => {
      const valWatch = form.watch(`toStoreId.${index}.storeId`);
      select.push(valWatch);
    });
  }, [fields]);

  const onClickAdd = () => {
    append({ storeId: null });
  };

  const handleDeleteField = async (id: number) => {
    removeTransfers(id);
  };

  const fetchCustomerDropProduct = async () => {
    try {
      await dispatch(getListCustomer({ searchText: '' }));
    } catch (error) {
    } finally {
    }
  };

  const fetchListStore = async () => {
    try {
      await dispatch(getListStore({}));
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchCustomerDropProduct();
    fetchListStore();
  }, []);

  const handleClickAddOrders = () => {
    const rowId = nanoid();
    const idOrder = form.watch('idOrder');
    const customerNameOrders = form.watch('customerNameOrders');

    if (idOrder && !customerNameOrders) {
      const customer = customerOption.find((item) => item?.code === idOrder);
      appendTransfers({
        id: customer?.id,
        code: customer?.code,
        customerName: customer?.name,
      });
    } else {
      const customer = customerOption.find(
        (item) => item?.id === customerNameOrders
      );
      appendTransfers({
        id: customer?.id,
        code: customer?.code,
        customerName: customer?.name,
      });
    }
    form.setValue('idOrder', '');
    form.setValue('customerNameOrders', null);
  };

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
    handleDeleteField,
  });

  useEffect(() => {
    if (
      form.watch('isWarehouseTransfer') &&
      form.watch('toStoreId').length === 0
    ) {
      append({ storeId: null });
    }
    if (!form.watch('isWarehouseTransfer')) {
      remove();
    }
  }, [form.watch('isWarehouseTransfer')]);

  const handleChangeRadio = (event: any) => {
    setValueRadio(Number(event?.target?.value));
  };

  const handleSelectCustomerTransport = (value: string | null) => {
    setValTransport((state) => ({ ...state, customerNameOrders: value }));
  };

  const handleChangeIdOrder = (value: string | null) => {
    setValTransport((state) => ({ ...state, idOrder: value }));
  };

  const handleSubmit = async (values: any) => {
    if (!id) {
      setNotification({
        error: 'Lỗi không tìm thấy ID đơn vận chuyển!',
      });
      return;
    }

    const toStoreId =
      values?.isWarehouseTransfer && values?.toStoreId.length !== 0
        ? values?.toStoreId.map((item: any) => item.storeId)
        : [];
    const attachment =
      values?.attachment.length !== 0
        ? values?.attachment.map((item: any) => ({
            transportCode: item?.orderId,
            customerName: item?.customerName,
          }))
        : [];

    const params = {
      toStoreId: toStoreId,
      customerId: values?.customerId,
      isWarehouseTransfer: values?.isWarehouseTransfer,
      transportForm: valueRadio,
      status: Number(dataTransport?.status),
      transportId: values?.transportId,
      transportName: values?.transportName,
      transportPhoneNumber: values?.transportPhoneNumber,
      carrierWay: values?.carrierWay,
      attachment: attachment,
      note: values?.note,
    };

    console.log('params', params);

    await APIUpdateTransport(id, params)
      .then((res) => {
        if (res.success) {
          setNotification({
            message: 'Cập nhật đơn vận chuyển thành công',
            severity: 'success',
          });
          navigate('/sales/order-transport');
        }
      })
      .catch(() => {
        setNotification({
          error: 'Lỗi khi cập nhật đơn vận chuyển!',
        });
      });
  };

  return (
    <PageWrapper title={t('Cập nhật')}>
      <PageBreadcrumbs
        title={t('Cập nhật')}
        items={[
          { link: '/sales', text: 'Bán hàng' },
          { link: '/sales/order-transport', text: 'Đơn vận chuyển' },
        ]}
      />
      <ProForm form={form} onFinish={handleSubmit}>
        <ProFormContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Paper sx={{ p: 2, pb: 5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    mb: 1,
                  }}
                >
                  <Stack sx={{ alignItems: 'center' }}>
                    <ErrorOutlineIcon />
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {'Thông tin'}
                    </Typography>
                  </Stack>
                </Box>
                <Divider />
                <Grid container spacing={2} sx={{ mt: 2 }} alignItems="center">
                  <Grid item xs={12} sm={6} lg={6}>
                    <ProFormLabel name="fromStoreId" title="Cửa hàng" />
                    <ProFormAutocomplete
                      name="fromStoreId"
                      disabled
                      placeholder={t('Cửa hàng')}
                      options={storeList}
                      renderLabel={(option) => option?.name}
                      renderValue={(option) => option?.id}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <ProFormLabel name="customerId" title="Khách hàng" />
                    <ProFormAutocomplete
                      name="customerId"
                      disabled={dataTransport?.isAuto ?? false}
                      options={customerProductDropList}
                      renderLabel={(option) => option?.name}
                      renderValue={(option) => option?.id}
                      placeholder="Khách hàng"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={1}>
                    <ProFormLabel
                      name="isWarehouseTransfer"
                      title="Chuyển kho"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={11}>
                    <ProFormCheckbox
                      size="medium"
                      name="isWarehouseTransfer"
                      color="info"
                    />
                  </Grid>
                  {form.watch('isWarehouseTransfer') ? (
                    <>
                      {fields?.map((item, index) => {
                        return (
                          <Fragment key={item.id}>
                            <Grid item xs={12} sm={6} md={8} lg={10}>
                              <ProFormAutocomplete
                                name={`toStoreId.${index}.storeId`}
                                options={storeOptions}
                                renderLabel={(option) => option?.name}
                                renderValue={(option) => option?.id}
                                placeholder="Cửa hàng"
                              />
                            </Grid>

                            <Grid item xs={2} sm={2} md={1.5} lg={1}>
                              {fields?.length > 1 && (
                                <IconButton
                                  onClick={() => {
                                    remove(index);
                                  }}
                                >
                                  <RemoveCircleIcon
                                    sx={{ color: '#912A24', fontSize: 28 }}
                                  />
                                </IconButton>
                              )}
                              {fields?.length === index + 1 ? (
                                <IconButton onClick={onClickAdd}>
                                  <AddCircleIcon
                                    sx={{ color: '#249142', fontSize: 28 }}
                                  />
                                </IconButton>
                              ) : null}
                            </Grid>
                          </Fragment>
                        );
                      })}
                    </>
                  ) : null}

                  <Grid item xs={12} sm={12} lg={12}>
                    <ProFormLabel
                      name="transportForm"
                      title="Đơn vị giao vận"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={12} container>
                    <FormControl sx={{ width: '100%' }}>
                      <RadioGroup
                        name="transportForm"
                        value={valueRadio}
                        onChange={handleChangeRadio}
                        sx={{ width: '100%' }}
                      >
                        <Grid container spacing={1} item xs={12}>
                          <Grid item xs={12} sm={12} lg={12}>
                            <FormControlLabel
                              value={2}
                              control={<Radio />}
                              label="Giao vận qua nhà xe"
                            />
                          </Grid>
                          {valueRadio === 2 && (
                            <Grid
                              container
                              spacing={2}
                              item
                              xs={12}
                              sm={12}
                              lg={12}
                            >
                              <Fragment>
                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                  <ProFormLabel
                                    name="transportId"
                                    title="Đơn vị vận chuyển"
                                    required
                                  />
                                  <ProFormAutocomplete
                                    name="transportId"
                                    options={[
                                      {
                                        id: '00000000-0000-0000-0000-000000000000',
                                        name: 'Đơn vị vận chuyển mặc định',
                                      },
                                    ]}
                                    renderLabel={(option) => option?.name}
                                    renderValue={(option) => option?.id}
                                    placeholder="Đơn vị vận chuyển"
                                  />
                                </Grid>
                                <Grid item xs={0} sm={1} md={1} lg={6}></Grid>
                                <Grid item xs={12} sm={7} md={9} lg={6}>
                                  <ProFormLabel
                                    name="transportName"
                                    title="Tên đơn vị vận chuyển"
                                    required
                                  />
                                  <ProFormTextFiedTrim
                                    name="transportName"
                                    placeholder="Tên đơn vị vận chuyển"
                                  />
                                </Grid>
                                <Grid item xs={12} sm={7} md={9} lg={6}>
                                  <ProFormLabel
                                    name="transportPhoneNumber"
                                    title="Số điện thoại"
                                    required
                                  />
                                  <ProFormTextFiedTrim
                                    name="transportPhoneNumber"
                                    placeholder="Số điện thoại"
                                  />
                                </Grid>
                              </Fragment>
                            </Grid>
                          )}
                          <Grid item xs={12} sm={12} lg={12}>
                            <FormControlLabel
                              value={3}
                              control={<Radio />}
                              label="Giao vận qua hãng vận chuyển"
                            />
                          </Grid>
                          {valueRadio === 3 && (
                            <Grid
                              container
                              spacing={2}
                              item
                              xs={12}
                              sm={12}
                              lg={12}
                            >
                              <Grid item xs={12} sm={12} lg={12}>
                                <Box sx={{ pl: 4 }}>
                                  <FormRadioGroup
                                    name="carrierWay"
                                    options={[
                                      { value: 0, label: 'Viettel Post' },
                                      { value: 1, label: 'GHTK' },
                                    ]}
                                  />
                                </Box>
                              </Grid>
                            </Grid>
                          )}
                          <Grid item xs={12} sm={12} lg={12}>
                            <FormControlLabel
                              value={4}
                              control={<Radio />}
                              label="Nhân viên giao hàng"
                            />
                          </Grid>
                        </Grid>
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={12} lg={12}>
                    <ProFormTextFiedTrim
                      name="note"
                      multiline
                      rows={4}
                      // InputProps={{
                      //   startAdornment: (
                      //     <InputAdornment position="start">
                      //       <EventNoteIcon />
                      //     </InputAdornment>
                      //   ),
                      // }}
                      placeholder="Ghi chú"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={12}>
                    <ProFormLabel
                      name="addOrderTransport"
                      title="Thêm đơn vận chuyển"
                    />
                  </Grid>

                  <Grid item xs={12} sm={4} lg={3}>
                    <ProFormTextFiedTrim
                      name="idOrder"
                      placeholder="ID đơn vận chuyển"
                      onChangeInput={handleChangeIdOrder}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} lg={3}>
                    <ProFormAutocomplete
                      name="customerNameOrders"
                      options={customerProductDropList}
                      renderLabel={(option) =>
                        `${option?.name} - ${option?.code}`
                      }
                      renderValue={(option) => option?.id}
                      placeholder="Khách hàng"
                      onSelect={handleSelectCustomerTransport}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} lg={4}>
                    <ActionButton
                      disabled={
                        !valTransport.idOrder &&
                        !valTransport.customerNameOrders
                      }
                      actionType="add"
                      color="info"
                      onClick={handleClickAddOrders}
                    >
                      Thêm
                    </ActionButton>
                  </Grid>
                </Grid>
                <div style={{ display: fieldsTransfers.length ? '' : 'none' }}>
                  <Box sx={{ height: '35vh' }}>
                    <ProTable<TableCreateOrder>
                      loading={loading}
                      ref={tableRef}
                      columns={columns}
                      data={fieldsTransfers}
                      refetch={refetch}
                      getRowId={(row) => row?.id ?? ''}
                      initialstate={{
                        hiddenColumns: [],
                        hiddenVisibilityColumns: true,
                      }}
                      form={form}
                    />
                  </Box>
                </div>
                <Stack spacing={2} mt={2} justifyContent={'flex-end'}>
                  <Button
                    variant="outlined"
                    startIcon={<ClearIcon />}
                    onClick={() => navigate('/sales/order-transport')}
                  >
                    Hủy
                  </Button>
                  <LoadingButton type="submit" startIcon={<SaveIcon />}>
                    Lưu
                  </LoadingButton>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </ProFormContent>
      </ProForm>
    </PageWrapper>
  );
};

export default UpdateTransport;
