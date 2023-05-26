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
import { nanoid } from '@reduxjs/toolkit';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormAutoCompleteDoubleFind from 'components/ProForm/ProFormAutoCompleteDoubleFind';
import ProFormAutocompleteSingal from 'components/ProForm/ProFormAutocompleteSingal';
import ProFormContent from 'components/ProForm/ProFormContent';
import ProFormDate from 'components/ProForm/ProFormDate';
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
  PriceInput,
  SaleInput,
} from '../../../../plugins/NumberFormat';
import DateFns from 'utils/DateFns';
import AddNewSupplier from './AddNewSupplier';
import useTableColumns from './TableColumns';
import ProTableCell from 'components/ProTable/ProTableCell';
import Numeral from 'utils/Numeral';
import { CreateWareHousingApi } from 'slices/warehousingslice';
import useNotification from 'hooks/useNotification';
import { useNavigate } from 'react-router-dom';
import { lazy } from 'yup';
import Regexs from 'utils/Regexs';
import * as yup from 'yup';
import { PriceDecimalInput } from '../../../../plugins/NumberFormat';
import DateTime from 'utils/DateTime';
import ProFormMultiAutocomplete from 'components/ProTable/core/EditableCell/ProFormMultiAutocomplete';

const schema = Validation.shape(
  {
    storeId: Validation.string().required('Cửa hàng không được để trống').default(null),
    audienceType: Validation.option().required('Loại đối tượng không được để trống ').default(null),
    vatType: Validation.select(0).optional(),
    unitType: Validation.select(0).optional(),
    audienceId: Validation.string().when('audienceType', {
      is: 0 || 1,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.optional(),
    }),
    vatAmount: Validation.string().when('vatType', {
      is: 0,
      then: (schema) =>
        lazy((values: any) => {
          if (Number(values) < 0) {
            return Validation.pattern(
              Regexs.numbermax,
              'VAT phải lớn hơn 0'
            ).optional();
          }
          if (Number(values) > 99) {
            return Validation.pattern(
              Regexs.numbermax,
              'VAT không thể lớn hơn 99'
            ).optional();
          }
          return Validation.pattern(
            Regexs.numbermax,
            'Không nhập kí tự đặc biệt'
          ).optional();
        }),
      otherwise: (schema) =>
        Validation.pattern(Regexs.number2, 'VAT VND không hợp lệ')
          .optional()
          .nullable()
          .default(''),
    }),
    vatBillCode: Validation.string().when('vatAmount', {
      is: (value: any) => value > 0,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.optional(),
    }),
    vatBillDate: Validation.string().when('vatAmount', {
      is: (value: any) => value > 0,
      then: (schema) =>
        Validation.date()
          .max(DateFns.EndOfDay(new Date()), 'Ngày không hợp lệ')
          .required('Ngày không được để trống'),

      otherwise: (schema) =>
        Validation.date()
          .max(DateFns.EndOfDay(new Date()), 'Ngày không hợp lệ')
          .optional(),
    }),
    billDiscountAmount: Validation.string().when('billDiscountType', {
      is: 0,
      then: (schema) =>
        lazy((values: any) => {
          if (Number(values) < 0) {
            return Validation.pattern(
              Regexs.numbermax,
              'Chiết khấu phải lớn hơn 0'
            ).optional();
          }
          if (Number(values) > 99) {
            return Validation.pattern(
              Regexs.numbermax,
              'Chiết khấu không thể lớn hơn 99'
            ).optional();
          }
          return Validation.pattern(
            Regexs.numbermax,
            'Không nhập kí tự đặc biệt'
          ).optional();
        }),
      otherwise: (schema) =>
        Validation.pattern(Regexs.number2, 'Chiết khấu VND không hợp lệ')
          .optional()
          .nullable()
          .default(''),
    }),
    saleValue: Validation.string().when('billDiscountAmount', {
      is: (value: string) => {
        if (Number(value) > 0) {
          return true;
        } else {
          return false;
        }
      },
      then: (schema) => Validation.string().optional(),
      otherwise: (schema) => {
        return Validation.string().when('unitType', {
          is: 0,
          then: (schema) =>
            lazy((values: any) => {
              if (Number(values) < 0) {
                return Validation.pattern(
                  Regexs.numbermax,
                  'Chiết khấu phải lớn hơn 0'
                ).optional();
              }
              if (Number(values) > 99) {
                return Validation.pattern(
                  Regexs.numbermax,
                  'Chiết khấu không thể lớn hơn 99'
                ).optional();
              }
              return Validation.pattern(
                Regexs.numbermax,
                'Không nhập kí tự đặc biệt'
              ).optional();
            }),
          otherwise: (schema) =>
            Validation.pattern(Regexs.number2, 'Chiết khấu không hợp lệ')
              .optional()
              .nullable()
              .default(''),
        });
      },
    }),
    form: yup.array().when('billDiscountAmount', {
      is: (value: string) => {
        if (Number(value) > 0) {
          return true;
        } else {
          return false;
        }
      },
      then: (schema) =>
        yup.array().of(
          yup.object().shape({
            note: Validation.string().optional(),
            quantity: Validation.pattern(
              Regexs.number,
              'Số lượng không hợp lệ'
            )
              .required()
              .test({
                name: 'quantity',
                message: 'Không được lớn hơn số lượng tồn',
                test: (quantity, context) => {
                  const { stockQuantity } = context.parent;
                  if (Number(quantity) > stockQuantity) {
                    return false;
                  }
                  return true;
                },
              }),
            price: Validation.pattern(
              Regexs.number2,
              'Giá yêu cầu không hợp lệ'
            )
              .test(
                'valiRequestPrice',
                'Giá yêu cầu phải lớn hơn 0',
                async (value, context) => {
                  const numberVal = parseInt(value);
                  return !(numberVal <= 0);
                }
              )
              .required('Giá yêu cầu không được để trống')
              .nullable()
              .default(''),
            discountAmount: Validation.pattern(
              Regexs.number2,
              'Chiết khấu không hợp lệ'
            )
              .optional()
              .nullable()
              .default(''),
          })
        ),
      otherwise: yup.array().when('unitType', {
        is: 0,
        then: (schema) =>
          yup.array().of(
            yup.object().shape({
              note: Validation.string().optional(),
              quantity: Validation.pattern(
                Regexs.number,
                'Số lượng không hợp lệ'
              )
                .required()
                .test({
                  name: 'quantity',
                  message: 'Không được lớn hơn số lượng tồn',
                  test: (quantity, context) => {
                    const { stockQuantity } = context.parent;
                    if (Number(quantity) > stockQuantity) {
                      return false;
                    }
                    return true;
                  },
                }),
              price: Validation.pattern(
                Regexs.number2,
                'Giá yêu cầu không hợp lệ'
              )
                .test(
                  'valiRequestPrice',
                  'Giá yêu cầu phải lớn hơn 0',
                  async (value, context) => {
                    const numberVal = parseInt(value);
                    return !(numberVal <= 0);
                  }
                )
                .required('Giá yêu cầu không được để trống')
                .nullable()
                .default(''),
              discountAmount: lazy((values: any) => {
                if (Number(values) < 0) {
                  return Validation.pattern(
                    Regexs.numbermax,
                    'Chiết khấu phải lớn hơn 0'
                  ).optional();
                }
                if (Number(values) > 99) {
                  return Validation.pattern(
                    Regexs.numbermax,
                    'Chiết khấu không thể lớn hơn 100'
                  ).optional();
                }
                return Validation.pattern(
                  Regexs.numbermax,
                  'Chiết khấu không thể quá 2 chữ số'
                ).optional();
              }),
            })
          ),
        otherwise: yup.array().of(
          yup.object().shape({
            note: Validation.string().optional(),
            quantity: Validation.pattern(
              Regexs.number,
              'Số lượng không hợp lệ'
            )
              .required()
              .test({
                name: 'quantity',
                message: 'Không được lớn hơn số lượng tồn',
                test: (quantity, context) => {
                  const { stockQuantity } = context.parent;
                  if (Number(quantity) > stockQuantity) {
                    return false;
                  }
                  return true;
                },
              }),
            price: Validation.pattern(
              Regexs.number2,
              'Giá yêu cầu không hợp lệ'
            )
              .test(
                'valiRequestPrice',
                'Giá yêu cầu phải lớn hơn 0',
                async (value, context) => {
                  const numberVal = parseInt(value);
                  return !(numberVal <= 0);
                }
              )
              .required('Giá yêu cầu không được để trống')
              .nullable()
              .default(''),
            discountAmount: Validation.pattern(
              Regexs.number2,
              'Chiết khấu không hợp lệ'
            )
              .optional()
              .nullable()
              .default(''),
          })
        ),
      }),
    }),
    isSearchByIMEI: Validation.select(0).optional(),
    priceInput: Validation.pattern(
      Regexs.number2,
      'Giá tiền không hợp lệ'
    ).optional(),
    quantityInput: Validation.pattern(
      Regexs.number,
      'Số lượng không hợp lệ'
    ).optional(),
    cashPaymentAmount: Validation.pattern(
      Regexs.number2,
      'Tiền mặt không hợp lệ'
    ).when('cashPaymentAccountCode', {
      is: '',
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.required('Tiền mặt không được để trống'),
    }),
    cashPaymentAccountCode: Validation.string().when('cashPaymentAmount', {
      is: (value: any) => Number(value) > 0,
      then: (schema) => schema.required('Tài khoản không được để trống'),
      otherwise: (schema) => schema.optional(),
    }),
    bankPaymentAmount: Validation.pattern(
      Regexs.number2,
      'Tiền chuyển khoản không hợp lệ'
    ).when('bankPaymentAccountCode', {
      is: '',
      then: (schema) => schema.optional(),
      otherwise: (schema) =>
        schema.required('Tiền chuyển khoản không được để trống'),
    }),
    bankPaymentAccountCode: Validation.string().when('bankPaymentAmount', {
      is: (value: any) => Number(value) > 0,
      then: (schema) => schema.required('Tài khoản không được để trống'),
      otherwise: (schema) => schema.optional(),
    }),
    thanhtien: Validation.string().optional(),
    billDiscountType: Validation.select(0).optional(),
    documentDetailType: Validation.option().required('Kiểu không được để trống'),
    note: Validation.string().optional(),
  },
  [
    ['bankPaymentAmount', 'bankPaymentAccountCode'],
    ['cashPaymentAmount', 'cashPaymentAccountCode'],
  ]
);

