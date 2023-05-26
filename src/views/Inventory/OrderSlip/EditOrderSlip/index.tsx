import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
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
import { PriceInput } from 'plugins/NumberFormat';
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
import {
  IDataSaleOrderLines,
  IEditOrderSlip,
  ISumTotalPrice,
} from './utils/types';

const EditOrderSlip = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const setNotification = useNotification();
  const [, refetch] = useRefresh();

  const saleOrderbyId = useSelector(getSaleOrderbyId);
  const productApplicationList = useSelector(getProductApplicationList);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingBTN, setLoadingBTN] = useState<boolean>(false);

  const [productOption, setProductOption] = useState<IDataProductApplication[]>(
    []
  );
  const [saleOrderDetail, setSaleOrderDetail] = useState<SaleOrder | null>(
    null
  );
  const [saleOrderLineDefault, setSaleOrderLineDefault] = useState<
    IDataSaleOrderLines[]
  >([]);
  const [saleOrderLineTable, setSaleOrderLineTable] = useState<
    IDataSaleOrderLines[]
  >([]);
  const [saleOrderLineSelected, setSaleOrderLineSelected] = useState<
    IDataSaleOrderLines[]
  >([]);
  const [sumTotalPrice, setSumTotalPrice] = useState<ISumTotalPrice>({
    sumTotalPriceNDT: 0,
    sumTotalPrice: 0,
  });
  const [saleOrderLineDeleteDefault, setSaleOrderLineDeleteDefault] = useState<
    IDataSaleOrderLines[]
  >([]);

  const form = useForm<IEditOrderSlip<IDataSaleOrderLines>>({
    mode: 'onChange',
    defaultValues: {
      saleOrderLines: [],
    },
  });

  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: 'saleOrderLines',
  });

  const fetchDataProductApplication = async () => {
    try {
      await dispatch(getListProductApplication({}));
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
      const response = await dispatch(GetSaleOrderByIdApi(id));
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
    fetchDataProductApplication();
    fetchDataById();
  }, [id]);

  useEffect(() => {
    setProductOption(productApplicationList);
    setSaleOrderDetail(saleOrderbyId);
  }, [productApplicationList, saleOrderbyId]);

  useEffect(() => {
    let sumTotalPriceNDT = 0;
    let sumTotalPrice = 0;
    saleOrderLineTable.forEach((item) => {
      sumTotalPriceNDT += item.totalPriceNDT ?? 0;
      sumTotalPrice += item.totalPrice ?? 0;
    });
    const dataSum = {
      sumTotalPriceNDT: sumTotalPriceNDT,
      sumTotalPrice: sumTotalPrice,
    };
    setSumTotalPrice(dataSum);
  }, [saleOrderLineTable]);

  useEffect(() => {
    if (productOption && productOption.length !== 0 && saleOrderDetail) {
      // clone data
      const rateVal = saleOrderDetail.rate ?? 0;
      const dataSaleOrderLine = saleOrderDetail?.saleOrderLineDetailDtos?.map(
        (item) => {
          const totalPriceNDTVal =
            parseFloat(item.requestPrice ?? '0') *
            parseFloat(item.requestQuantity ?? '0');
          const totalPriceVal = rateVal * totalPriceNDTVal;
          return {
            id: item.id,
            code: item.code,
            productId: item.productId,
            productName: item.productName,
            requestQuantity: item.requestQuantity ? item.requestQuantity : '0',
            importQuantity: item.importQuantity,
            requestPrice: item.requestPrice ? item.requestPrice : '0',
            suggestedPrice: item.suggestedPrice ? item.suggestedPrice : '0',
            totalPriceNDT: totalPriceNDTVal ? totalPriceNDTVal : 0,
            totalPrice: totalPriceVal ? totalPriceVal : 0,
            isDelete: false,
            isDefault: true,
          };
        }
      );

      console.log('dataSaleOrderLine', dataSaleOrderLine);


      const dataReset = {
        code: saleOrderDetail.code,
        supplierName: saleOrderDetail.supplierName,
        storeName: saleOrderDetail.storeName,
        rate: saleOrderDetail.rate,
        //=====
        id: saleOrderDetail.id,
        productId: [],
        package: saleOrderDetail?.packageRes,
        invoiceNumber: saleOrderDetail.invoiceNumber,
        orderDate: saleOrderDetail.orderDate,
        note: saleOrderDetail.note,
        saleOrderLines: dataSaleOrderLine,
      };
      setSaleOrderLineTable(dataSaleOrderLine ?? []);
      setSaleOrderLineDefault(dataSaleOrderLine ?? []);
      // reset form data
      form.reset(dataReset);
    }
  }, [productOption, saleOrderDetail]);

  // Select product
  const onSelectProduct = (arrId: string[] | number[] | null) => {
    if (arrId && arrId.length !== 0) {
      const arr = saleOrderLineTable.map((item) => item);
      arrId.forEach((item) => {
        const result = productOption.find((value) => value.id === item);
        const newArrAdd = {
          id: null,
          code: result?.code ?? '',
          productId: result?.id ?? '',
          productName: result?.name ?? '',
          requestQuantity: '',
          importQuantity: 0,
          requestPrice: '',
          suggestedPrice: '',
          totalPriceNDT: 0,
          totalPrice: 0,
          isDelete: false,
          isDefault: false,
        };

        arr.push(newArrAdd);
        append(newArrAdd);
      });

      setSaleOrderLineTable(arr);
      form.setValue('productId', []);
    } else {
      setSaleOrderLineTable([]);
    }
  };

  // handle delete
  const handleDeleteRow = (index: number, value: any) => {
    const idVal = value?.id ?? '';
    const idProductVal = value?.productId ?? '';
    const idDefault = saleOrderLineDefault.map((item) => item.id);
    const productIdDefault = saleOrderLineDefault.map((item) => item.productId);
    const isDeleteDefault =
      productIdDefault.includes(idProductVal) && idDefault.includes(idVal);

    const dataRemove = saleOrderLineTable.map((item) => item);
    dataRemove.splice(index, 1);
    remove(index);
    setSaleOrderLineTable(dataRemove);

    if (isDeleteDefault) {
      const newDataDefault = saleOrderLineDefault.filter(
        (item) => item.productId !== idProductVal
      );
      let dataDeleteDefault = saleOrderLineDefault.filter(
        (item) => item.productId === idProductVal
      );
      dataDeleteDefault = dataDeleteDefault.map((item) => {
        return {
          ...item,
          isDelete: true,
        };
      });

      setSaleOrderLineDeleteDefault((state) => {
        return state.concat(dataDeleteDefault);
      });
      setSaleOrderLineDefault(newDataDefault);
    }
  };

  // handle total
  const handleChangeTotal = () => {
    const rateVal = form.getValues('rate') ?? 0;
    const saleOrderLinesGetValue = form.getValues('saleOrderLines');
    const newSaleOrderLines = saleOrderLinesGetValue.map((item) => {
      const totalPriceNDTVal =
        parseFloat(item?.requestPrice ?? '0') *
        parseFloat(item?.requestQuantity ?? '0');
      const totalPriceVal = rateVal * totalPriceNDTVal;
      return {
        ...item,
        totalPriceNDT: totalPriceNDTVal ? totalPriceNDTVal : 0,
        totalPrice: totalPriceVal ? totalPriceVal : 0,
      };
    });

    setSaleOrderLineTable(newSaleOrderLines);
  };

  // Submit form
  const handleSubmit = async (data: IEditOrderSlip<IDataSaleOrderLines>) => {
    if (saleOrderLineTable.length === 0) {
      setNotification({
        error: 'Cần ít nhất 1 sản phẩm để cập nhật phiếu đặt hàng!',
      });
      return;
    }

    const isDeleteDefault = saleOrderLineDeleteDefault.length !== 0;
    const saleOrderLineDeleteDefautl = isDeleteDefault
      ? saleOrderLineDeleteDefault.map((item) => {
        return {
          id: item.id,
          productId: item.productId,
          requestQuantity: parseFloat(item?.requestQuantity ?? '0'),
          requestPrice: parseFloat(item?.requestPrice ?? '0'),
          suggestedPrice: parseFloat(item?.suggestedPrice ?? '0'),
          isDelete: item.isDelete ?? true,
        };
      })
      : [];

    const saleOrderLines = data.saleOrderLines.map((item) => {
      return {
        id: item.id,
        productId: item.productId,
        requestQuantity: parseFloat(item?.requestQuantity ?? '0'),
        requestPrice: parseFloat(item?.requestPrice ?? '0'),
        suggestedPrice: parseFloat(item?.suggestedPrice ?? '0'),
        isDelete: item.isDelete ?? false,
      };
    });
    const params = {
      id: data.id,
      package: !isEmpty(data.package) ? parseFloat(data?.package ?? '0') : 0,
      invoiceNumber: data.invoiceNumber,
      orderDate: data.orderDate,
      note: data.note,
      saleOrderLines: isDeleteDefault
        ? saleOrderLineDeleteDefautl.concat(saleOrderLines)
        : saleOrderLines,
    };

    setLoadingBTN(true);

    dispatch(UpdateSaleOrderApi(params))
      .unwrap()
      .then(() => {
        setNotification({
          message: 'Cập nhật phiếu đặt hàng thành công',
          severity: 'success',
        });
        fetchDataById();
        navigate('/inventory/order-slip');
      })
      .catch((error) => {
        setNotification({
          error: 'Lỗi khi cập nhật phiếu đặt hàng!',
        });
      })
      .finally(() => setLoadingBTN(false));
    return;
  };

  return (
    <PageWrapper title="Sửa phiếu thu chi">
      <PageBreadcrumbs
        title="Sửa phiếu đặt hàng"
        items={[
          { link: '/inventory', text: 'Kho hàng' },
          { link: '/inventory/order-slip', text: 'Phiếu đặt hàng' },
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

                  <Grid item xs={12} sm={12} md={6} lg={6}>
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

                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <ProFormTextField
                      name="supplierName"
                      placeholder="Nhà cung cấp"
                      disabled
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

                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <ProFormTextField
                      name="storeName"
                      placeholder="Cửa hàng"
                      disabled
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

                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <ProFormTextField
                      name="invoiceNumber"
                      placeholder="Số hóa đơn"
                      validate={Validation.stringRequired()
                        .required('Số hóa đơn không được để trống')
                        .default(null)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <ProFormDateEdit
                      name="orderDate"
                      DatePickerProps={{
                        label: '',
                        toolbarPlaceholder: 'SĐSF',
                      }}
                      validate={Validation.date()
                        .required('Ngày đặt hàng không được để trống')
                        .default(null)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <ProFormTextField
                      name="package"
                      placeholder="Số kiện"
                      validate={Validation.string()
                        .notRequired()
                        .matches(Regexs.decimal2, {
                          message: 'Số kiện không hợp lệ',
                          excludeEmptyString: true,
                        })
                        .default(null)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <ProFormTextField
                      name="rate"
                      placeholder="Tỉ giá NDT - VND"
                      disabled
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

                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormTextField name="note" placeholder="Ghi chú" />
                  </Grid>
                </Grid>
              </Paper>

              <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                  <TextField
                    disabled
                    value="Sản phẩm"
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
                    name="productId"
                    options={productOption}
                    renderValue={(item) => item.id}
                    renderLabel={(item) => `${item.code} - ${item.name}`}
                    placeholder={'Tên sản phẩm'}
                    onSelect={onSelectProduct}
                  />
                </Grid>
              </Grid>

              <Paper sx={{ p: 2 }}>
                <ProductTable
                  dataProductTable={saleOrderLineTable}
                  handleDeleteRow={handleDeleteRow}
                  handleChangeTotal={handleChangeTotal}
                  saleOrderLineDefault={saleOrderLineDefault}
                  sumTotalPrice={sumTotalPrice}
                />
                <Stack spacing={2} sx={{ pt: 4 }}>
                  <ActionButton
                    actionType="cancel"
                    sx={{ background: 'white' }}
                    onClick={() => navigate('/inventory/order-slip')}
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

export default EditOrderSlip;
