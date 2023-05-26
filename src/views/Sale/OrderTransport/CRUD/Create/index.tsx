import { yupResolver } from '@hookform/resolvers/yup';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Grid,
  InputAdornment,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import ProFormAutocomplete from 'components/ProForm/Label/ProFormAutocomplete';
import ProFormTextFiedTrim from 'components/ProForm/Label/ProFormTextFiedTrim';
import ProFormCheckbox from 'components/ProForm/ProFormCheckbox';
import ProFormContent from 'components/ProForm/ProFormContent';
import ProFormLabel from 'components/ProForm/ProFormLabel';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { schema } from './utils/schema';
import { TableCreateOrder, CreateOrderTransport } from './utils/type';
import { nanoid } from '@reduxjs/toolkit';
import { TableRef } from 'components/ProTable/types/refs';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import useTableColumns from './TableColumns';
import { createTransport, getCustomerListAll, getListCustomer, getStoreList } from 'slices/saleOrderTransport';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerProductDropListStore, getListCustomerProductDrop } from 'slices/billCustomerApplicationSlice';
import { AppDispatch } from 'store';
import { getListStore } from 'slices/saleOrderTransport';
import { useNavigate } from 'react-router-dom';
import useNotification from 'hooks/useNotification';

const customerOptions = [
  {
    id: '0',
    value: 'Khách hàng 1',
  },
  {
    id: '1',
    value: 'Khách hàng 2',
  },
  {
    id: '2',
    value: 'Khách hàng 3',
  },
];

