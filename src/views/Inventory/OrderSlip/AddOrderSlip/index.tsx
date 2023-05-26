import { yupResolver } from '@hookform/resolvers/yup';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Divider, Grid, Paper, Stack, Typography, Box, TextField, TableRow } from '@mui/material';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import { isEmpty } from 'lodash';
import ProFormContent from 'components/ProForm/ProFormContent';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import { useForm, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { APIAddSaleOrder, APIGetProduct, APIGetStore, APIGetSupplier, APIGetSupplierChina } from 'services/saleOrder';
import Validation from 'utils/Validation';
import * as yup from 'yup';
import { Accumulator, AddOrder, DataAddOrder, IProduct, IResponseStore, IResponseSupplier, IStore, ISupplier, TableCreateOrder } from './utils/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TableRef } from 'components/ProTable/types/refs';
import { nanoid } from '@reduxjs/toolkit';
import ProTable from 'components/ProTable';
import TypedObject from 'utils/TypedObject';
import useTableColumns from './ProductTable/TableColumns';
import useRefresh from 'hooks/useRefresh';
import useNotification from 'hooks/useNotification';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store';
import { CreateSaleOrderApi } from 'slices/saleOrder';
import ProFormMultiAutocomplete from 'components/ProTable/core/EditableCell/ProFormMultiAutocomplete';
import ProFormAutocomplete from 'components/ProTable/core/EditableCell/ProFormAutocomplete';
import ProFormDateEdit from 'components/ProTable/core/EditableCell/ProFormDateEdit';
import Regexs from 'utils/Regexs';
import { PriceInput } from 'plugins/NumberFormat';

const AddOrderTable = () => {
  const { t } = useTranslation();
  const form = useForm<DataAddOrder<TableCreateOrder>>({
    mode: 'onChange',
    defaultValues: {
      form: []
    },
  });

  const tableRef = useRef<TableRef>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [productListOption, setProductListOption] = useState<IProduct[]>([])
  const [storeListOption, setStoreListOption] = useState<IStore[]>([])
  const [supplierListOption, setSupplierListOption] = useState<ISupplier[]>([])
  const [, refetch] = useRefresh();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<string[]>([]);
  const setNotification = useNotification();
  const dispatch = useDispatch<AppDispatch>();

  const { fields, append, update, replace, remove } = useFieldArray({
    control: form.control,
    name: 'form',
    keyName: 'rowId',
  });

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      APIGetProduct(),
      APIGetSupplierChina(),
      APIGetStore()
    ])
      .then(([productRes, supplierRes, storeRes]) => {
        setProductListOption(productRes);
        setSupplierListOption(supplierRes.map((item: IResponseSupplier) => ({ value: item.id, label: item.name })));
        setStoreListOption(storeRes.map((item: IResponseStore) => ({ value: item.id, label: item.name })));
      })
      .catch(error => console.error(error))
      .finally(() => {
      });
  }, []);

  const onSubmit = async (data: DataAddOrder<TableCreateOrder>) => {
    const { form, rate, ...rest } = data;
    const saleOrderlines = form.map((item: TableCreateOrder) => ({
      productId: item.productId,
      requestQuantity: Number(item.requestQuantity),
      requestPrice: Number(item.requestPrice),
      suggestedPrice: Number(item.suggestedPrice),
    }));
    const updatedObject = { ...rest, saleOrderlines, rate: Number(rate) };
    delete updatedObject.productId;
    let newParams = {
      ...updatedObject,
      saleOrderlines,
    };

    try {
      setLoading(true);
      const response = await dispatch(CreateSaleOrderApi(newParams));
      if (!isEmpty(response.payload)) {
        setNotification({
          message: 'Tạo mới phiếu đặt hàng thành công',
          severity: 'success',
        });
        navigate('/inventory/order-slip');
      } else {
        setNotification({
          error: 'Lỗi khi tạo mới phiếu đặt hàng!',
        });
      }
    } catch (error) {
      console.log('error', error);

    } finally {
      setLoading(false);
    }
  };

  const onSelect = (value: string[] | null) => {
    let selected = productListOption.filter((item: any) => (value || []).includes(item.id));
    const rowId = nanoid();
    const rows: TableCreateOrder[] = selected.reduce((acc: TableCreateOrder[], product: IProduct) => {
      acc.push({
        id: rowId,
        productId: product.id,
        requestQuantity: null,
        requestPrice: null,
        suggestedPrice: null,
        rate: null,
        total: null,
        code: product.code,
        name: product.name
      });
      return acc;
    }, []);
    append(rows, { shouldFocus: false })
    tableRef.current?.startRowEditMode(rowId);
  };

  const [total] = useState<number>(0);
  const [filters] = useState<any>({
    pageNumber: 1,
    pageSize: 25,
  });
  const [openDialogActionProduct, setOpenDialogActionProduct] =
    useState<boolean>(false);
  const [dataSelected, setDataSelected] = useState<any>({});
  const handleOpenDialog = (value: any) => {
    setDataSelected(value);
    setOpenDialogActionProduct(!openDialogActionProduct);
  };

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

  const handleRemoveRow = useCallback(
    (rowIndex: number, rowId: string) => () => {
      remove(rowIndex);
      if (isEmpty(form.getValues('form'))) {
        form.reset({
          productId: undefined
        })
      }
      tableRef.current?.stopRowEditMode(rowId);
      setDisabled((state) => state.filter((item) => item !== rowId));
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

  const handleRowEditableChange = (
    rowEditableState: Record<string, boolean>
  ) => {
    const isEditing = TypedObject.isExist(rowEditableState);
    setIsEditing(isEditing);
    refetch();
  };

  return (
    <PageWrapper title="Thêm phiếu thu chi">
      <PageBreadcrumbs
        title="Tạo phiếu đặt hàng"
        items={[
          { link: '/inventory', text: 'Kho hàng' },
          { link: '/inventory/order-slip', text: 'Phiếu đặt hàng' },
        ]}
      />
      <ProForm form={form} onFinish={onSubmit}>
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
                  <Grid item xs={12} sm={12} lg={12}>
                    <TextField
                      value='Nhập kho'
                      disabled
                      sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "#000000"
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormAutocomplete
                      name="supplierId"
                      placeholder="Nhà cung cấp(*)"
                      options={supplierListOption}
                      renderValue={(item) => item.value}
                      renderLabel={(item) => item.label}
                      validate={Validation.selectString().required("Nhà cung cấp không được để trống")}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormAutocomplete
                      name="storeId"
                      options={storeListOption}
                      renderValue={(item) => item.value}
                      renderLabel={(item) => item.label}
                      placeholder={'Cửa hàng(*)'}
                      validate={Validation.selectString().required("Cửa hàng không được để trống")}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormTextField
                      name="invoiceNumber"
                      placeholder="Số hóa đơn(*)"
                      validate={Validation.stringRequired().required("Số hóa đơn không được để trống")}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormDateEdit
                      name="orderDate"
                      DatePickerProps={{ label: 'Ngày đặt hàng (*)', }}
                      validate={Validation.date().required("Ngày đặt hàng không được để trống")}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormTextField name="note" placeholder="Ghi chú" />
                  </Grid>

                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormTextField
                      name="rate"
                      placeholder="Tỉ giá NDT - VND(*)"
                      validate={Validation.pattern(Regexs.decimal3, 'Tỉ giá chỉ bao gồm hai số sau dấu phẩy, không bao gồm ký tự đặc biệt hoặc chữ cái').required('Tỉ giá không được để trống')}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 1, pb: 5 }}>
                <Box sx={{ gridArea: 'mid', height: 'auto', padding: '8px' }}>
                  <Grid container spacing={2} marginBottom={2}>
                    <Grid item xs={2} sm={2} md={2} lg={2}>
                      <TextField
                        value='Sản phẩm'
                        disabled
                        sx={{
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "#000000"
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={10} sm={10} md={10} lg={10}>
                      <ProFormMultiAutocomplete
                        name="productId"
                        options={productListOption}
                        renderValue={(item) => item.id}
                        renderLabel={(item) => `${item.code} - ${item.name}`}
                        placeholder={'Tên sản phẩm(*)'}
                        onSelect={onSelect}
                        validate={Validation.selectAutocompleteMulti().required("Cần ít nhất 1 sản phẩm để lưu phiếu đặt hàng")}
                      />
                    </Grid>
                  </Grid>
                  <Box>
                    <ProTable<TableCreateOrder>
                      loading={loading}
                      ref={tableRef}
                      columns={columns}
                      data={fields}
                      onRowEditableChange={handleRowEditableChange}
                      refetch={refetch}
                      getRowId={(row) => row.id}
                      initialstate={{
                        hiddenColumns: [],
                        hiddenVisibilityColumns: true,
                      }}
                      form={form}
                      editable
                    />
                  </Box>
                  <Stack spacing={2} sx={{ pt: 2 }}>
                    <ActionButton actionType="cancel" sx={{ background: 'white' }} onClick={() => navigate("/inventory/order-slip")}>
                      Hủy
                    </ActionButton>
                    <ActionButton
                      actionType="save"
                      variant="contained"
                      type="submit"
                    >
                      Lưu
                    </ActionButton>
                  </Stack>
                </Box>

              </Paper>
            </Grid>
          </Grid>
        </ProFormContent>
      </ProForm >
    </PageWrapper >
  );
};

export default AddOrderTable;
