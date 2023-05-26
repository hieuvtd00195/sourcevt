import { yupResolver } from '@hookform/resolvers/yup';
import { TabContext, TabPanel } from '@mui/lab';
import { Box, Grid, Modal, Typography } from '@mui/material';
import ProForm from 'components/ProForm';
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
  InputHTMLAttributes,
} from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import Validation from 'utils/Validation';
import SelectedStoreDialog from './SelectedStoreDialog';
import * as yup from 'yup';
import BillSale from './BillSale';
import Header from './components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import useNotification from 'hooks/useNotification';
import {
  getListStoreApplication,
  getStoreApplicationList,
} from 'slices/storeApplication';
import ProFormLabel from 'components/ProForm/ProFormLabel';
import ProFormSelect from 'components/ProForm/ProFormSelect';
import ProFormMultiAutocomplete from 'components/ProTable/core/EditableCell/ProFormMultiAutocomplete';
import ProFormAutocompleteSingal from 'components/ProForm/ProFormAutocompleteSingal';
import Divider from '@mui/material/Divider';
import ActionButton from 'components/ProButton/ActionButton';
import { TableRef, TableRefParent } from 'components/ProTable/types/refs';
import { lazy } from 'yup';
import Regexs from 'utils/Regexs';
import {
  createBillCustomer,
  getBillCustomerById,
  getBillCustomerDetail,
  getChildProductById,
  getListProductDrop,
  getListStoreByUser,
  getProductDropListStore,
  getStoreByUser,
  updateBillCustomer,
} from 'slices/billCustomerApplicationSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { unwrapResult } from '@reduxjs/toolkit';
import LoadingOverlay from 'components/ProTable/core/LoadingOverlay';
import isEqual from 'lodash.isequal';

interface IForm {}
interface TableCreateProducts {
  [key: string]: any;
}
interface ISaleRetail<TableCreateProducts> {
  [key: string]: any;
}

const DATA = [
  {
    id: '1',
    image: 'image',
    product: 'Sản phẩm',
    inventory: 'ĐVT',
    price: 25000,
    amount: 2,
    payment: 50000,
    discount: 10,
    total: 50000,
  },
  {
    id: '2',
    image: 'image',
    product: 'Sản phẩm',
    inventory: 'ĐVT',
    price: 25000,
    amount: 2,
    payment: 50000,
    discount: 10,
    total: 50000,
  },
  {
    id: '3',
    image: 'image',
    product: 'Sản phẩm',
    inventory: 'ĐVT',
    price: 25000,
    amount: 2,
    payment: 50000,
    discount: 10,
    total: 50000,
  },
];

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height: 250,
  bgcolor: 'background.paper',
  border: '2px solid #ffffff',
  boxShadow: 24,
};

