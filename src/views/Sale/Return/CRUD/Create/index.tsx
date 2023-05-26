import { yupResolver } from '@hookform/resolvers/yup';
import PersonIcon from '@mui/icons-material/Person';
import TokenIcon from '@mui/icons-material/Token';
import { Grid, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Validation from 'utils/Validation';
import Customer from './Customer';
import Information from './Information';
import Payment from './Payment';
// import ProductTable from './ProductTable';
import { isEmpty } from 'lodash';
import { useFieldArray } from 'react-hook-form';
import Tag from './Tag';
import ProFormMultiAutocomplete from 'components/ProTable/core/EditableCell/ProFormMultiAutocomplete';
import { useCallback, useEffect, useRef, useState } from 'react';
import { APIGetProductWarehouse } from 'services/warehouseTransfer';
import { IProduct } from 'views/Inventory/OrderSlip/AddOrderSlip/utils/types';
import { nanoid, unwrapResult } from '@reduxjs/toolkit';
import { TableRef } from 'components/ProTable/types/refs';
import ProTable from 'components/ProTable';
import useTableColumns from './ProductTable/TableColumns';
import useFilters from './ProductTable/utils/filters';
import useNotification from 'hooks/useNotification';
import useRefresh from 'hooks/useRefresh';
import { lazy } from 'yup';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProFormAutocompleteSingal from 'components/ProForm/ProFormAutocompleteSingal';
import { PriceDecimalInput } from 'plugins/NumberFormat';
import * as yup from 'yup';
import Regexs from 'utils/Regexs';
import Numeral from 'utils/Numeral';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import { useNavigate, useParams } from 'react-router-dom';
import { getListPriceTable, getListPriceWithPriceTable, getPriceTableList, getPriceWithTableList, getProductDropListStore } from 'slices/billCustomerApplicationSlice';
import { CreateSaleOrderReturnApi, GetSaleOrderReturnByIdApi, UpdateSaleOrderReturnApi } from 'slices/saleOrderReturn';
import { TableSaleReturn } from './ProductTable/utils/types';
import { TableCreateEntry } from 'views/Accounting/TransactionCreate/utils/entryCreate';


interface IForm {
  [key: string]: any;
}
const schema = Validation.shape({
  storeId: Validation.string()
    .required('Cửa hàng không được để trống')
    .default(''),
  form: yup.array().of(
    yup.object().shape({
      quantity: Validation.pattern(Regexs.number, 'Số lượng không hợp lệ')
        .required("Số lượng không được để trống")
        .test({
          name: 'quantity',
          message: 'Không được lớn hơn số lượng tồn',
          test: (quantity: any, context: any) => {
            const { inventory } = context.parent;
            if (Number(quantity) > inventory) {
              return false;
            }
            return true;
          },
        }),
      price: Validation.pattern(Regexs.number2, 'Chiết khấu không hợp lệ')
        .test(
          'validRequestPrice',
          'Giá yêu cầu phải lớn hơn 0',
          async (value, context) => {
            const numberVal = parseInt(value);
            return !(numberVal <= 0);
          }
        )
        .required('Giá yêu cầu không được để trống')
        .nullable()
        .default(''),
      discount: Validation.pattern(Regexs.number, 'Chiết khấu không hợp lệ')
        .required("Chiết khấu không được để trống")
        .test({
          name: 'total',
          message: 'Chiết khấu không được lớn hơn thành tiền',
          test: (discount: any, context: any) => {
            const { total, unit } = context.parent;
            if (unit === 1) {
              if (Number(discount) > Number(total)) {
                return false;
              }
              return true;
            } else {
              if (Number(discount) > 100) {
                return false;
              }
              return true;
            }
          },
        }),
    })
  ),
  // customer: Validation.string(),
  customerName: Validation.string(),
  discountUnit: Validation.number().default(0),
  productId: yup.array(yup.string().ensure().required('Phải có tối thiểu 1 sản phẩm được thêm').trim().required())
    .min(1, 'Bắt buộc phải có tối thiểu 1 sản phẩm')
    .required("Bắt buộc phải có tối thiểu 1 sản phẩm"),
  discountValue: Validation.string().when('discountUnit', {
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
  }),
  bankPaymentAmount: Validation.pattern(
    Regexs.numbermax,
    'Không nhập kí tự đặc biệt'
  ).optional(),
  // customerType: Validation.string(),
  // address: Validation.string(),
  // provinceId: Validation.string()

});

interface ISaleReturn {
  [key: string]: any;
}

const EditRetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const form = useForm<IForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const { fields, append, update, replace, remove } = useFieldArray({
    control: form.control,
    name: 'form',
    keyName: 'rowId',
  });

  const [, refetch] = useRefresh();
  const setNotification = useNotification();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const tablePriceIdForm = form.watch('tablePriceId');
  const listPriceWithProduct = useSelector(getPriceWithTableList);
  const listDropProducts = useSelector(getProductDropListStore);

  const [textValueSearchProduct, setTextSearchValueProduct] = useState('');
  const [customerPriceInfor, setCustomerPriceIntor] = useState<any>({})
  const [totalReturnDiscountValue, setTotalReturnDiscountValue] = useState<number>(0)
  const [listProductId, setListProductId] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(false);


  const tableRef = useRef<TableRef>(null);
  const [productListOption, setProductListOption] = useState<IProduct[]>([]);
  const [isShowAmountInput, setShowAmountInput] = useState<boolean>(false);
  const listPriceTables = useSelector(getPriceTableList);

  const fetchPriceTable = async () => {
    const idStore = form.watch('storeId');

    try {
      if (form.watch('storeId') !== null) {
        await dispatch(getListPriceTable(idStore));
      }
    } catch (error) {
    } finally {
    }
  };

  const fetchPriceWithTable = async () => {
    const body = {
      productId: listProductId,
      priceTableId: form.watch('tablePriceId'),
    };
    try {
      if (form.watch('tablePriceId') !== null) {
        await dispatch(getListPriceWithPriceTable(body));
      }
    } catch (error) {
    } finally {
    }
  };


  useEffect(() => {
    fetchPriceTable();
  }, [form.watch('storeId')]);

  const fetchPriceWithTablePrice = () => {
    if (listPriceWithProduct.length > 0) {
      const formatList: any = [];
      let objectKey: any = {};

      listPriceWithProduct.forEach((item: any) => {
        formatList[item.productId] = item;
      });

      if (tablePriceIdForm) {
        form.watch('form')?.map((item: any, index: any) => {
          const row = form.getValues(`form.${index}`);
          const checkPrice = formatList[item.productId]?.salePrice
            ? formatList[item.productId]?.salePrice
            : '0';
          update(index, {
            ...row,
            price: formatList[item.productId] ? checkPrice : '0',
          });
          form.clearErrors(`form[${index}].price`);

        })
      }
    }
  }

  useEffect(() => {
    fetchPriceWithTable();
  }, [form.watch('tablePriceId'), listProductId]);

  useEffect(() => {
    fetchPriceWithTablePrice();
  }, [
    listPriceWithProduct,
    tablePriceIdForm,
    listDropProducts
  ]);


  const handleSubmit = async (data: ISaleReturn) => {
    console.log('data', data);
    const {
      customerId,
      storeId,
      employeeSell,
      horizontalExchange,
      returnAmount,
      payNote,
      discountValue,
      discountUnit,
      accountCode,
      cash,
      accountCodeBanking,
      banking,
      form,
      continues
    } = data;
    // const update
    console.log('form', form);
    const products = form.map((item: any) => ({
      code: item.code,
      name: item.product,
      productId: item.productId,
      price: Number(item.price),
      quantity: Number(item.quantity),
      discountValue: Number(item.discount),
      discountUnit: Number(item.unit),
    }));

    console.log('products', products);


    const newParams = {
      customerId,
      storeId,
      employeeCare: "00000000-0000-0000-0000-000000000000",
      employeeSell,
      isExchange: horizontalExchange,
      returnAmount: Number(returnAmount),
      payNote,
      discountValue: Number(discountValue),
      discountUnit: Number(discountUnit),
      accountCode,
      cash: Number(cash),
      accountCodeBanking,
      banking: Number(banking),
      products
    }

    console.log('newParams', newParams);

    if (id) {
      dispatch(UpdateSaleOrderReturnApi(newParams))
        .unwrap()
        .then(() => {
          setNotification({
            message: 'Cập nhật đơn trả hàng thành công',
            severity: 'success',
          });
          navigate(continues === 1 ? '/sales/return/create' : '/sales/return');

        })
        .catch((error) => {
          setNotification({
            error: 'Lỗi khi cập nhật đơn trả hàng!',
          });
        });
      return;
    }
    try {
      setLoading(true);
      const response = await dispatch(CreateSaleOrderReturnApi(newParams));
      if (!isEmpty(response.payload)) {
        setNotification({
          message: 'Tạo mới đơn trả hàng thành công',
          severity: 'success',
        });
        // navigate('/sales/return');
        navigate(continues === 1 ? '/sales/return/create' : '/sales/return');

      } else {
        setNotification({
          error: 'Lỗi khi tạo đơn trả hàng!',
        });

        navigate(continues === 1 ? '/sales/return/create' : '/sales/return');
        // console.log('navigate(sales /return )')
      }
    } catch (error) {
      console.log('error', error);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEmpty(form.watch('storeId'))) return;
    if (id) {
      APIGetProductWarehouse(form.watch('storeId'))
        .then((res) => {
          let preWatch = form.watch();

          console.log('listProductId', listProductId);
          console.log('preW', preWatch);

          // form.reset({
          //   ...preWatch,
          //   productId: undefined,
          // })
          setProductListOption(res);
        })
        .catch((err) => console.log(err))
        .finally(() => { });
      return
    }
    APIGetProductWarehouse(form.watch('storeId'))
      .then((res) => {
        let preWatch = form.watch();

        form.reset({
          ...preWatch,
          form: [],
          productId: undefined,
        })
        setProductListOption(res);
      })
      .catch((err) => console.log(err))
      .finally(() => { });
  }, [form.watch('storeId')]);



  const onSelect = (value: string[] | null) => {
    let selected = productListOption.filter((item: any) =>
      (value || []).includes(item.id)
    );
    const removeDuplicates = selected.filter(
      (product: IProduct) =>
        !fields.some((field: any) => field.productId === product.id)
    );
    const rowId = nanoid();

    const rows = removeDuplicates.reduce((acc: any, product: any) => {
      acc.push({
        id: rowId,
        productId: product.id,
        product: product.name,
        unit: product.unit,
        quantity: '',
        price: '',
        discount: '',
        code: product.code,
      });
      setListProductId([...new Set([...listProductId, product.id])]);
      return acc;
    }, []);
    append(rows, { shouldFocus: false });
    tableRef.current?.startRowEditMode(rowId);
  };

  const handleRemoveRow = useCallback(
    (rowIndex: number, rowId: string) => () => {
      remove(rowIndex);

      if (isEmpty(form.getValues('form'))) {
        let preWatch = form.watch();
        form.reset({
          ...preWatch,
          productId: undefined,
        });
      }
      tableRef.current?.stopRowEditMode(rowId);
    },
    [remove]
  );

  const handleBlur = (e: any) => { };

  const handleCustomerInfo = (value: any) => {
    setCustomerPriceIntor(value)
  }

  const handleSetQuantityToField = useCallback(
    () => async () => {
      const quantityInput = Number(form.watch('quantityInput'));

      form.watch('form').map((item: any, index: any) => {
        const isValid = form.trigger(`form.${index}`);
        if (!isValid) return;
        const row = form.getValues(`form.${index}`);
        update(index, {
          ...row,
          quantity: quantityInput,
        });
        form.trigger(`form[${index}].quantity`);
      });
    },
    [form, update]
  );

  const handleSetAmountToField = () => {
    const moneyAmount = Number(form.watch('moneyAmount'));

    form.watch('form').map((item: any, index: any) => {
      const isValid = form.trigger(`form.${index}`);
      if (!isValid) return;
      const row = form.getValues(`form.${index}`);
      update(index, {
        ...row,
        price: moneyAmount,
      });
      form.trigger(`form[${index}].price`);
    });
  }
  var totalReturnDiscount = 0;

  const getTotal = useCallback(() => {
    const total = form.watch('form');
    const discountUnit = form.watch('discountUnit');
    const discountValue = form.watch('discountValue');
    let banking = form.watch('banking') ?? 0;
    let cash = form.watch('cash') ?? 0;

    var totalReturn = 0;
    if (!discountValue) {
      if (total) {
        for (const obj of total) {
          const quantity = parseInt(obj.quantity);
          const price = parseFloat(obj.price);
          const discount = parseFloat(obj.discount);
          const unit = obj.unit;

          let subTotal;

          if (unit === 1) {
            subTotal = quantity * price - discount;
          } else {
            subTotal = quantity * price - quantity * price * (discount / 100);
          }

          totalReturn += subTotal;
        }
      }
    } else {
      if (total) {
        for (const obj of total) {
          const quantity = parseInt(obj.quantity);
          const price = parseFloat(obj.price);
          let subTotal;
          subTotal = quantity * price;
          totalReturn += subTotal;
        }
      }
    }

    if (discountValue) {
      if (discountUnit === 1) {
        totalReturnDiscount = totalReturn - discountValue
      } else {
        totalReturnDiscount = totalReturn - (discountValue / 100) * totalReturn
      }
    } else {
      totalReturnDiscount = totalReturn
    }

    totalReturnDiscount = totalReturnDiscount - banking - cash;

    return <>{Numeral.price(totalReturnDiscount)}</>;
  }, []);

  const getLastTotal = useCallback(() => {
    const total = form.watch('form');
    const discountUnit = form.watch('discountUnit');
    const discountValue = form.watch('discountValue');
    let banking = form.watch('banking') ?? 0;
    let cash = form.watch('cash') ?? 0;

    var totalReturn = 0;
    if (!discountValue) {
      if (total) {
        for (const obj of total) {
          const quantity = parseInt(obj.quantity);
          const price = parseFloat(obj.price);
          const discount = parseFloat(obj.discount);
          const unit = obj.unit;

          let subTotal;

          if (unit === 1) {
            subTotal = quantity * price - discount;
          } else {
            subTotal = quantity * price - quantity * price * (discount / 100);
          }

          totalReturn += subTotal;
        }
      }
    } else {
      if (total) {
        for (const obj of total) {
          const quantity = parseInt(obj.quantity);
          const price = parseFloat(obj.price);
          let subTotal;
          subTotal = quantity * price;
          totalReturn += subTotal;
        }
      }
    }

    if (discountValue) {
      if (discountUnit === 1) {
        totalReturnDiscount = totalReturn - discountValue
      } else {
        totalReturnDiscount = totalReturn - (discountValue / 100) * totalReturn
      }
    } else {
      totalReturnDiscount = totalReturn
    }

    totalReturnDiscount = totalReturnDiscount - banking - cash;

    let lastTotalDebt = parseFloat(customerPriceInfor.cn) - totalReturnDiscount;

    return <>{Numeral.price(lastTotalDebt)}</>;
  }, [customerPriceInfor]);

  const handleRowEditableChange = (
    rowEditableState: Record<string, boolean>
  ) => {
    refetch();
  };

  const { filters, onSortingChange, onPageChange, onPageSizeChange } =
    useFilters();

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
    onDelete: handleRemoveRow,
    handleBlur,
    onSetAll: handleSetQuantityToField,
    setValue: form.setValue,
  });



  //Code Update
  const fetchData = useCallback(async () => {
    if (!id) {
      return;
    }
    try {
      const resultAction = await dispatch(GetSaleOrderReturnByIdApi(id));
      const response1 = unwrapResult(resultAction);

      console.log('response', response1);

      // console.log();
      const response = {
        customerId: "4f4ab8a3-270e-edab-6dfa-3a0ad5e6018d",
        customerName: "Nguyễn Linh Đan",
        address: '84 Duy Tân',
        customerPhone: '0369340318',
        storeId: "3026b918-91fa-4f6d-8d63-1b3d98f7b5ee",
        employeeCare: "3fa85f64 - 5717 - 4562 - b3fc - 2c963f66afa6",
        employeeSell: 4,
        isExchange: false,
        returnAmount: 1000,
        payNote: "trả hàng",
        discountValue: 0,
        discountUnit: 0,
        accountCode: 2,
        cash: 5000,
        accountCodeBanking: "113",
        banking: 5000,
        products: [
          {
            code: "sadly",
            name: "Seal dán lồng main 13PRM",
            productId: "0195a0ee-5d35-4321-8b9a-013461ed34132",
            price: 50000,
            quantity: 1,
            discountValue: 1000,
            discountUnit: 1
          },
          {
            code: "sadly",
            name: "ihpone",
            productId: "3d1f4c16-4614-4f31-9c7e-0b5906c05917s",
            price: 50000,
            quantity: 1,
            discountValue: 1000,
            discountUnit: 1
          }
        ],
      }
      const productIdArray = response.products.map(product => product.productId);

      if (response.products) {
        setListProductId([...new Set([
          ...listProductId,
          response.products.map((item: any) => item.productId)
        ])
        ].flat());
      }

      const {
        customerId,
        customerName,
        address,
        customerPhone,
        storeId,
        employeeSell,
        isExchange,
        returnAmount,
        payNote,
        discountValue,
        discountUnit,
        accountCode,
        cash,
        accountCodeBanking,
        banking,
        products,
      } = response;
      console.log('products', products);
      const fakeForm = [
        {
          id: "vxGCN4Q3QTt5H_D1uxBbc",
          productId: "0e8d36e9-e07d-48d4-81df-011d4c3da238",
          product: "SH 150i",
          unit: 1,
          quantity: "1",
          price: "11",
          discount: "1",
          code: "VZ7GHO",
          total: 11
        },
        {
          id: "vxGCN4Q3QTt5H_D1uxB1",
          productId: "0e8d36e9-e07d-48d4-81df-011d4c3da2218",
          product: "Vỏ 7G Hồng Zin",
          unit: 1,
          quantity: "1",
          price: "11",
          discount: "1",
          code: "VZ7GHO",
          total: 11
        }
      ]

      const rowId = nanoid();
      const tableValues = fakeForm.map(
        (item: any, index: any) => ({
          id: rowId,
          productId: item.productId,
          product: item.product,
          unit: item.unit,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
          code: item.code,
          total: item.total,
          // code: item.code,
          // name: item.product,
          // productId: item.productId,
          // price: Number(item.price),
          // quantity: Number(item.quantity),
          // discountValue: Number(item.discount),
          // discountUnit: Number(item.unit),
          // id: rowId,
          // productId: product.id,
          // product: product.name,
          // unit: product.unit,
          // quantity: '',
          // price: '',
          // discount: '',
          // code: product.code,
        })
      ) as TableSaleReturn[];

      form.reset({
        storeId,
        customerId,
        customerName,
        address,
        customerPhone,
        employeeSell,
        isExchange,
        returnAmount,
        payNote,
        discountValue,
        discountUnit,
        accountCode,
        cash,
        accountCodeBanking,
        banking,
        productId: tableValues.length > 0 ? [tableValues[0].productId] : [""],
        form: tableValues,
        tablePriceId: '9b8ead34-702a-4d37-8674-bc04ab565297'
      });
      tableValues.forEach((_item) => {
        tableRef.current?.startRowEditMode(_item.id);
      });
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, id, form]);

  useEffect(() => {
    fetchData();
  }, [fetchData, id]);


  return (
    <PageWrapper title={id ? 'Sửa trả hàng không cần hóa đơn' : 'Trả hàng không cần hóa đơn'}>
      <PageBreadcrumbs
        title={id ? 'Sửa trả hàng không cần hóa đơn' : 'Trả hàng không cần hóa đơn'}
        items={[{ link: '/sales', text: 'Bán hàng' }]}
      />
      <ProForm
        form={form}
        onFinish={handleSubmit}
        PaperProps={{ sx: { p: 2, background: '#fff' } }}
      >
        <Grid container spacing={2} sx={{ paddingTop: '5px' }}>
          <Grid item xs={12} md={8} lg={8}>
            {/* info */}
            <Information />
            {/* end info */}

            {/* endCustomer */}
            <Box
              sx={{
                border: '1px solid #E6E8F0',
                marginBottom: '10px',
                padding: '5px',
              }}
            >
              {/* customer */}
              <Grid container>
                <Grid item xs={12} md={2}>
                  <Box sx={{ display: 'flex', padding: '10px' }}>
                    <PersonIcon />
                    Khách hàng
                  </Box>
                </Grid>
                <Grid item xs={12} md={10} spacing={2} container alignContent={'center'}>
                  <Grid item xs={2}>
                    <Typography
                      gutterBottom
                      variant="subtitle2"
                      sx={{ color: 'primary.main' }}
                    >
                      GHCN: {customerPriceInfor.ghcn || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      gutterBottom
                      variant="subtitle2"
                      sx={{ color: 'primary.main' }}
                    >
                      Tổng: {getTotal()}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography gutterBottom variant="subtitle2">
                      CN: {customerPriceInfor.cn || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      gutterBottom
                      variant="subtitle2"
                      sx={{ color: 'primary.main' }}
                    >
                      CN cuối: {getLastTotal()}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Box>
                <Divider />
              </Box>


              <Customer handleCustomerInfo={handleCustomerInfo} />
            </Box>

            <Box sx={{ border: '1px solid #E6E8F0', marginBottom: '10px' }}>
              <Grid container spacing={1} sx={{ padding: '10px' }}>
                <Grid item xs={2} sm={2} md={2} lg={2}>
                  {/* <Box sx={{ display: 'flex' }}>
                    <TokenIcon />
                    Sản phẩm
                  </Box> */}
                  <TextField
                    value="Sản phẩm"
                    disabled
                    sx={{
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#000000',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={5} sm={10} md={10} lg={5}>
                  {/* <TextField
                      id="outlined-basic"
                      variant="outlined"
                      placeholder="(F3) Gõ tên, mã sản phẩm hoặc dùng đầu đọc mã vạch"
                    /> */}
                  <ProFormMultiAutocomplete
                    name="productId"
                    options={productListOption}
                    renderValue={(item) => item.id}
                    renderLabel={(item) => `${item.code} - ${item.name}`}
                    placeholder={'(F3) Gõ tên, mã sản phẩm hoặc dùng đầu đọc mã vạch'}
                    onSelect={onSelect}
                    sx={{
                      background: 'white',
                      '.MuiInputBase-input': { fontSize: 14, cursor: 'pointer' },

                    }}
                  // validate={Validation.selectAutocompleteMulti().required(
                  //   'Phải có tối thiểu 1 sản phẩm được thêm'
                  // )}
                  />
                </Grid>
                {isShowAmountInput && (
                  <Grid item xs={2} md={2}>
                    <ProFormTextField
                      name="moneyAmount"
                      placeholder="Số tiền"
                      onBlur={handleSetAmountToField}
                      InputProps={{
                        inputComponent: PriceDecimalInput,
                        sx: {
                          '& .MuiInputBase-input': {
                            padding: '8.5px 14px !important',
                          },
                        },
                      }}
                    />
                  </Grid>
                )}
                <ActionIconButton
                  actionType="scan"
                  onClick={() => setShowAmountInput(!isShowAmountInput)}
                />
                <Grid item xs={3} md={2}>
                  <ProFormAutocompleteSingal
                    name="tablePriceId"
                    placeholder="Bảng giá"
                    options={listPriceTables}
                    renderLabel={(option) => option.name}
                    renderValue={(option) => option.id}
                  />
                </Grid>
              </Grid>
              <Box>
                <ProTable<TableSaleReturn>
                  loading={loading}
                  columns={columns}
                  ref={tableRef}
                  data={fields}
                  onSortingChange={onSortingChange}
                  onRowEditableChange={handleRowEditableChange}
                  refetch={refetch}
                  getRowId={(row) => row.id}
                  initialstate={{
                    hiddenColumns: [],
                    hiddenVisibilityColumns: true,
                  }}
                  form={form}
                  editable
                  hideFooter={true}

                />
              </Box>
              {/* <ProductTable /> */}
            </Box>
          </Grid>
          <Grid item xs={12} md={4} lg={4} sx={{ fontSize: '14px' }}>
            {/* tag */}
            <Tag form={form} />
            {/* end tag */}
            {/* payment */}
            <Payment form={form} />
            {/* end payment */}

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ActionButton
                sx={{ marginRight: 1 }}
                iconPosition="start"
                type="submit"
                color="success"
              >
                {t('Lưu')}
              </ActionButton>
              <ActionButton
                sx={{ marginRight: 1 }}
                iconPosition="start"
                actionType="print"
                color="info"
              >
                {t('Lưu và in hóa đơn')}
              </ActionButton>
              <ActionButton
                iconPosition="start"
                actionType="print"
                color="info"
              >
                {t('Lưu và in kèm thẻ kho')}
              </ActionButton>
            </Box>
          </Grid>
        </Grid>
      </ProForm >
    </PageWrapper >
  );
};

export default EditRetail;