const Create = () => {
  const { t } = useTranslation();

  const form = useForm<CreateOrderTransport>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const storeList = useSelector(getStoreList);
  const customerProductDropList = useSelector(getCustomerListAll);
  const watchIsWarehouseTransfer = form.watch('isWarehouseTransfer');

  const tableRef = useRef<TableRef>(null);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'toStoreId',
  });

  const {
    fields: fieldsTransfers,
    append: appendTransfers,
    remove: removeTransfers,
  } = useFieldArray({
    control: form.control,
    name: 'attachment',
    keyName: 'rowId',
  });

  const [selectedValue, setSelectedValue] = useState<number>(2);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters] = useState<any>({
    pageNumber: 1,
    pageSize: 25,
  });
  const [, refetch] = useRefresh();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const setNotification = useNotification();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(Number(event.target.value));
  };

  const handleSubmit = async (values: any) => {
    const { toStoreId,
      fromStoreId,
      customerId,
      isWarehouseTransfer,
      transportForm,
      transportId,
      transportName,
      transportPhoneNumber,
      carrierWay,
      note,
      attachment,
      ...rest } = values;
    const arrStr = toStoreId.map((obj: any) => obj.storeId);
    const newAttachment = attachment.map((item: any) => {
      const { customerId, id, customerName, orderId } = item;
      const newAttachments = {
        customerName,
        transportCode: orderId
      }
      return newAttachments;
    });

    const updatedParams = {
      fromStoreId,
      toStoreId: arrStr,
      customerId,
      isWarehouseTransfer,
      isCOD: false,
      totalAmount: 0,
      transportForm,
      status: 0,
      transportId,
      transportName,
      transportPhoneNumber,
      carrierWay,
      attachment: newAttachment,
      note
    }
    try {
      setLoading(true);
      const response = await dispatch(
        createTransport({
          ...updatedParams,
        })
      );

      // @ts-ignore
      if (response.payload.httpStatusCode === 200) {
        setNotification({
          message: 'Tạo mới đơn vận chuyển thành công',
          severity: 'success',
        });
        navigate('/sales/order-transport');
      } else {
        setNotification({
          error: 'Lỗi khi tạo mới đơn vận chuyển!',
        });
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onChangeCheckbox();
  }, [watchIsWarehouseTransfer]);

  const onChangeCheckbox = () => {
    if (watchIsWarehouseTransfer) {
      append({ storeId: null });
    } else {
      remove();
    }
  };

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
    const value = form.watch('customerNameOrders');
    const idOrder = form.watch('idOrder');
    const rowId = nanoid();

    const data = [{
      id: null,
      code: null,
      name: "",
      phone: "",
      value: ""
    }]

    let selected = customerProductDropList.filter((item: any) => item.id === value);
    var rows: TableCreateOrder[] = [];
    if (selected.length > 0) {
      rows = selected.reduce(
        (acc: TableCreateOrder[], item) => {
          acc.push({
            id: rowId,
            orderId: idOrder,
            customerName: item.name,
            customerId: item.id,
          });
          return acc;
        },
        []
      );
    } else {
      rows = data.reduce(
        (acc: TableCreateOrder[], item) => {
          acc.push({
            id: rowId,
            orderId: idOrder,
            customerName: item.name,
            customerId: item.id,
          });
          return acc;
        },
        []
      );
    }

    appendTransfers(rows, { shouldFocus: false });
    tableRef.current?.startRowEditMode(rowId);
    form.setValue('customerNameOrders', null);
    form.setValue('idOrder', '');
  };

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
    handleDeleteField,
  });

  const handleClose = () => {
    navigate('/sales/order-transport')
  };

  // const [selectedData, setSelectedData] = useState<any>([])


  var selectedData: any = []
  const handleSelect = (e: any) => {
    console.log('e', e);

    selectedData.push(e)
  }

  console.log('selectedData', selectedData);


  return (
    <PageWrapper title={t('Tạo mới đơn vị vận chuyển')}>
      <PageBreadcrumbs
        title={t('Tạo mới đơn vị vận chuyển')}
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
                      {'Khai báo đơn vị vận chuyển'}
                    </Typography>
                  </Stack>
                </Box>
                <Divider />
                <Grid container spacing={2} sx={{ mt: 2 }} alignItems="center">
                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormLabel
                      name="fromStoreId"
                      title="Cửa hàng"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormLabel
                      name="customerId"
                      title="Khách hàng"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormAutocomplete
                      name="fromStoreId"
                      placeholder={t('Cửa hàng')}
                      options={storeList}
                      renderLabel={(option) => option?.name}
                      renderValue={(option) => option?.id}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormAutocomplete
                      name="customerId"
                      options={customerProductDropList}
                      renderLabel={(option) => option?.name}
                      renderValue={(option) => option?.id}
                      placeholder="Khách hàng"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ mt: 2 }} alignItems="center">

                  <Grid item xs={0.5} sm={0.5} lg={0.2}>
                    <ProFormCheckbox
                      size="medium"
                      name="isWarehouseTransfer"
                      color="success"
                    />
                  </Grid>
                  <Grid item xs={11.5} sm={11.5} lg={11.8}>
                    <ProFormLabel
                      name="isWarehouseTransfer"
                      title="Chuyển kho"
                    />
                  </Grid>
                  {fields?.map((item: any, index: any) => {

                    console.log('item', item);

                    const previousStoreIds: any = [];
                    for (let i = 0; i <= index; i++) {
                      previousStoreIds.push(`toStoreId.${i}.storeId`);
                    }
                    const storeFilter = storeList
                      .filter((item: any) => item.id !== form.watch('fromStoreId'))

                    // console.log('storeFilter', storeFilter);
                    console.log('previousStoreIds', previousStoreIds);


                    var lastStoreFilter: any = []
                    for (let t = 0; t <= previousStoreIds.length; t++) {
                      console.log('form', form.watch(`toStoreId.${t}.storeId`));

                      lastStoreFilter = storeFilter.filter((item: any) => item.id !== form.watch(`toStoreId.${t}.storeId`))
                    }


                    console.log('lastStoreFilter', lastStoreFilter);


                    return (
                      <Fragment key={item.id}>
                        {/* <Grid item xs={12} sm={2} md={1} lg={1}>
                          <ProFormLabel
                            name={`toStoreId.${index}.storeId`}
                            title="Cửa hàng"
                            required
                          />
                        </Grid> */}
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <ProFormAutocomplete
                            name={`toStoreId.${index}.storeId`}
                            options={lastStoreFilter}
                            renderLabel={(option) => option?.name}
                            renderValue={(option) => option?.id}
                            placeholder="Cửa hàng"
                            onSelect={handleSelect}
                          />
                        </Grid>
                        {fields?.length > 1 && (
                          <Grid item xs={0.5} sm={0.5} md={0.5} lg={0.5}>
                            <RemoveCircleIcon onClick={() => remove(index)} sx={{ cursor: 'pointer', color: '#AB1D1D' }} fontSize="large" />
                          </Grid>
                        )}

                        {fields?.length === index + 1 ? (
                          <Grid item xs={0.5} sm={0.5} md={0.5} lg={0.5}>
                            <AddCircleIcon onClick={onClickAdd} sx={{ cursor: 'pointer' }} color='success' fontSize="large" />
                          </Grid>
                        ) : (
                          <Grid item xs={2} sm={1} md={1.5} lg={0.5}></Grid>
                        )}
                      </Fragment>
                    );
                  })}
                  <Grid item xs={12} sm={12} lg={12}>
                    <ProFormLabel
                      name="transportForm"
                      title="Đơn vị giao vận"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={12}>
                    <FormControlLabel
                      value="2"
                      control={
                        <Radio
                          checked={selectedValue === 2}
                          onChange={handleChange}
                          value="2"
                          name="radio-buttons"
                          inputProps={{ 'aria-label': 'A' }}
                        />
                      }
                      label="Giao vận qua nhà xe"
                    />
                  </Grid>
                  {selectedValue === 2 && (
                    <Fragment>
                      <Grid container spacing={2} sx={{ mx: 0.5 }} alignItems="center">
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                          <ProFormLabel
                            name="transportId"
                            title="Đơn vị vận chuyển"
                            required
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={6} sm={6} md={9} lg={6}>
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

                      <Grid container sx={{ ml: 2, mt: 2 }} alignItems="center">
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <ProFormLabel
                            name="transportName"
                            title="Tên đơn vị vận chuyển"
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <ProFormLabel
                            name="transportPhoneNumber"
                            title="Số điện thoại"
                            required
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} sx={{ ml: 0.1 }} alignItems="center">
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <ProFormTextFiedTrim
                            name="transportName"
                            placeholder="Tên đơn vị vận chuyển"
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <ProFormTextFiedTrim
                            name="transportPhoneNumber"
                            placeholder="Số điện thoại"
                          />
                        </Grid>
                      </Grid>


                    </Fragment>
                  )}

                  <Grid item xs={12} sm={12} lg={12}>
                    <FormControlLabel
                      value="3"
                      control={
                        <Radio
                          checked={selectedValue === 3}
                          onChange={handleChange}
                          value="3"
                          name="radio-buttons"
                          inputProps={{ 'aria-label': 'A' }}
                          aria-label="Giao vận qua hãng vận chuyển"
                        />
                      }
                      label="Giao vận qua hãng vận chuyển"
                    />
                  </Grid>
                  {selectedValue === 3 && (
                    <Grid item xs={12} sm={12} lg={12}>
                      <Box sx={{ marginLeft: '38px' }}>
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          defaultValue="0"
                          name="carrierWay"
                          onChange={(e) =>
                            form.setValue('carrierWay', Number(e.target.value))
                          }
                        >
                          <FormControlLabel
                            value="0"
                            control={<Radio />}
                            label="Viettel Post"
                          />
                          <FormControlLabel
                            value="1"
                            control={<Radio />}
                            label="GHTK"
                          />
                        </RadioGroup>
                      </Box>
                    </Grid>
                  )}
                  {/* <Grid item xs={12} sm={1} lg={1}>
                    <ProFormLabel name="note" title="Ghi chú" />
                  </Grid> */}
                  <Grid item xs={12} sm={12} lg={12}>
                    <ProFormTextFiedTrim
                      name="note"
                      placeholder='Ghi chú'
                      multiline
                      rows={4}
                    // InputProps={{
                    //   startAdornment: (
                    //     <InputAdornment position="start">
                    //       <EventNoteIcon />
                    //     </InputAdornment>
                    //   ),
                    // }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={12}>
                    <ProFormLabel
                      name="addOrderTransport"
                      title="Thêm đơn vận chuyển"
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} lg={2}>
                    <ProFormTextFiedTrim
                      name="idOrder"
                      placeholder="ID đơn vận chuyển"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={2}>
                    <ProFormAutocomplete
                      name="customerNameOrders"
                      options={customerProductDropList}
                      renderLabel={(option) => option?.value}
                      renderValue={(option) => option?.id}
                      placeholder="Khách hàng"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={8}>
                    <ActionButton
                      actionType="add"
                      color="info"
                      onClick={handleClickAddOrders}
                      disabled={(form.watch('idOrder') || form.watch('customerNameOrders')) ? false : true}
                    >
                      Thêm
                    </ActionButton>
                  </Grid>
                </Grid>
                <div style={{ display: fieldsTransfers.length ? '' : 'none' }}>
                  <Box>
                    <ProTable<TableCreateOrder>
                      loading={loading}
                      ref={tableRef}
                      columns={columns}
                      data={fieldsTransfers}
                      refetch={refetch}
                      getRowId={(row) => row.id}
                      initialstate={{
                        hiddenColumns: [],
                        hiddenVisibilityColumns: true,
                      }}
                      form={form}
                    />
                  </Box>
                </div>
                <Stack spacing={2} mt={2} display="flex" justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    startIcon={<CloseIcon />}
                    onClick={handleClose}
                  >
                    {'Hủy'}
                  </Button>
                  <ActionButton
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

      </ProForm >
    </PageWrapper >
  );
};

export default Create;
