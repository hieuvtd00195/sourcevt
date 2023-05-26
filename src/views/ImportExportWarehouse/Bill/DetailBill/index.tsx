import { yupResolver } from '@hookform/resolvers/yup';
import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import InfoIcon from '@mui/icons-material/Info';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import {
  Box,
  Button,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  TableRow,
  Typography,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import { nanoid, unwrapResult } from '@reduxjs/toolkit';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import ProFormSelect from 'components/ProForm/ProFormSelect';
import ProFormAutoCompleteDoubleFind from 'components/ProForm/ProFormAutoCompleteDoubleFind';
import ProFormAutocompleteSingal from 'components/ProForm/ProFormAutocompleteSingal';
import ProFormContent from 'components/ProForm/ProFormContent';
import ProFormDate from 'components/ProTable/core/EditableCell/ProFormDate';
import ProFormLabel from 'components/ProForm/ProFormLabel';
import ProFormRadio from 'components/ProForm/ProFormRadio';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import ProTable from 'components/ProTable';
import { TableRef } from 'components/ProTable/types/refs';
import {
  AUDIENCE_TYPE_KH,
  AUDIENCE_TYPE_KHAC,
  AUDIENCE_TYPE_NCCTQ,
  AUDIENCE_TYPE_NCCVN,
} from 'constants/enumAudienceType';
import useRefresh from 'hooks/useRefresh';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import {
  getListMasterData,
  getListMasterDataAudience,
  getListMasterDataPaymentAccount,
  getListMasterDataProducts,
  getMasterDataList,
  getMasterDataListAudience,
  getMasterDataListPaymentAccount,
  getMasterDataListProducts,
} from 'slices/masterData';
import { isEmpty } from 'lodash';

import {
  getListStoreApplication,
  getStoreApplicationList,
} from 'slices/storeApplication';
import { AppDispatch } from 'store';
import TypedObject from 'utils/TypedObject';
import Validation from 'utils/Validation';
import { IProduct } from 'views/Warehouse/CreateWarehouse/utils/types';
import {
  NumberInput,
  PriceDecimalInput,
  PriceInput,
  SaleInput,
} from '../../../../plugins/NumberFormat';
import AddNewSupplier from './AddNewSupplier';
import useTableColumns from './TableColumns';
import ProTableCell from 'components/ProTable/ProTableCell';
import Numeral from 'utils/Numeral';
import {
  CreateWareHousingApi,
  getWareHousingBillById,
  GetWareHousingBillByIdApi,
  UpdateWareHousingApi,
} from 'slices/warehousingslice';
import useNotification from 'hooks/useNotification';
import { useNavigate, useParams } from 'react-router-dom';

const schema = Validation.shape({
  isSearchByIMEI: Validation.select(0).optional(),
});

interface MasterDataList {
  [key: string]: any;
}
interface TableCreateProducts {
  [key: string]: any;
}
interface IImportExport<TableCreateProducts> {
  [key: string]: any;
}

const DetailBill = () => {
  const { id, billType } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const setNotification = useNotification();
  const navigate = useNavigate();
  const tableRef = useRef<TableRef>(null);
  const [, refetch] = useRefresh();

  const storeApplicationList = useSelector(getStoreApplicationList);
  const masterDataListAudience = useSelector(getMasterDataListAudience);
  const masterDataLisProducts = useSelector(getMasterDataListProducts);
  const masterDataLisPaymentAccount = useSelector(
    getMasterDataListPaymentAccount
  );
  const wareHousingBillById = useSelector(getWareHousingBillById);

  const masterDataList = useSelector(getMasterDataList);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [textValueSearch, setTextSearchValue] = useState('');

  const [oldValue, setOldValue] = useState<{
    audienceId: MasterDataList | undefined;
    numberPhone: MasterDataList | undefined;
  }>({
    audienceId: undefined,
    numberPhone: undefined,
  });
  const [filters] = useState<any>({
    pageNumber: 1,
    pageSize: 25,
  });
  const [textValueSearchProduct, setTextSearchValueProduct] = useState('');
  const form = useForm<IImportExport<TableCreateProducts>>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const { fields, append, update, replace, remove } = useFieldArray({
    control: form.control,
    name: 'form',
    keyName: 'rowId',
  });
  const unitType = form.watch('unitType');
  const getTypeImport = form.watch('audienceType');

  const handleSetValueToField = useCallback(
    (typeField: string) => async () => {
      if (typeField === 'quantityInput') {
        const valuePR = form.watch('quantityInput');
        form.watch('form').map((item: TableCreateProducts, index: any) => {
          const isValid = form.trigger(`form.${index}`);
          if (!isValid) return;
          const row = form.getValues(`form.${index}`);
          update(index, {
            ...row,
            quantity: valuePR,
          });
        });
      } else if (typeField === 'priceInput') {
        const valuePR = form.watch('priceInput');
        form.watch('form').map((item: TableCreateProducts, index: any) => {
          const isValid = form.trigger(`form.${index}`);
          if (!isValid) return;
          const row = form.getValues(`form.${index}`);
          update(index, {
            ...row,
            price: valuePR,
          });
        });
      } else if (typeField === 'saleValue') {
        const valuePR = form.watch('saleValue');
        form.watch('form').map((item: TableCreateProducts, index: any) => {
          const isValid = form.trigger(`form.${index}`);
          if (!isValid) return;
          const row = form.getValues(`form.${index}`);
          update(index, {
            ...row,
            discountAmount: valuePR,
          });
        });
      }
    },
    [form, update]
  );
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
    onUpdate: handleUpdateRow,
    onSetAllPrice: handleSetValueToField,
    setValue: form.setValue,
  });

  const handleSubmit = async (data: any) => {
    const {
      form,
      billDiscountType,
      billDiscountRate,
      billDiscountAmount,
      storeId,
      audienceType,
      audienceId,
      documentDetailType,
      note,
      vatType,
      vatRate,
      vatAmount,
      vatBillCode,
      vatBillDate,
      cashPaymentAccountCode,
      cashPaymentAmount,
      bankPaymentAccountCode,
      bankPaymentAmount,
      ...rest
    } = data;
    // const unitType = form.watch('unitType');
    const products = form.map((item: TableCreateProducts) => ({
      productId: item.productId,
      //   unit: item.unit ? Number(item.unit) : 0,
      quantity: Number(item.quantity),
      price: Number(item.price),
      discountType: getTypeImport === 0 || getTypeImport === 1 ? 0 : unitType,
      discountRate:
        (getTypeImport === 0 || getTypeImport === 1) && unitType === 0
          ? 0
          : Number(item.discountRate),
      discountAmount:
        (getTypeImport === 0 || getTypeImport === 1) && unitType === 0
          ? 0
          : Number(item.discountRate),
      note: item.note,
    }));
    const body = {
      id: id,
      billType: Number(billType),
      billDiscountType:
        getTypeImport === 0 || getTypeImport === 1 ? billDiscountType : null,
      billDiscountRate:
        (getTypeImport === 0 || getTypeImport === 1) && billDiscountType === 0
          ? billDiscountRate
          : 0,
      billDiscountAmount:
        (getTypeImport === 0 || getTypeImport === 1) && billDiscountType === 1
          ? billDiscountAmount
          : 0,
      storeId: storeId,
      audienceType: audienceType,
      audienceId: audienceId ? audienceId : null,
      documentDetailType: documentDetailType,
      note: note,
      vatType: vatType,
      vatRate: vatRate,
      vatAmount: vatAmount,
      vatBillCode: vatBillCode,
      vatBillDate: vatBillDate,
      cashPaymentAccountCode: cashPaymentAccountCode,
      cashPaymentAmount: cashPaymentAmount,
      bankPaymentAccountCode: bankPaymentAccountCode,
      bankPaymentAmount: bankPaymentAmount,
      products,
    };
    try {
      setLoading(true);
      if (isEmpty(products)) {
        setLoading(false);
        setNotification({
          error: 'Không được để trống sản phẩm!',
        });
      } else {
        setLoading(true);
        const response = await dispatch(UpdateWareHousingApi(body));
        if (response.payload === true) {
          setNotification({
            message:
              Number(billType) === 0
                ? 'Sửa phiếu nhập thành công'
                : 'Sửa phiếu xuất thành công',
            severity: 'success',
          });
          //   navigate(`/inventory/bill/edit/${id}/${billType}`);
          navigate(`/inventory?value=filter`);
        } else {
          setNotification({
            error:
              Number(billType) === 0
                ? 'Lỗi khi sửa phiếu nhập'
                : 'Lỗi khi sửa phiếu xuất',
          });
        }
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  const [toggleVAT, setToggleVAT] = useState<Boolean>(true);
  const [isOpenDialogInfo, setOpenDialogInfo] = useState<boolean>(false);

  const handleToggleDialog = () => {
    setOpenDialogInfo((prev) => !prev);
  };
  const handleToggleVAT = () => {
    setToggleVAT((prev) => !prev);
  };

  const fetchDataStoreApplication = async () => {
    try {
      await dispatch(getListStoreApplication({}));
      await dispatch(
        getListMasterDataPaymentAccount({
          pageIndex: 0,
          pageSize: 50,
        })
      );
    } catch (error) {
    } finally {
    }
  };

  const fetchMasterData = async () => {
    const body = {
      warehousingBillType: Number(billType),
      audienceType:
        form.watch('audienceType') === 0 ? 0 : form.watch('audienceType'),
      ticketType: null,
      documentType: null,
      isWarehousingBillForm: true,
    };
    try {
      //   if (form.watch('audienceType')) {
      await dispatch(getListMasterData(body));
      //   }
    } catch (error) {
    } finally {
    }
  };

  const fetchMasterDataAudience = async () => {
    const body = {
      audienceType: form.watch('audienceType'),
      searchText: textValueSearch,
    };
    try {
      if (form.watch('audienceType')) {
        await dispatch(getListMasterDataAudience(body));
      }
    } catch (error) {
    } finally {
    }
  };

  const fetchMasterDataProducts = async () => {
    const body = {
      searchText: textValueSearchProduct,
      pageSize: 10,
      isSearchByIMEI: form.watch('isSearchByIMEI') === 1 ? true : false,
      storeId: form.watch('storeId'),
    };
    try {
      if (form.watch('storeId') !== null) {
        await dispatch(getListMasterDataProducts(body));
      }
    } catch (error) {
    } finally {
    }
  };
  useEffect(() => {
    fetchMasterData();
  }, [form.watch('audienceType'), billType, form]);

  useEffect(() => {
    fetchMasterDataAudience();
  }, [form.watch('audienceType'), textValueSearch]);

  useEffect(() => {
    fetchMasterDataProducts();
  }, [form.watch('storeId'), textValueSearchProduct]);

  useEffect(() => {
    fetchDataStoreApplication();
  }, []);

  function checkItemExist(
    item: MasterDataList | undefined,
    array: MasterDataList[]
  ) {
    if (array.length === 0 && item) {
      return [item];
    }
    if (item) {
      const findItem = array.find((it) => it.id === item.id);
      if (findItem) {
        return array;
      } else {
        return [...array, item];
      }
    } else {
      return array;
    }
  }

  const handleRowEditableChange = (
    rowEditableState: Record<string, boolean>
  ) => {
    const isEditing = TypedObject.isExist(rowEditableState);
    setIsEditing(isEditing);
    refetch();
  };

  const onSelect = (value: string | null) => {
    let selected = masterDataLisProducts.filter((item: any) =>
      (value || '').includes(item.id)
    );
    const rowId = nanoid();

    const rows: TableCreateProducts[] = selected.reduce(
      (acc: TableCreateProducts[], product: TableCreateProducts) => {
        acc.push({
          id: rowId,
          productId: product.id,
          code: product.code,
          name: product.name,
          productStockQuantity: product.stockQuantity,
          unitName: product.unitName,
          quantity: 0,
          price: 0,
          total: 0,
          unitTotal: 0,
          unitRow: 0,
          note: null,
          discountAmount: 0,
        });
        return acc;
      },
      []
    );
    append(rows, { shouldFocus: false });
    tableRef.current?.startRowEditMode(rowId);
  };

  const fetchData = useCallback(async () => {
    if (!id) {
      return;
    }
    try {
      const resultAction = await dispatch(GetWareHousingBillByIdApi(id));
      const response = unwrapResult(resultAction);

      const {
        storeId,
        audienceType,
        documentDetailType,
        audienceId,
        numberPhone,
        vatType,
        vatAmount,
        vatBillCode,
        vatBillDate,
        billDiscountType,
        billDiscountRate,
        billDiscountAmount,
        cashPaymentAmount,
        cashPaymentAccountCode,
        bankPaymentAmount,
        bankPaymentAccountCode,
        note,
      } = response;

      const tableValues = response.products.map(
        (_item: TableCreateProducts, index: any) => ({
          id: _item.warehousingBillId,
          productId: _item.productId,
          code: _item.productCode,
          unitName: _item.unitName,
          name: _item.productName,
          productStockQuantity: _item.productStockQuantity,
          quantity: _item.quantity,
          price: _item.price,
          total: _item.totalPriceBeforeDiscount,
          unitTotal: null,
          unitRow: null,
          note: _item.note,
          discountAmount: _item.discountAmount ? _item.discountAmount : '0',
          discountType: _item.discountType,
          totalPriceAfterDiscount: _item.totalPrice,
          totalPriceBeforeDiscount: _item.totalPriceBeforeDiscount
        })
      ) as TableCreateProducts[];

      form.reset({
        storeId,
        audienceType,
        documentDetailType,
        audienceId,
        numberPhone: audienceId,
        vatType: vatType ? vatType : 0,
        vatAmount: vatAmount ? vatAmount : '0',
        vatBillCode,
        vatBillDate,
        billDiscountType: billDiscountType ? billDiscountType : 0,
        billDiscountAmount: billDiscountAmount ? billDiscountAmount : '0',
        cashPaymentAmount: cashPaymentAmount ? cashPaymentAmount : '0',
        cashPaymentAccountCode,
        bankPaymentAmount: bankPaymentAmount ? bankPaymentAmount : '0',
        bankPaymentAccountCode,
        note,
        unitType: !isEmpty(tableValues) ? tableValues[0].discountType : 0,
        //     documentCode,
        //     note,
        //     ticketType,
        //     audienceCode,
        //     imageUrls: attachments?.files.map((_item) => _item.name).join(', '),
        form: tableValues,
      });
      if (vatAmount) {
        setToggleVAT(true);
      }
      tableValues.forEach((_item) => {
        tableRef.current?.startRowEditMode(_item.id);
      });
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, form, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData, id]);
  return (
    <PageWrapper
      title={
        billType === '0' ? 'Chi tiết phiếu nhập' : 'Chi tiết phiếu xuất' || ''
      }
    >
      <PageBreadcrumbs
        title={
          billType === '0' ? 'Chi tiết phiếu nhập' : 'Chi tiết phiếu xuất' || ''
        }
        items={[
          { link: '/inventory', text: 'Cửa hàng' },
          { link: '/inventory', text: 'Xuất nhập kho' },
        ]}
      />
      <ProForm form={form} onFinish={handleSubmit}>
        <div
          style={{
            marginTop: '10px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateAreas:
              '"left right" "mid mid" "bot bot" "divider divider" "note note"',
            columnGap: '20px',
            rowGap: '10px',
          }}
        >
          <Stack
            direction={'column'}
            sx={{ gridArea: 'left', minHeight: '100%' }}
          >
            <ProFormContent sx={{ minHeight: '100%' }}>
              <Paper sx={{ p: 2, minHeight: '100%' }}>
                <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                  <InfoIcon />
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 'medium', marginLeft: '4px' }}
                  >
                    {'Thông tin'}
                  </Typography>
                </Box>
                <Divider />
                <Grid container spacing={2} marginTop={1} marginBottom={1}>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Cửa hàng'} name="storeId" />
                    <ProFormSelect
                      disabled
                      name="storeId"
                      placeholder={'Cửa hàng'}
                      options={storeApplicationList}
                      renderLabel={(option) => option?.name}
                      renderValue={(option) => option?.id}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel
                      title={'Loại đối tượng'}
                      name="audienceType"
                    />
                    <ProFormSelect
                      disabled
                      name="audienceType"
                      placeholder={'Loại đối tượng'}
                      options={[
                        {
                          value: AUDIENCE_TYPE_NCCVN,
                          label: 'Nhà cung cấp VN',
                        },
                        {
                          value:
                            Number(billType) === 0
                              ? AUDIENCE_TYPE_KH
                              : AUDIENCE_TYPE_NCCTQ,
                          label:
                            Number(billType) === 0
                              ? 'Khách hàng'
                              : 'Nhà cung cấp TQ',
                        },
                        { value: AUDIENCE_TYPE_KHAC, label: 'Khác' },
                      ]}
                      renderLabel={(option) => option?.label}
                      renderValue={(option) => option?.value}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Kiểu'} name="documentDetailType" />
                    <ProFormSelect
                      disabled
                      name="documentDetailType"
                      placeholder={'Kiểu'}
                      options={masterDataList}
                      renderLabel={(option) => option?.name}
                      renderValue={(option) => option?.id}
                    />
                  </Grid>
                  {getTypeImport === 0 || getTypeImport === 1 ? (
                    <>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <ProFormLabel title={'Tên đối tượng'} name="audience" />
                        <ProFormAutoCompleteDoubleFind
                          disabled
                          name="audienceId"
                          placeholder={'Tên đối tượng'}
                          options={checkItemExist(
                            oldValue.audienceId,
                            masterDataListAudience
                          )}
                          renderLabel={(option) => option?.name}
                          renderValue={(option) => option?.id}
                          onSelect={(value) => {
                            if (value) {
                              form.setValue('numberPhone', value);
                              const findItem = masterDataListAudience.find(
                                (item) => item.id === value
                              );
                              setOldValue({
                                audienceId: findItem,
                                numberPhone: findItem,
                              });
                            }
                          }}
                          valueSelect={
                            form.watch('numberPhone') &&
                            form.watch('audienceId')
                              ? form.watch('numberPhone')
                              : null
                          }
                          onKeyUp={(e) =>
                            setTimeout(() => {
                              setTextSearchValue(
                                (e.target as HTMLInputElement).value
                              );
                            }, 1700)
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <ProFormLabel
                          title={'Số điện thoại'}
                          name="numberPhone"
                        />
                        <ProFormAutoCompleteDoubleFind
                          disabled
                          name="numberPhone"
                          placeholder={'Số điện thoại'}
                          options={checkItemExist(
                            oldValue.numberPhone,
                            masterDataListAudience
                          )}
                          renderLabel={(option) => option?.phone}
                          renderValue={(option) => option?.id}
                          onSelect={(value) => {
                            if (value) {
                              form.setValue('audienceId', value);
                              const findItem = masterDataListAudience.find(
                                (item) => item.id === value
                              );
                              setOldValue({
                                audienceId: findItem,
                                numberPhone: findItem,
                              });
                            }
                          }}
                          valueSelect={
                            form.watch('audienceId')
                              ? form.watch('audienceId')
                              : null
                          }
                          onKeyUp={(e) =>
                            setTimeout(() => {
                              setTextSearchValue(
                                (e.target as HTMLInputElement).value
                              );
                            }, 1700)
                          }
                        />
                      </Grid>
                    </>
                  ) : null}
                  {/* {getTypeImport && getTypeImport === 1 ? (
                    <>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <ProFormLabel title={'Nhà cung cấp'} name="acv" />
                        <Stack>
                          <ProFormSelect
                            name="acv"
                            placeholder={'Nhà cung cấp'}
                            options={[
                              { value: 0, label: 'NCCTQ' },
                              { value: 1, label: 'NCCVN' },
                            ]}
                          />
                          <ActionButton
                            actionType="add"
                            onClick={handleToggleDialog}
                          />
                        </Stack>
                      </Grid>
                    </>
                  ) : null} */}
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Ghi chú'} name="note" />
                    <ProFormTextField
                      disabled
                      name="note"
                      placeholder={'Ghi chú'}
                      rows={4}
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
                    />
                  </Grid>
                </Grid>
              </Paper>
            </ProFormContent>
          </Stack>
          <>
            {wareHousingBillById.isPaymentModuleHidden ? null : (
              <>
                {' '}
                {getTypeImport === 0 || getTypeImport === 1 ? (
                  <Stack direction={'column'} sx={{ gridArea: 'right' }}>
                    <ProFormContent>
                      <Paper sx={{ p: 2 }}>
                        <Box
                          sx={{
                            p: 1,
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CreditCardIcon />
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 'medium', marginLeft: '4px' }}
                            >
                              {'Thanh toán'}
                            </Typography>
                          </Box>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              opacity: '0.5',
                            }}
                            onClick={handleToggleVAT}
                          >
                            VAT
                            {toggleVAT ? (
                              <ArrowDropDownIcon />
                            ) : (
                              <ArrowDropUpIcon />
                            )}
                          </div>
                        </Box>
                        <Divider />
                        <Grid
                          container
                          spacing={2}
                          marginTop={1}
                          marginBottom={1}
                        >
                          {toggleVAT && (
                            <>
                              {form.watch('vatAmount') > 0 ? (
                                <Grid
                                  item
                                  container
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  lg={12}
                                >
                                  <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <ProFormLabel title={'VAT'} name="vat" />
                                  </Grid>
                                  <Grid
                                    item
                                    container
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                  >
                                    <Grid item xs={2} sm={2} md={2} lg={2}>
                                      <ProFormSelect
                                        disabled
                                        name="vatType"
                                        placeholder={'VAT'}
                                        options={[
                                          { value: 0, label: '%' },
                                          { value: 1, label: 'VND' },
                                        ]}
                                        renderLabel={(option) => option?.label}
                                        renderValue={(option) => option?.value}
                                      />
                                    </Grid>
                                    <Grid item xs={10} sm={10} md={10} lg={10}>
                                      <ProFormTextField
                                        disabled
                                        name="vatAmount"
                                        placeholder={
                                          form.watch('vatType') === 0
                                            ? 'Phần trăm'
                                            : 'Số tiền'
                                        }
                                        InputProps={{
                                          inputComponent:
                                            form.watch('vatType') === 0
                                              ? SaleInput
                                              : PriceDecimalInput,
                                          sx: {
                                            '& .MuiInputBase-input.Mui-disabled':
                                              {
                                                WebkitTextFillColor: '#000000',
                                              },
                                            '.MuiInputBase-input': {
                                              fontWeight: 700,
                                            },
                                          },
                                        }}
                                        InputLabelProps={{
                                          sx: {
                                            '& .MuiInputBase-input.Mui-disabled':
                                              {
                                                fontWeight: 700,
                                              },
                                          },
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                </Grid>
                              ) : null}

                              <>
                                {form.watch('vatBillCode') ? (
                                  <>
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                      <ProFormLabel
                                        title={'Số hóa đơn VAT'}
                                        name="poo"
                                      />
                                      <ProFormTextField
                                        name="vatBillCode"
                                        disabled
                                        placeholder={'Số hóa đơn VAT'}
                                        InputProps={{
                                          sx: {
                                            '& .MuiInputBase-input.Mui-disabled':
                                              {
                                                WebkitTextFillColor: '#000000',
                                              },
                                            '.MuiInputBase-input': {
                                              fontWeight: 700,
                                            },
                                          },
                                        }}
                                        InputLabelProps={{
                                          sx: {
                                            '& .MuiInputBase-input.Mui-disabled':
                                              {
                                                fontWeight: 700,
                                              },
                                          },
                                        }}
                                      />
                                    </Grid>
                                  </>
                                ) : null}
                              </>
                              <>
                                {form.watch('vatBillDate') ? (
                                  <>
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                      <ProFormLabel
                                        title={'Ngày xuất VAT'}
                                        name="iii"
                                      />
                                      <ProFormDate
                                        name="vatBillDate"
                                        type="start"
                                        disabled
                                      />
                                    </Grid>
                                  </>
                                ) : null}
                              </>
                            </>
                          )}
                          {getTypeImport === 0 || getTypeImport === 1 ? (
                            <>
                              <Grid
                                item
                                container
                                xs={12}
                                sm={12}
                                md={12}
                                lg={12}
                              >
                                {form.watch('billDiscountAmount') > 0 ? (
                                  <>
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                      <ProFormLabel
                                        title={'Chiết khấu'}
                                        name="unit234"
                                      />
                                    </Grid>
                                    <Grid
                                      item
                                      container
                                      xs={12}
                                      sm={12}
                                      md={12}
                                      lg={12}
                                    >
                                      <Grid item xs={2} sm={2} md={2} lg={2}>
                                        <ProFormSelect
                                          name="billDiscountType"
                                          placeholder={'Chiết khấu'}
                                          options={[
                                            { value: 0, label: '%' },
                                            { value: 1, label: 'VND' },
                                          ]}
                                          renderLabel={(option) =>
                                            option?.label
                                          }
                                          renderValue={(option) =>
                                            option?.value
                                          }
                                          disabled
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        xs={10}
                                        sm={10}
                                        md={10}
                                        lg={10}
                                      >
                                        <ProFormTextField
                                          name="billDiscountAmount"
                                          placeholder={
                                            form.watch('billDiscountType') === 0
                                              ? 'Phần trăm'
                                              : 'Số tiền'
                                          }
                                          InputProps={{
                                            inputComponent:
                                              form.watch('billDiscountType') ===
                                              0
                                                ? SaleInput
                                                : PriceDecimalInput,
                                            sx: {
                                              '& .MuiInputBase-input.Mui-disabled':
                                                {
                                                  WebkitTextFillColor:
                                                    '#000000',
                                                },
                                              '.MuiInputBase-input': {
                                                fontWeight: 700,
                                              },
                                            },
                                          }}
                                          InputLabelProps={{
                                            sx: {
                                              '& .MuiInputBase-input.Mui-disabled':
                                                {
                                                  fontWeight: 700,
                                                },
                                            },
                                          }}
                                          disabled
                                        />
                                      </Grid>
                                    </Grid>
                                  </>
                                ) : null}
                              </Grid>
                            </>
                          ) : null}

                          <Grid item xs={12} sm={12} md={12} lg={12}>
                            {form.watch('cashPaymentAmount') !== '0' ? (
                              <>
                                <ProFormLabel title={'Tiền mặt'} name="iiuj" />
                                <ProFormTextField
                                  name="cashPaymentAmount"
                                  placeholder="Số tiền"
                                  disabled
                                  InputProps={{
                                    inputComponent: PriceDecimalInput,
                                    sx: {
                                      '& .MuiInputBase-input.Mui-disabled': {
                                        WebkitTextFillColor: '#000000',
                                      },
                                      '.MuiInputBase-input': {
                                        fontWeight: 700,
                                      },
                                    },
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <LocalAtmIcon />
                                      </InputAdornment>
                                    ),
                                  }}
                                  InputLabelProps={{
                                    sx: {
                                      '& .MuiInputBase-input.Mui-disabled': {
                                        fontWeight: 700,
                                      },
                                    },
                                  }}
                                />
                              </>
                            ) : null}
                          </Grid>
                          <Grid item xs={12} sm={12} md={12} lg={12}>
                            {form.watch('cashPaymentAccountCode') ? (
                              <>
                                <ProFormLabel
                                  title={'Tài khoản'}
                                  name="taikhoan"
                                />
                                <ProFormSelect
                                  name="cashPaymentAccountCode"
                                  placeholder={'Tài khoản'}
                                  options={masterDataLisPaymentAccount}
                                  renderLabel={(option) =>
                                    `${option?.name} - ${option?.code}`
                                  }
                                  renderValue={(option) => option?.code}
                                  disabled
                                />
                              </>
                            ) : null}
                          </Grid>
                          <Grid item xs={12} sm={12} md={12} lg={12}>
                            {form.watch('bankPaymentAmount') !== '0' ? (
                              <>
                                <ProFormLabel
                                  title={'Chuyển khoản'}
                                  name="bank"
                                />
                                <ProFormTextField
                                  name="bankPaymentAmount"
                                  placeholder="Số tiền"
                                  InputProps={{
                                    inputComponent: PriceDecimalInput,
                                    sx: {
                                      '& .MuiInputBase-input.Mui-disabled': {
                                        WebkitTextFillColor: '#000000',
                                      },
                                      '.MuiInputBase-input': {
                                        fontWeight: 700,
                                      },
                                    },
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <LocalAtmIcon />
                                      </InputAdornment>
                                    ),
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
                              </>
                            ) : null}
                          </Grid>
                          <Grid item xs={12} sm={12} md={12} lg={12}>
                            {form.watch('bankPaymentAccountCode') ? (
                              <>
                                {' '}
                                <ProFormLabel
                                  title={'Tài khoản'}
                                  name="taikhoan2"
                                />
                                <ProFormSelect
                                  name="bankPaymentAccountCode"
                                  placeholder={'Tài khoản'}
                                  options={masterDataLisPaymentAccount}
                                  renderLabel={(option) =>
                                    `${option?.name} - ${option?.code}`
                                  }
                                  renderValue={(option) => option?.code}
                                  disabled
                                />
                              </>
                            ) : null}
                          </Grid>
                        </Grid>
                      </Paper>
                    </ProFormContent>
                  </Stack>
                ) : null}
              </>
            )}
          </>
        </div>
        <Grid item xs={12}>
          <Box sx={{ gridArea: 'mid', height: '500px' }}>
            {/* <Grid container spacing={2} marginBottom={2}>
              <Grid item xs={2} sm={2} md={2} lg={2}>
                <ProFormSelect
                  name="isSearchByIMEI"
                  placeholder={'Nhập theo'}
                  options={[
                    { value: 0, label: 'Sản phẩm' },
                    { value: 1, label: 'Nhập theo ri' },
                  ]}
                  renderLabel={(option) => option?.label}
                  renderValue={(option) => option?.value}
				  disabled
                />
              </Grid>
              <Grid item xs={9} sm={9} md={9} lg={9}>
                <ProFormAutocompleteSingal
                  name="productId"
                  placeholder={'Sản phẩm'}
                  options={masterDataLisProducts}
                  renderValue={(item) => item.id}
                  renderLabel={(item) => `${item.code} - ${item.name}`}
				  disabled
                  onSelect={onSelect}
                  onKeyUp={(e) =>
                    setTimeout(() => {
                      setTextSearchValueProduct(
                        (e.target as HTMLInputElement).value
                      );
                    }, 1000)
                  }
                />
              </Grid>
              <Grid item xs={1} sm={1} md={1} lg={1}>
                <Button>
                  <AddIcon />
                </Button>
              </Grid>
            </Grid> */}
            <Paper sx={{ p: 1, pb: 5 }}>
              <Box sx={{ height: '35vh' }}>
                <ProTable<TableCreateProducts>
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
            </Paper>
          </Box>
        </Grid>
        <Stack direction="column" spacing={2} sx={{ gridArea: 'bot' }}>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2} marginTop={1} marginBottom={1}></Grid>
          </Box>
          <Box sx={{ p: 2 }}>
            {/* <Stack direction="row" spacing={1}>
                <ActionButton actionType="save" type="submit">
                  Lưu
                </ActionButton>
              </Stack> */}
          </Box>
        </Stack>
        {isOpenDialogInfo ? (
          <AddNewSupplier
            open={isOpenDialogInfo}
            onClose={handleToggleDialog}
          />
        ) : null}
      </ProForm>
    </PageWrapper>
  );
};

export default DetailBill;