const schema = Validation.shape({
  storeId: Validation.string()
    .required('Cửa hàng không được để trống')
    .default(null),
  productBonus: yup.array().of(yup.object().shape({})),
  form: yup.array().of(
    yup.object().shape({
      price: Validation.pattern(Regexs.number2, 'Giá yêu cầu không hợp lệ')
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
      quantity: Validation.pattern(Regexs.number, 'Số lượng không hợp lệ')
        .required()
        .when('$billPayStatus', (billPayStatus: any, schema: any) => {
          if (Number(billPayStatus) === 2) {
            return schema.test({
              name: 'quantity',
              message: 'Không được lớn hơn số lượng tồn',
              test: (quantity: any, context: any) => {
                const { inventory } = context.parent;
                if (Number(quantity) > inventory) {
                  return false;
                }
                return true;
              },
            });
          }
        }),

      productChildren: yup.array().of(
        yup.object().shape({
          price: Validation.pattern(Regexs.number2, 'Giá yêu cầu không hợp lệ')
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
          quantity: Validation.pattern(Regexs.number, 'Số lượng không hợp lệ')
            .required()
            .when('$billPayStatus', (billPayStatus: any, schema: any) => {
              if (Number(billPayStatus) === 2) {
                return schema.test({
                  name: 'quantity',
                  message: 'Không được lớn hơn số lượng tồn',
                  test: (quantity: any, context: any) => {
                    const { inventory } = context.parent;
                    if (Number(quantity) > inventory) {
                      return false;
                    }
                    return true;
                  },
                });
              }
            }),

          // .test({
          //   name: 'quantity',
          //   message: 'Không được lớn hơn số lượng tồn',
          //   test: (quantity: any, context: any) => {
          //     const { inventory,customerBillPayStatus } = context.parent;
          //     if (Number(quantity) > inventory) {
          //       return false;
          //     }
          //     return true;
          //   },
          // }),
        })
      ),
      productBonus: yup.array().of(yup.object().shape({})),
    })
  ),
  note: Validation.string().optional(),
  bankPaymentAmount: Validation.pattern(
    Regexs.numbermax,
    'Không nhập kí tự đặc biệt'
  ).optional(),
  customerId: Validation.string().optional().default(null),
  customerName: Validation.string().required(
    'Tên khách hàng không được để trống'
  ),
  customerPhone: Validation.string().required(
    'Số điện thoại khách hàng không được để trống'
  ),
  customerType: Validation.string()
    .required('Loại khách hàng không được để trống')
    .default('0'),
  // ghcn: Validation.string().required('Loại khách hàng không được để trống').default('0'),
  // tablePriceId: Validation.string().optional().default(null),
  address: Validation.string().required('Địa chỉ không được để trống'),
  provinceId: Validation.string().required('Thành phố không được để trống'),
  discountTypeHeader: Validation.number().default(0),
  costPrice: Validation.number().default(0),
  discountValueHeader: Validation.string().when('discountTypeHeader', {
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
  customerBillPayStatus: Validation.string().required(
    'Trạng thái không được để trống'
  ),
  discountUnit: Validation.number().optional().default(0),
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
            'Chiết khấu không thể lớn hơn 99%'
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
  vatUnit: Validation.number().optional().default(0),
  vatValue: Validation.string().when('vatUnit', {
    is: 0,
    then: (schema) =>
      lazy((values: any) => {
        if (Number(values) < 0) {
          return Validation.pattern(
            Regexs.numbermax,
            'Vat phải lớn hơn 0'
          ).optional();
        }
        if (Number(values) > 99) {
          return Validation.pattern(
            Regexs.numbermax,
            'Vat không thể lớn hơn 99%'
          ).optional();
        }
        return Validation.pattern(
          Regexs.numbermax,
          'Không nhập kí tự đặc biệt'
        ).optional();
      }),
    otherwise: (schema) =>
      Validation.pattern(Regexs.number2, 'Vat VND không hợp lệ')
        .optional()
        .nullable()
        .default(''),
  }),
});

const Index = () => {
  const { id, billPayStatus } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const setNotification = useNotification();
  const tableRefParent = useRef<TableRefParent>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const storeByUser = useSelector(getListStoreByUser);
  const detailCustomerBill = useSelector(getBillCustomerDetail);
  const listDropProducts = useSelector(getProductDropListStore);
  const [idSave, setIdSave] = useState(0);
  const [listChildProductById, setlistChildProductById] = useState<
    TableCreateProducts[]
  >([]);

  const form = useForm<ISaleRetail<TableCreateProducts>>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
    context: { billPayStatus: billPayStatus },
  });
  const customerType = form.watch('customerType');
  const customerId = form.watch('customerId');
  const [tab, setTab] = useState<string>('0');
  const [ids, setIds] = useState<{ id: number; name: string }[]>([
    { id: 0, name: '1' },
  ]);
  const [saveValue, setSaveVaLe] = useState<any[]>([
    { ...schema.getDefault(), id: '0' },
  ]);

  const [open, setOpen] = useState(id ? false : true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openDialogSelectedStore, setOpenDialogSelectedStore] =
    useState<boolean>(false);

  const fetchMasterDataProducts = async () => {
    const idStore = form.watch('storeId');
    const customerType = form.watch('customerType');

    const body = {
      StoreId: idStore,
      customerType: customerId ? customerType : null,
    };
    try {
      if (form.watch('storeId') !== null) {
        const responseD = await dispatch(getListProductDrop(body));
      }
    } catch (error) {
    } finally {
    }
  };
  useEffect(() => {
    fetchMasterDataProducts();
  }, [form.watch('storeId'), customerType, customerId]);

 

  const fetchData = useCallback(async () => {
    if (!id) {
      return;
    }
    try {
      const resultAction: any = await dispatch(getBillCustomerById(id));
      const response = unwrapResult(resultAction);

      const {
        billCustomerId,
        debtLimit,
        customerName,
        customerType,
        provinceId,
        customerPhone,
        address,
        note,
        noteForProductBonus,
        billCustomerProducts,
        customerId,
        storeId,
        employeeNote,
        tablePriceId,
        employeeCare,
        employeeSell,
        vatValue,
        vatUnit,
        discountValue,
        discountUnit,
        customerBillPayStatus,
        cash,
        banking,
        coupon,
        payNote,
        accountCode,
        accountCodeBanking,
        transportForm,
        transportDate,
        cod,
        productName,
      } = response.data;

      let ArrPRC: any = [];
      let ArrBody: any = [];
      let ArrBN: any = [];

      billCustomerProducts.forEach((item: TableCreateProducts, index: any) => {
        if (Number(item.quantity) > 0) {
          if (item.productChildren.length > 0) {
            const prCList = item.productChildren.map((prC: any) => {
              return {
                id: prC.id,
                productId: prC.productId,
                price: Number(prC.price),
                quantity: Number(prC.quantity),
                discountValue: Number(prC.discountValue),
                discountUnit: Number(prC.discountUnit),
                productName: prC.productName,
                parentIndex: index,
                inventory: prC.inventory,
                costPrice: prC.costPrice,
              };
            });
            ArrPRC = prCList;
          }
          if (item.productBonus.length > 0) {
            const prCList = item.productBonus.map((prB: any) => ({
              productId: prB.productId,
              quantity: Number(prB.quantity),
              isDebt: prB.isDebt,
            }));
            ArrBN = prCList;
          }
          return ArrBody.push({
            id: item.id,
            productId: item.productId,
            price: Number(item.price),
            quantity: Number(item.quantity),
            discountValue: item.discountValue,
            discountUnit: item.discountUnit,
            productName: item.productName,
            inventory: item.inventory,
            costPrice: item.costPrice,
            productChildren: ArrPRC,
            productBonus: ArrBN,
          });
        }
      });

      form.reset({
        billCustomerId,
        debtLimit,
        storeId,
        customerPhone,
        customerId,
        customerName,
        customerType,
        provinceId,
        address,
        note,
        noteForProductBonus,
        tablePriceId,
        employeeNote,
        employeeCare,
        employeeSell,
        vatValue,
        vatUnit,
        discountValue,
        discountUnit,
        customerBillPayStatus,
        cash,
        banking,
        coupon,
        payNote,
        accountCode,
        accountCodeBanking,
        transportForm,
        transportDate,
        cod,
        form: ArrBody,
      });
    } catch (error) {
      console.log(error);
    } finally {
      // setLoading(false)
    }
  }, [dispatch, form, id, listDropProducts]);

  useEffect(() => {
    fetchData();
  }, [fetchData, id, listDropProducts]);
  
  const fetchDataStoreApplication = async () => {
    try {
      await dispatch(getStoreByUser({}));
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    if(storeByUser && storeByUser.length >0) {
      form.setValue('storeId', storeByUser[0].id)
    }
  },[storeByUser])
  // const fetchDataStoreByUser = async () => {
  //   try {
  //     await dispatch(getStoreByUser({}));
  //   } catch (error) {
  //   } finally {
  //   }
  // };
  useLayoutEffect(() => {
    fetchDataStoreApplication();
  }, []);

  function findIndex(
    property: any,
    arr: any[],
    value: string | number | boolean
  ): number {
    let index: number = 0;
    for (let i = 0; i <= arr.length; i++) {
      if (arr[i][property] === value) {
        index = i;
        return i;
      }
    }
    return index;
  }

  const handleRemoveTabF = (id: number) => {
    // let index = ids.indexOf(id);
    let index = findIndex('id', ids, id);
    if (index > -1 && ids.length > 1) {
      // const idNext = index !== 0 ? index - 1 : 0;
      let cloneIds = [...ids];
      cloneIds.splice(index, 1);
      const saveValueAfterDelete = [
        ...saveValue.filter((it) => it.id !== id.toString()),
      ].map((item: any) => ({
        ...item,
        id:
          Number(item.id) > index ? (Number(item.id) - 1).toString() : item.id,
      }));
      setSaveVaLe(saveValueAfterDelete);
      // const formatIds = [...cloneIds.map(id => id > index ? id - 1 : id)]
      const formatIds = [
        ...cloneIds.map((item) => ({
          ...item,
          id: item.id > index ? item.id - 1 : item.id,
        })),
      ];
      setIds(formatIds);
      if (tab === index.toString()) {
        const targetTab =
          index >= formatIds.length
            ? formatIds[formatIds.length - 1].id.toString()
            : formatIds[index].id.toString();
        setTab(targetTab);
        const findForm = saveValueAfterDelete.find(
          (f: any) => f?.id === targetTab
        );
        if (findForm) {
          form.reset({ ...findForm });
        } else {
          form.reset({ ...schema.getDefault() });
        }
      } else {
        // let findNewIndex = cloneIds.indexOf(findId);
        setTab(Number(tab) > index ? (Number(tab) - 1).toString() : tab);
        // const findForm = saveValueAfterDelete.find((f: any) => f?.id === findNewIndex.toString());
        // if (findForm) {
        //   form.reset({ ...findForm });
        // } else {
        //   form.reset({ ...schema.getDefault() });
        // }
      }
    }
  };

  const handleSubmit = async (data: any) => {
    let ArrBody: any = [];
    let ArrPRC: any = [];
    let ArrBN: any = [];

    data.form.forEach((item: TableCreateProducts) => {
      if (Number(item.quantity) > 0) {
        if (item.productChildren.length > 0) {
          const prCList = item.productChildren.map((prC: any) => ({
            productId: prC.productId,
            price: Number(prC.price),
            quantity: Number(prC.quantity),
            discountValue: Number(prC.discountValue),
            discountUnit: Number(prC.discountUnit),
            costPrice: prC.costPrice,
          }));
          ArrPRC = prCList;
        }
        if (item.productBonus.length > 0) {
          const prCList = item.productBonus.map((prB: any) => ({
            productId: prB.productId,
            quantity: Number(prB.quantity),
            isDebt: prB.isDebt,
          }));
          ArrBN = prCList;
        }
        return ArrBody.push({
          productId: item.productId,
          price: Number(item.price),
          quantity: Number(item.quantity),
          discountValue: item.discountValue,
          discountUnit: item.discountUnit,
          costPrice: item.costPrice,
          productChildren: ArrPRC,
          productBonus: ArrBN,
        });
      }
    });
    const body = {
      code: '',
      customerId: data.customerId,
      storeId: data.storeId,
      employeeNote: data.employeeNote,
      tablePriceId: data.tablePriceId,
      employeeCare: data.employeeCare,
      employeeSell: data.employeeSell,
      vatValue: Number(data.vatValue),
      vatUnit: Number(data.vatUnit),
      discountValue: Number(data.discountValue),
      discountUnit: Number(data.discountUnit),
      customerBillPayStatus: Number(data.customerBillPayStatus),
      cash: Number(data.cash),
      banking: Number(data.banking),
      coupon: 0,
      payNote: data.payNote,
      accountCode: data.accountCode,
      accountCodeBanking: data.accountCodeBanking,
      transportForm: Number(data.transportForm),
      transportDate: data.transportDate,
      cod: true,
      customerName: data.customerName,
      customerType: Number(data.customerType),
      provinceId: data.provinceId,
      customerPhone: data.customerPhone,
      address: data.address,
      note: data.note,
      noteForProductBonus: data.noteForProductBonus,
      billCustomerProducts: ArrBody,
    };

    try {
      if (id) {
        const bodyParams = {
          id: id,
          bodyParamsUpdate: body,
        };
        const responseUpdate: any = await dispatch(
          updateBillCustomer(bodyParams)
        );
        if (responseUpdate.payload.httpStatusCode === 200) {
          setNotification({
            message: 'Cập nhật đơn hàng thành công',

            severity: 'success',
          });
          navigate(`/sales/retail`);
        } else {
          setNotification({
            error: 'Cập nhật đơn hàng thất bại',
          });
        }
      } else {
        const response: any = await dispatch(createBillCustomer(body));

        if (response.payload.httpStatusCode === 200) {
          setNotification({
            message: 'Tạo mới đơn hàng thành công',

            severity: 'success',
          });
          if (ids.length === 1) {
            navigate(`/sales/retail`);
          }
          handleRemoveTabF(idSave);
        } else {
          setNotification({
            error: 'Tạo mới đơn hàng thất bại',
          });
        }
      }

      // }
    } catch (error) {
      console.log('error', error);
    } finally {
    }
  };
  const onSaveCustomer = (data: any) => {};

  const handleAddTab = () => {
    setIds([
      ...ids,
      {
        id: ids[ids.length - 1].id + 1,
        name: (Number(ids[ids.length - 1].name) + 1).toString(),
      },
    ]);
    setSaveVaLe([
      ...saveValue,
      { ...schema.getDefault(), id: saveValue.length.toString() ,storeId: form.watch('storeId')},
    ]);
  };
  const handleRemoveTab = (e: any, id: number) => {
    e.stopPropagation();
    let index = findIndex('id', ids, id);
    if (index > -1 && ids.length > 1) {
      let cloneIds = [...ids];
      cloneIds.splice(index, 1);
      const saveValueAfterDelete = [
        ...saveValue.filter((it) => it.id !== id.toString()),
      ].map((item: any) => ({
        ...item,
        id:
          Number(item.id) > index ? (Number(item.id) - 1).toString() : item.id,
      }));
      setSaveVaLe(saveValueAfterDelete);
      const formatIds = [
        ...cloneIds.map((item) => ({
          ...item,
          id: item.id > index ? item.id - 1 : item.id,
        })),
      ];
      if (tab === index.toString()) {
        const targetTab =
          index >= formatIds.length
            ? formatIds[formatIds.length - 1].id.toString()
            : formatIds[index].id.toString();

        setTab(targetTab);
        const findForm = saveValueAfterDelete.find(
          (f: any) => f?.id === targetTab
        );
        if (findForm) {
          form.reset({ ...findForm });
        } else {
          form.reset({ ...schema.getDefault() });
        }
      } else {
        setTab(Number(tab) > index ? (Number(tab) - 1).toString() : tab);
      }
      setIds(formatIds);
    }
  };

  const addItem = () => {};

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setIdSave(Number(newValue));
    const findItem = saveValue.find((item: any) => item.id === tab);
    if (!findItem) {
      setSaveVaLe([...saveValue, { ...form.watch(), id: tab }]);
    }
    setSaveVaLe(
      saveValue.map((it: any) => {
        if (it.id === tab) {
          return { ...form.watch(), id: tab };
        } else {
          return it;
        }
      })
    );

    setTab(newValue);
    const findForm = saveValue.find((f: any) => f?.id === newValue);

    if (findForm) {
      form.reset({ ...findForm });
    } else {
      form.reset({ ...schema.getDefault() });
    }
  };

  useEffect(() => {
    tableRefParent.current?.onExpandedOpen();
  }, [tab, id]);


  const handleChooseStore = () => {
    handleClose();
  };

  return (
    <ProForm form={form} onFinish={handleSubmit} PaperProps={{ sx: { p: 2 } }}>
      <LoadingOverlay visible={loading} />
      <Grid>
        <TabContext value={tab}>
          <Header
            tab={tab}
            ids={ids}
            handleAddTab={handleAddTab}
            handleRemoveTab={handleRemoveTab}
            handleChange={handleChange}
            addItem={addItem}
            openDialogSelectedStore={() => {
              setOpenDialogSelectedStore(!openDialogSelectedStore);
            }}
          />
          {ids.map((item, index) => {
            return (
              <React.Fragment key={item.id + 'id-item'}>
                <TabPanel
                  value={index.toString()}
                  sx={{ padding: '0 24px 24px 24px' }}
                >
                  <BillSale ref={tableRefParent} />
                </TabPanel>
              </React.Fragment>
            );
          })}
        </TabContext>
      </Grid>
      <SelectedStoreDialog
        open={openDialogSelectedStore}
        onClose={() => {
          setOpenDialogSelectedStore(!openDialogSelectedStore);
        }}
      />
      {/* <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ outline: 'none' }}
      >
        <Box sx={style} style={{ outline: 'none' }}>
          <Grid sx={{ pl: 2, pr: 2, pt: 1.5, pb: 1.5 }}>
            <Typography style={{ fontSize: 18, fontWeight: 500 }}>
              {' '}
              Chọn cửa hàng
            </Typography>
          </Grid>
          <Divider />
          <Grid item xs={12} container sm={12} md={12} lg={12} sx={{ p: 4 }}>
            <Grid item xs={3} alignContent="center">
              Cửa hàng:
            </Grid>
            <Grid item xs={9} alignContent="center">
              <ProFormAutocompleteSingal
                {...form.register('storeId')}
                name="storeId"
                options={storeApplicationList}
                renderLabel={(option) => option?.name}
                renderValue={(option) => option?.id}
                placeholder={''}
                // onSelect={handleClose}
              />
            </Grid>
          </Grid>
          <Grid
            container
            item
            xs={12}
            md={12}
            sx={{ p: 3, pr: 4 }}
            justifyContent={'flex-end'}
          >
            <ActionButton
              onClick={async () => {
                const isValid = await form.trigger('storeId');
                if (isValid) {
                  handleChooseStore();
                }
              }}
            >
              Chọn
            </ActionButton>
          </Grid>
        </Box>
      </Modal> */}
    </ProForm>
  );
};

export default Index;
