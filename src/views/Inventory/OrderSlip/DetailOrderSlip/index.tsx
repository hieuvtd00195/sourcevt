import { yupResolver } from '@hookform/resolvers/yup';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  Box,
  TextField,
} from '@mui/material';

import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import { isEmpty } from 'lodash';
import ProFormAutocomplete from 'components/ProTable/core/EditableCell/ProFormMultiAutocomplete';
import ProFormContent from 'components/ProForm/ProFormContent';
import ProFormDate from 'components/ProTable/core/EditableCell/ProFormDate';
import ProFormSelect from 'components/ProForm/ProFormSelect';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import { PriceInput } from 'plugins/NumberFormat';
import { useForm, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  APIAddSaleOrder,
  APIGetProduct,
  APIGetStore,
  APIGetSupplier,
} from 'services/saleOrder';
import Validation from 'utils/Validation';
import * as yup from 'yup';
import {
  Accumulator,
  AddOrder,
  DataAddOrder,
  IProduct,
  IResponseStore,
  IResponseSupplier,
  IStore,
  ISupplier,
  TableCreateOrder,
  TableDetailOrder,
} from './utils/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TableRef } from 'components/ProTable/types/refs';
import { nanoid, unwrapResult } from '@reduxjs/toolkit';
import ProTable from 'components/ProTable';
import TypedObject from 'utils/TypedObject';
import useTableColumns from './ProductTable/TableColumns';
import useRefresh from 'hooks/useRefresh';
import useNotification from 'hooks/useNotification';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store';
import { GetSaleOrderByIdApi } from 'slices/saleOrder';

const DetailOrderSlip = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const form = useForm<TableDetailOrder<TableCreateOrder>>({
    mode: 'onChange',
    defaultValues: {
      form: [],
    },
  });
  const tableRef = useRef<TableRef>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [productListOption, setProductListOption] = useState<IProduct[]>([]);
  const [storeListOption, setStoreListOption] = useState<IStore[]>([]);
  const [supplierListOption, setSupplierListOption] = useState<ISupplier[]>([]);
  const [, refetch] = useRefresh();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<string[]>([]);
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
  const navigate = useNavigate();

  const handleOpenDialog = (value: any) => {
    // setDataSelected(value);
    // setOpenDialogActionProduct(!openDialogActionProduct);
  };
  const handleUpdateRow = useCallback(
    (rowIndex: number, rowId: string) => async () => {
      //   debugger;
      //   const isValid = await form.trigger(`form.${rowIndex}`);
      //   if (!isValid) return;
      //   const row = form.getValues(`form.${rowIndex}`);
      //   update(rowIndex, row);
      //   tableRef.current?.stopRowEditMode(rowId);
    },
    [form, update]
  );
  const handleRemoveRow = useCallback(
    (rowIndex: number, rowId: string) => () => {
      //   remove(rowIndex);
      //   tableRef.current?.stopRowEditMode(rowId);
      //   setDisabled((state) => state.filter((item) => item !== rowId));
    },
    [remove]
  );
  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
    handleOpenDialog,
    onUpdate: handleUpdateRow,
    onDelete: handleRemoveRow,
  });

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
    if (!id) {
      return;
    }
    try {
      setLoading(true);
      const responseSOD = await dispatch(GetSaleOrderByIdApi(id));
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

      const tableValues = response.saleOrderLineDetailDtos.map(
        (_item, index) => ({
          id: _item.id,
          productId: _item.productId,
          requestQuantity: _item.requestQuantity,
          requestPrice: _item.requestPrice,
          suggestedPrice: _item.suggestedPrice,
          importQuantity: _item.importQuantity,
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
  }, [dispatch, form, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData, id]);

  return (
    <PageWrapper title="Chi tiết phiếu thu chi">
      <PageBreadcrumbs
        title="Chi tiết phiếu thu chi"
        items={[
          { link: '/inventory', text: 'Kho hàng' },
          { link: '/inventory/order-slip', text: 'Phiếu đặt hàng' },
        ]}
      />
      <ProForm form={form}>
        <ProFormContent sx={{ mb: 4 }}>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, pb: 5 }}>
                <Stack mb={1.5}>
                  <ErrorOutlineIcon />
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {t('Thông tin cơ bản')}
                  </Typography>
                </Stack>
                <Divider />
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={12} lg={6}>
                    <TextField
                      disabled
                      value="Nhập kho"
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
                      name="code"
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
                      disabled
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormDate
                      name="orderDate"
                      type="start"
                      validate={Validation.date()}
                      disabled
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
                      disabled
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

                  <Grid item xs={12} sm={12} lg={12}>
                    <ProFormTextField
                      name="note"
                      placeholder="Ghi chú"
                      multiline
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
                      disabled
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} ml={2} mr={2}>
              <Grid container spacing={2}>
                <Grid item xs={2} sm={2} md={2} lg={2}>
                  <TextField
                    disabled
                    value="Sản phẩm"
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
                <Grid item xs={10} sm={10} md={10} lg={10}>
                  <ProFormAutocomplete
                    disabled
                    name="productId"
                    options={productListOption}
                    renderValue={(item) => item.id}
                    renderLabel={(item) => `${item.code} - ${item.name}`}
                    placeholder={'Tên sản phẩm'}
                    // onSelect={onSelect}
                    validate={Validation.selectAutocompleteMulti()}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 1, pb: 5 }}>
                <Box sx={{ gridArea: 'mid', height: 'auto', padding: '8px' }}>
                  <Box sx={{ height: '35vh' }}>
                    <ProTable<TableCreateOrder>
                      loading={loading}
                      ref={tableRef}
                      columns={columns}
                      data={fields}
                      //   onRowEditableChange={handleRowEditableChange}
                      initialstate={{
                        hiddenColumns: [],
                        hiddenVisibilityColumns: true,
                      }}
                      getRowId={(row) => row.id}
                      form={form}
                      editable
                    />
                  </Box>
                </Box>
             
              </Paper>
            </Grid>
          </Grid>
        </ProFormContent>
      </ProForm>
    </PageWrapper>
  );
};

export default DetailOrderSlip;
