import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DialogTitle from '@mui/material/DialogTitle';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  IProduct,
  IResponseStore,
  IResponseSupplier,
  IStore,
  ISupplier,
  TableCreateOrder,
  TableDetailOrder,
} from '../DetailOrderSlip/utils/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TableRef } from 'components/ProTable/types/refs';
import useNotification from 'hooks/useNotification';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import useTableColumns from './TableColumns';
import { APIGetProduct, APIGetStore, APIGetSupplier } from 'services/saleOrder';
import {
  GetSaleOrderByIdApi,
  GetSaleOrderConfirmByIdApi,
  conFirmSaleOrderApi,
  getSaleOrderConfirmbyId,
} from 'slices/saleOrder';
import { unwrapResult } from '@reduxjs/toolkit';
import ProForm from 'components/ProForm';
import ProFormContent from 'components/ProForm/ProFormContent';
import { Box, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import { PriceInput } from 'plugins/NumberFormat';
import ProFormSelect from 'components/ProForm/ProFormSelect';
import ProFormDate from 'components/ProTable/core/EditableCell/ProFormDate';
import { useTranslation } from 'react-i18next';
import Validation from 'utils/Validation';
import ProFormAutocomplete from 'components/ProTable/core/EditableCell/ProFormMultiAutocomplete';
import ProTable from 'components/ProTable';
import React from 'react';
import Numeral from 'utils/Numeral';
import useRefresh from 'hooks/useRefresh';
import TypedObject from 'utils/TypedObject';

type Props = {
  open: boolean;
  handleClose: () => void;
  idConfirm: any;
};

const FormConfirmOrderSlip = (props: Props) => {
  const { open, handleClose, idConfirm } = props;
  const tableRef = useRef<TableRef>(null);
  const form = useForm<TableDetailOrder<TableCreateOrder>>({
    mode: 'onChange',
    defaultValues: {
      form: [],
    },
  });
  const { t } = useTranslation();
  const [, refetch] = useRefresh();
  const saleOrderConfirmDetail = useSelector(getSaleOrderConfirmbyId);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('xxl');
  const [loading, setLoading] = useState<boolean>(false);
  const [productListOption, setProductListOption] = useState<IProduct[]>([]);
  const [storeListOption, setStoreListOption] = useState<IStore[]>([]);
  const [supplierListOption, setSupplierListOption] = useState<ISupplier[]>([]);
  const setNotification = useNotification();
  const dispatch = useDispatch<AppDispatch>();
  const [filters] = useState<any>({
    pageNumber: 1,
    pageSize: 25,
  });
  const { fields, append, update, replace, remove } = useFieldArray({
    control: form.control,
    name: 'form',
    keyName: 'rowId',
  });
  const handleUpdateRow = useCallback(
    (rowIndex: number, rowId: string) => async () => {
      const isValid = await form.trigger(`form.${rowIndex}`);
      if (!isValid) return;
      const row = form.getValues(`form.${rowIndex}`);
      update(rowIndex, row);
      tableRef.current?.stopRowEditMode(rowId);
    },
    [form, update]
  );

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
    open,
    handleClose,
    // handleOpenDialog,
    onUpdate: handleUpdateRow,
    // onDelete: handleRemoveRow,
  });
  const handleRowEditableChange = (
    rowEditableState: Record<string, boolean>
  ) => {
    const isEditing = TypedObject.isExist(rowEditableState);
    setIsEditing(isEditing);
    refetch();
  };
  useEffect(() => {
    Promise.all([APIGetProduct(), APIGetSupplier(), APIGetStore()])
      .then(([productRes, supplierRes, storeRes]) => {
        setProductListOption(productRes);
        setSupplierListOption(
          supplierRes.map((item: IResponseSupplier) => ({
            value: item.id,
            label: item.name,
          }))
        );
        setStoreListOption(
          storeRes.map((item: IResponseStore) => ({
            value: item.id,
            label: item.name,
          }))
        );
      })
      .catch((error) => console.error(error))
      .finally(() => {
        console.log('All API calls finished');
      });
  }, []);

  const fetchData = useCallback(async () => {
    if (!idConfirm) {
      return;
    }
    try {
      setLoading(true);
      const responseSOD = await dispatch(GetSaleOrderConfirmByIdApi(idConfirm));
      const response = unwrapResult(responseSOD);
      if (!response) {
        setNotification({
          error: 'Lỗi khi lấy dữ liệu!',
        });
      }
      const {
        invoiceNumber,
        supplierId,
        storeId,
        orderDate,
        note,
        rate,
        code,
        packageRes,
      } = response;

      const tableValues = response.detailProudcts.map(
        (_item: any, index: any) => ({
          id: _item.id,
          productId: _item.productId,
          requestQuantity: _item.requestQuantity,
          totalRequestVnd: _item.totalRequestVnd,
          unitPriceVnd: _item.unitPriceVnd,
          totalInputVnd: _item.totalInputVnd,
          requestPrice: _item.requestPrice,
          suggestedPrice: _item.suggestedPrice,
          importQuantity: _item.importQuantity,
          ratePrice: '0',
          priceImportVnd: '0',
          quantity: '0',
          TTtruoccuoc: '0',
          TTsaucuoc: '0',
          note: _item.note,
          code: _item.code,
          name: _item.productName,
        })
      ) as TableCreateOrder[];

      form.reset({
        code,
        invoiceNumber,
        supplierId,
        storeId,
        orderDate,
        note,
        rate: rate || 0,
        packageRes: packageRes || '0',
        form: tableValues,
      });
      tableValues.forEach((_item) => {
        tableRef.current?.startRowEditMode(_item.id);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, form, idConfirm]);

  useEffect(() => {
    fetchData();
  }, [fetchData, idConfirm,open]);

  const totalVNDTruocCuoc = () => {
    let tttruoccuoc = 0;
    const listDetail = form.watch('form');
    if (listDetail) {
      listDetail.forEach((item, index) => {
        tttruoccuoc += Number(item.TTtruoccuoc);
      });
    }

    return Numeral.price(tttruoccuoc);
  };
  const totalVNDSauCuoc = () => {
    let ttsaucuoc = 0;
    const listDetail = form.watch('form');
    if (listDetail) {
      listDetail.forEach((item, index) => {
        ttsaucuoc += Number(item.TTsaucuoc);
      });
    }
    return Numeral.price(ttsaucuoc);
  };

  const handleConFirm = async () => {
    const tableValues = form.watch('form').map((_item: any, index: any) => ({
      id: _item.id,
      quantity: Number(_item.quantity),
      ratePrice: Number(_item.ratePrice),
      note: _item.note,
    })) as any[];

    const body = {
      id: idConfirm,
      productDeatails: tableValues,
    };
    try {
      setLoading(true);
      console.log(body)
      const response = await dispatch(conFirmSaleOrderApi(body));
      if (response.payload === true) {
        setNotification({
          message: 'Xác nhận phiếu đặt hàng thành công',
          severity: 'success',
        });
      } else {
        setNotification({
          error: 'Lỗi khi Xác nhận phiếu đặt hàng!',
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        <DialogContent>
        <Paper sx={{ p: 1, pb: 5 }}>
          <Grid>
            <Typography
              style={{
                backgroundColor: '#FFFFFF',
                textAlign: 'center',
                height: 43,
                fontWeight: 500,
                fontSize: 16,
                padding: 8,
              }}
            >
              Xác nhận phiếu đặt hàng
            </Typography>
          </Grid>
          <ProForm form={form}>
            <ProFormContent sx={{ mb: 4 }}>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, pb: 5 }} style={{ borderRadius: 0 }}>
                    <Stack mb={1.5}>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        Thông tin cơ bản
                      </Typography>
                    </Stack>
                    <Divider />
                    <Grid
                      container
                      spacing={2}
                      sx={{ mt: 2, pl: 2, pr: 2, pb: 2 }}
                    >
                      <Grid item xs={12} sm={12} lg={6}>
                        <ProFormSelect
                          name="supplierId"
                          placeholder={t('Nhà cung cấp')}
                          options={supplierListOption}
                          renderLabel={(option) => option.label}
                          renderValue={(option) => option.value}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} lg={6}>
                        <ProFormSelect
                          name="storeId"
                          placeholder={t('Cửa hàng')}
                          options={storeListOption}
                          renderLabel={(option) => option.label}
                          renderValue={(option) => option.value}
                          disabled
                        />
                      </Grid>

                      <Grid item xs={12} sm={12} lg={6}>
                        <ProFormTextField
                          name="invoiceNumber"
                          placeholder="Số hóa đơn"
                          validate={Validation.stringRequired()}
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
                      <Grid item xs={12} sm={12} lg={6}>
                        <ProFormTextField
                          name="packageRes"
                          InputProps={{
                            inputComponent: PriceInput,
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

                      <Grid item xs={12} sm={12} lg={6}>
                        <ProFormTextField
                          name="note"
                          placeholder="Ghi chú"
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
                      <Grid item xs={12} sm={12} lg={6}>
                        <ProFormTextField
                          name="rate"
                          placeholder="Tỉ giá NDT - VND"
                          InputProps={{
                            inputComponent: PriceInput,
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
                          disabled
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper sx={{ p: 4, pb: 5 }} style={{ borderRadius: 0 }}>
                    <Box
                      sx={{ gridArea: 'mid', height: 'auto', padding: '8px' }}
                    >
                      <Box sx={{ height: '35vh' }}>
                        <ProTable<TableCreateOrder>
                          loading={loading}
                          ref={tableRef}
                          columns={columns}
                          data={fields}
                          initialstate={{
                            hiddenColumns: [],
                            hiddenVisibilityColumns: true,
                          }}
                          hideFooter
                          onRowEditableChange={handleRowEditableChange}
                          refetch={refetch}
                          getRowId={(row) => row.id}
                          form={form}
                          editable
                        />
                      </Box>
                    </Box>
                    {fields.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Stack
                          direction={'row'}
                          spacing={4}
                          alignItems={'center'}
                          justifyContent={'space-between'}
                          sx={{ p: 1 }}
                        >
                          <Typography fontWeight={'bold'} color={'primary'}>
                            Tổng tiền VND yêu cầu:{' '}
                            {Numeral.price(
                              saleOrderConfirmDetail.totalRequestVnd
                            )}
                          </Typography>
                          <Typography fontWeight={'bold'} color={'primary'}>
                            Tổng tiền VND đã nhập:{' '}
                            {Numeral.price(
                              saleOrderConfirmDetail.totalInputVnd
                            )}
                          </Typography>
                          <Typography fontWeight={'bold'} color={'primary'}>
                            Tổng tiền VND trước cước: {totalVNDTruocCuoc()}
                          </Typography>
                          <Typography fontWeight={'bold'} color={'primary'}>
                            Tổng tiền VND sau cước: {totalVNDSauCuoc()}
                          </Typography>
                        </Stack>
                        <Stack
                          direction={'row'}
                          spacing={1}
                          alignItems={'center'}
                          justifyContent={'flex-end'}
                          sx={{ p: 1 }}
                        >
                          {' '}
                          <Button variant="outlined" onClick={handleClose}>
                            Huỷ
                          </Button>
                          <Button onClick={handleConFirm}>Duyệt</Button>
                        </Stack>
                      </div>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </ProFormContent>
          </ProForm>
          </Paper>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions> */}
      </Dialog>
    </React.Fragment>
  );
};

export default FormConfirmOrderSlip;