interface MasterDataList {
  [key: string]: any;
}
interface TableCreateProducts {
  [key: string]: any;
}
interface IImportExport<TableCreateProducts> {
  [key: string]: any;
}

const ExportBill = () => {
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
    reValidateMode: 'onChange',
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
          const isValid = form.trigger(`form.${index}.quantity`);
          if (!isValid) return;
          const row = form.getValues(`form.${index}`);
          update(index, {
            ...row,
            quantity: valuePR,
          });
          form.trigger(`form[${index}].quantity`);
        });
      } else if (typeField === 'priceInput') {
        const valuePR = form.watch('priceInput');
        form.watch('form').map((item: TableCreateProducts, index: any) => {
          const isValid = form.trigger(`form.${index}.price`);
          if (!isValid) return;
          const row = form.getValues(`form.${index}`);
          update(index, {
            ...row,
            price: valuePR,
          });
          form.trigger(`form[${index}].price`);
        });
      } else if (typeField === 'saleValue') {
        const valuePR = form.watch('saleValue');
        form.watch('form').map((item: TableCreateProducts, index: any) => {
          const isValid = form.trigger(`form.${index}.discountAmount`);
          if (!isValid) return;
          const row = form.getValues(`form.${index}`);
          update(index, {
            ...row,
            discountAmount: Number(valuePR),
          });
          form.trigger(`form[${index}].discountAmount`);
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

  const handleRemoveRow = useCallback(
    (rowIndex: number, rowId: string) => () => {
      remove(rowIndex);
      //   if (isEmpty(form.getValues('form'))) {
      //     form.reset({
      //       productId: undefined,
      //     });
      //   }
      tableRef.current?.stopRowEditMode(rowId);
      //   setDisabled((state) => state.filter((item) => item !== rowId));
    },
    [remove]
  );

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
    onUpdate: handleUpdateRow,
    onDelete: handleRemoveRow,
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
    let ArrBody: any = [];
    const products = form.forEach((item: TableCreateProducts) => {
      if (Number(item.quantity) > 0) {
        return ArrBody.push({
          productId: item.productId,
          unit: item.unit ? Number(item.unit) : 0,
          quantity: Number(item.quantity),
          price: Number(item.price),
          discountType: unitType ? unitType : 0,
          discountAmount: item.discountAmount ? Number(item.discountAmount) : 0,
          note: item.note,
        });
      }
    });

    const body = {
      billType: 1,
      billDiscountType: billDiscountType ? billDiscountType : 0,
      billDiscountAmount: billDiscountAmount ? Number(billDiscountAmount) : 0,
      storeId: storeId,
      audienceType: audienceType,
      audienceId: audienceId ? audienceId : null,
      documentDetailType: documentDetailType,
      note: note,
      vatType: vatType ? vatType : 0,
      vatRate: vatRate,
      vatAmount: vatAmount ? Number(vatAmount) : 0,
      vatBillCode: vatBillCode ? vatBillCode : '',
      vatBillDate: vatBillDate ? DateTime.Format(vatBillDate , 'YYYY-MM-DD') : null,
      cashPaymentAccountCode: cashPaymentAccountCode,
      cashPaymentAmount: cashPaymentAmount ? cashPaymentAmount : null,
      bankPaymentAccountCode: bankPaymentAccountCode,
      bankPaymentAmount: bankPaymentAmount ? bankPaymentAmount : null,
      products: ArrBody,
    };
    try {
      setLoading(true);
      if (isEmpty(ArrBody)) {
        setLoading(false);
        setNotification({
          error: 'Cần ít nhất 1 sản phẩm để lưu phiếu!',
        });
      } else {
        setLoading(true);
        const response = await dispatch(CreateWareHousingApi(body));
        if (response.payload === true) {
          setNotification({
            message: 'Thêm mới phiếu Xuất thành công',
            severity: 'success',
          });
          navigate('/inventory?value=filter');
        } else {
          setNotification({
            error: 'Lỗi khi thêm mới phiếu Xuất!',
          });
        }
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  const [toggleVAT, setToggleVAT] = useState<Boolean>(false);
  const [isOpenDialogInfo, setOpenDialogInfo] = useState<boolean>(false);

  const handleToggleDialog = () => {
    setOpenDialogInfo((prev) => !prev);
  };
  const handleToggleVAT = () => {
    setToggleVAT((prev) => !prev);
    form.setValue('vatAmount', null);
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
      warehousingBillType: 1,
      audienceType:
        form.watch('audienceType') === 0 ? 0 : form.watch('audienceType'),
      ticketType: null,
      documentType: null,
      isWarehousingBillForm: true,
    };

    try {
      //   if (form.watch('audienceType') !== null) {
      await dispatch(getListMasterData(body));
      //   }
    } catch (error) {
    } finally {
    }
  };

  const fetchMasterDataAudience = async () => {
    const body = {
      audienceType: form.watch('audienceType')
        ? form.watch('audienceType')
        : null,
      searchText: textValueSearch,
    };
    try {
      //   if (form.watch('audienceType') !== null) {
      await dispatch(getListMasterDataAudience(body));
      //   }
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
  }, [form.watch('audienceType')]);

  useEffect(() => {
    fetchMasterDataAudience();
  }, [form.watch('audienceType'), textValueSearch]);

  useEffect(() => {
    fetchMasterDataProducts();
  }, [form.watch('storeId'), textValueSearchProduct]);

  useEffect(() => {
    fetchDataStoreApplication();
  }, []);

  useEffect(() => {
    const billValue = form.watch('billDiscountAmount');
    form.watch('form').map((item: TableCreateProducts, index: any) => {
      if (billValue && Number(billValue) > 0) {
        form.clearErrors(`form[${index}].discountAmount`);
      }
      form.clearErrors('saleValue');
      form.trigger('saleValue');
    });
  }, [form.watch('billDiscountAmount')]);

  useEffect(() => {
    if (form.watch('audienceType') === 4 || form.watch('audienceType') === 2) {
      form.resetField('vatAmount');
      form.resetField('vatBillCode');
      form.resetField('vatBillDate');
      form.resetField('billDiscountAmount');
      form.resetField('cashPaymentAmount');
      form.resetField('cashPaymentAccountCode');
      form.resetField('bankPaymentAmount');
      form.resetField('bankPaymentAccountCode');
    }
  }, [form.watch('audienceType')]);

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

  const onSelect = (value: string[] | null) => {
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
          stockQuantity: product.stockQuantity,
          quantity: null,
          price: null,
          total: null,
          unitTotal: null,
          unitName: product.unitName,
          unitRow: null,
          note: null,
        });
        return acc;
      },
      []
    );
    append(rows, { shouldFocus: false });
    tableRef.current?.startRowEditMode(rowId);
  };
  const renderTotalRow = () => {
    if (loading) {
      return <></>;
    }
    let needtoPay = 0;
    let countTotal = 0;
    let countTotalDiscount = 0;
    let beforeVat = 0;
    const total = form.watch('form');
    const TypeUnit = form.watch('unitType');
    const billDiscountType = form.watch('billDiscountType');
    const VATtotal = form.watch('vatAmount');
    const audienceType = form.watch('audienceType');
    const vatType = form.watch('vatType');
    const BDA = form.watch('billDiscountAmount');
    if (!isEmpty(total)) {
      total.forEach((item: any, index: any) => {
        const DCR = item.discountAmount ? parseFloat(item.discountAmount) : 0;
        countTotal += item.total ? item.total : 0;
        if (audienceType === 4 || audienceType === 2) {
          countTotalDiscount = 0;
          needtoPay = countTotal - 0;
        } else {
          if (BDA && BDA > 0) {
            if (billDiscountType === 0) {
              if (total) {
                if (typeof BDA === 'string') {
                  countTotalDiscount += (item.total * Number(BDA)) / 100;
                } else {
                  countTotalDiscount += (item.total * BDA) / 100;
                }
              }
            } else {
              if (total) {
                if (typeof BDA === 'string') {
                  countTotalDiscount = BDA ? Number(BDA) : 0;
                } else {
                  countTotalDiscount = BDA ? BDA : 0;
                }
              }
            }
          } else {
            if (unitType === 0 && DCR) {
              countTotalDiscount += (item.total * DCR) / 100;
            } else {
              countTotalDiscount += DCR;
            }
          }

          if (countTotalDiscount) {
            needtoPay = countTotal - countTotalDiscount;
          } else {
            needtoPay = countTotal - 0;
          }
        }
      });
    }

    if (toggleVAT && VATtotal) {
      if (vatType === 0) {
        if (typeof VATtotal === 'string') {
          beforeVat = (needtoPay * Number(VATtotal)) / 100;
        } else {
          beforeVat = (needtoPay * VATtotal) / 100;
        }
      } else {
        if (typeof VATtotal === 'string') {
          beforeVat = Number(VATtotal);
        } else {
          beforeVat = VATtotal;
        }
      }
    }

    return (
      <>
        {!isEmpty(fields) && (
          <TableRow hover>
            <ProTableCell align="right" offset={0} colSpan={7}>
              <Typography fontWeight="bold">Cần thanh toán</Typography>
            </ProTableCell>
            <ProTableCell align="left" offset={0} colSpan={3}>
              <Typography fontWeight="bold">
                {toggleVAT && VATtotal
                  ? Numeral.price(needtoPay ? needtoPay + beforeVat : 0)
                  : Numeral.price(needtoPay ? needtoPay : 0)}
              </Typography>
            </ProTableCell>
          </TableRow>
        )}
      </>
    );
  };
  return (
    <PageWrapper title={'Thêm phiếu Xuất'}>
      <PageBreadcrumbs
        title={'Thêm phiếu Xuất'}
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
            rowGap: '5px',
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
                      name="audienceType"
                      placeholder={'Loại đối tượng'}
                      options={[
                        {
                          value: AUDIENCE_TYPE_NCCVN,
                          label: 'Nhà cung cấp VN',
                        },
                        {
                          value: AUDIENCE_TYPE_NCCTQ,
                          label: 'Nhà cung cấp TQ',
                        },
                        { value: AUDIENCE_TYPE_KHAC, label: 'Khác' },
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Kiểu'} name="documentDetailType" />
                    <ProFormSelect
                      name="documentDetailType"
                      placeholder={'Kiểu'}
                      options={masterDataList}
                      renderLabel={(option) => option?.name}
                      renderValue={(option) => option?.id}
                    />
                  </Grid>
                  {getTypeImport === 1 || getTypeImport === 2 ? (
                    <>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <ProFormLabel title={'Tên đối tượng'} name="audience" />
                        <ProFormAutoCompleteDoubleFind
                          name="audienceId"
                          placeholder={'Tên đối tượng'}
                          options={checkItemExist(
                            oldValue.audienceId,
                            masterDataListAudience
                          )}
                          renderLabel={(option) => option?.name}
                          renderValue={(option) => option?.id}
                          setTextSearchValue={setTextSearchValue}
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
                          name="numberPhone"
                          placeholder={'Số điện thoại'}
                          options={checkItemExist(
                            oldValue.numberPhone,
                            masterDataListAudience
                          )}
                          renderLabel={(option) => option?.phone}
                          renderValue={(option) => option?.id}
                          setTextSearchValue={setTextSearchValue}
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
                            }, 1500)
                          }
                        />
                      </Grid>
                    </>
                  ) : null}
                  {/* {getTypeImport && getTypeImport === 2 ? (
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
                      name="note"
                      placeholder={'Ghi chú'}
                      rows={4}
                      multiline
                    />
                  </Grid>
                </Grid>
              </Paper>
            </ProFormContent>
          </Stack>
          {getTypeImport === 1 || getTypeImport === null ? (
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
                      {toggleVAT ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                    </div>
                  </Box>
                  <Divider />
                  <Grid container spacing={2} marginTop={1} marginBottom={1}>
                    {toggleVAT && (
                      <>
                        <Grid item container xs={12} sm={12} md={12} lg={12}>
                          <Grid item xs={12} sm={12} md={12} lg={12}>
                            <ProFormLabel title={'VAT'} name="vat" />
                          </Grid>
                          <Grid item container xs={12} sm={12} md={12} lg={12}>
                            <Grid item xs={2} sm={2} md={2} lg={2}>
                              <ProFormSelect
                                name="vatType"
                                placeholder={'VAT'}
                                options={[
                                  { value: 0, label: '%' },
                                  { value: 1, label: 'VND' },
                                ]}
                                onSelect={(e) => {
                                  form.setValue('vatAmount', 0);
                                }}
                              />
                            </Grid>
                            <Grid item xs={10} sm={10} md={10} lg={10}>
                              <ProFormTextField
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
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                          <ProFormLabel title={'Số hóa đơn VAT'} name="poo" />
                          <ProFormTextField
                            name="vatBillCode"
                            placeholder={'Số hóa đơn VAT'}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                          <ProFormLabel title={'Ngày xuất VAT'} name="iii" />
                          <ProFormDate name="vatBillDate" type="start" />
                        </Grid>
                      </>
                    )}
                    {getTypeImport === 1 || getTypeImport === null ? (
                      <>
                        <Grid item container xs={12} sm={12} md={12} lg={12}>
                          <Grid item xs={12} sm={12} md={12} lg={12}>
                            <ProFormLabel title={'Chiết khấu'} name="unit234" />
                          </Grid>
                          <Grid item container xs={12} sm={12} md={12} lg={12}>
                            <Grid item xs={2} sm={2} md={2} lg={2}>
                              <ProFormSelect
                                name="billDiscountType"
                                placeholder={'Chiết khấu'}
                                options={[
                                  { value: 0, label: '%' },
                                  { value: 1, label: 'VND' },
                                ]}
                                onSelect={(e) => {
                                  form.setValue('billDiscountRate', null);
                                  form.setValue('billDiscountAmount', null);
                                }}
                              />
                            </Grid>
                            <Grid item xs={10} sm={10} md={10} lg={10}>
                              <ProFormTextField
                                name="billDiscountAmount"
                                placeholder={
                                  form.watch('billDiscountType') === 0
                                    ? 'Phần trăm'
                                    : 'Số tiền'
                                }
                                InputProps={{
                                  inputComponent:
                                    form.watch('billDiscountType') === 0
                                      ? SaleInput
                                      : PriceDecimalInput,
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </>
                    ) : null}

                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <ProFormLabel title={'Tiền mặt'} name="iiuj" />
                      <ProFormTextField
                        name="cashPaymentAmount"
                        placeholder="Số tiền"
                        InputProps={{
                          inputComponent: PriceDecimalInput,
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocalAtmIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <ProFormLabel title={'Tài khoản'} name="taikhoan" />
                      {/* <ProFormSelect
                        name="cashPaymentAccountCode"
                        placeholder={'Tài khoản'}
                        options={masterDataLisPaymentAccount}
                        renderLabel={(option) =>
                          `${option?.name} - ${option?.code}`
                        }
                        renderValue={(option) => option?.code}
                      />{' '} */}
                      <ProFormAutocompleteSingal
                        name="cashPaymentAccountCode"
                        placeholder={'Tài khoản'}
                        options={masterDataLisPaymentAccount}
                        renderLabel={(option) =>
                          `${option?.name} - ${option?.code}`
                        }
                        renderValue={(option) => option?.code}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <ProFormLabel title={'Chuyển khoản'} name="bank" />
                      <ProFormTextField
                        name="bankPaymentAmount"
                        placeholder="Số tiền"
                        InputProps={{
                          inputComponent: PriceDecimalInput,
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocalAtmIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <ProFormLabel title={'Tài khoản'} name="taikhoan2" />
                      <ProFormAutocompleteSingal
                        name="bankPaymentAccountCode"
                        placeholder={'Tài khoản'}
                        options={masterDataLisPaymentAccount}
                        renderLabel={(option) =>
                          `${option?.name} - ${option?.code}`
                        }
                        renderValue={(option) => option?.code}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </ProFormContent>
            </Stack>
          ) : null}
        </div>
        <Grid item xs={12}>
          <Box sx={{ gridArea: 'mid'}}>
            <Grid container spacing={2} marginBottom={3}>
              <Grid item xs={2} sm={2} md={2} lg={2}>
                <ProFormSelect
                  name="isSearchByIMEI"
                  placeholder={'Nhập theo'}
                  options={[
                    { value: 0, label: 'Sản phẩm' },
                    { value: 1, label: 'IMEI' },
                  ]}
                />
              </Grid>
              <Grid item xs={10} sm={10} md={10} lg={10}>
                {/* <ProFormAutocompleteSingal
                  name="productId"
                  placeholder={'Sản phẩm'}
                  options={masterDataLisProducts}
                  renderValue={(item) => item.id}
                  renderLabel={(item) => `${item.code} - ${item.name}`}
                  onSelect={onSelect}
                /> */}
                 <ProFormMultiAutocomplete
                        name="productId"
                        options={masterDataLisProducts}
                        renderValue={(item) => item.id}
                        renderLabel={(item) => `${item.code} - ${item.name}`}
                        placeholder={'Tên sản phẩm(*)'}
                        onSelect={onSelect}
                        validate={Validation.selectAutocompleteMulti().required("Cần ít nhất 1 sản phẩm để lưu phiếu đặt hàng")}
                      />
              </Grid>
            </Grid>
            <Paper sx={{ p: 1, pb: 5 }}>
            <Box sx={{ p: 2 }}>
              {/* <Stack direction="row" spacing={1}> */}
                <ActionButton actionType="save" type="submit">
                  Lưu
                </ActionButton>
              {/* </Stack> */}
            </Box>
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
                  totalRowBellowFooter={renderTotalRow()}
                />
            </Paper>
          </Box>
        </Grid>
        {/* <Stack direction="column" spacing={2} sx={{ gridArea: 'bot' }}>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2} marginTop={1} marginBottom={1}></Grid>
          </Box>
          <Box sx={{ p: 2 }}>
            <Stack direction="row" spacing={1}>
              <ActionButton actionType="save" type="submit">
                Lưu
              </ActionButton>
            </Stack>
          </Box>
        </Stack> */}
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

export default ExportBill;
