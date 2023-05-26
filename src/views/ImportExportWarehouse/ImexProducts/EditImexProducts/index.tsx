import { Box, Grid, Stack } from '@mui/material';
import Paper from '@mui/material/Paper';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormContent from 'components/ProForm/ProFormContent';
import ProFormHeader from 'components/ProForm/ProFormHeader';
import ProFormLabel from 'components/ProForm/ProFormLabel';
import useNotification from 'hooks/useNotification';
import { PriceDecimalInput } from 'plugins/NumberFormat';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  EditlProductWareHousingBill,
  getDetailProductWareHousingBill,
  getProductWareHousingDetail,
} from 'slices/warehousingslice';
import { AppDispatch } from 'store';
import Validation from 'utils/Validation';
import { IImportExport } from '../utils/types';
import Regexs from 'utils/Regexs';
import ProFormTextFiedTrim from 'components/ProForm/Label/ProFormTextFiedTrim';

const EditImexProducts = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const setNotification = useNotification();

  const productDetailById = useSelector(getProductWareHousingDetail);

  const form = useForm<IImportExport>({
    mode: 'onChange',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingBTN, setLoadingBTN] = useState<boolean>(false);
  const [product, setProduct] = useState<IImportExport>({});

  const fetchData = async () => {
    if (!id) {
      setNotification({
        error: 'ID sản phẩm không tồn tại!',
      });
      return;
    }
    try {
      setLoading(true);
      const response = await dispatch(
        getDetailProductWareHousingBill({ warehousingBillId: id })
      );

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
    fetchData();
  }, [id]);

  useEffect(() => {
    setProduct(productDetailById);
    form.reset({
      productName: productDetailById?.productName,
      quantity: productDetailById?.quantity,
      price: productDetailById?.price === 0 ? '0' : productDetailById?.price,
      note: productDetailById?.note,
    });
  }, [productDetailById]);

  const handleSubmit = (data: IImportExport) => {
    if (!id) {
      return;
    }
    const params = {
      warehousingBillProductId: id,
      quantity: parseFloat(data?.quantity ?? '0'),
      price: parseFloat(data?.price ?? '0'),
      note: data?.note,
    };

    setLoadingBTN(true);

    dispatch(EditlProductWareHousingBill(params))
      .unwrap()
      .then(() => {
        setNotification({
          message: 'Chỉnh sửa sản phẩm xuất nhập kho thành công',
          severity: 'success',
        });
        // fetchData();
        navigate('/inventory?value=filter1');
      })
      .catch((error) => {
        setNotification({
          error: 'Lỗi khi chỉnh sửa sản phẩm xuất nhập kho!',
        });
      })
      .finally(() => setLoadingBTN(false));
    return;
  };

  const trimSpaceForm = (event: any, name: string) => {
    const value = event.target.value;
    form.setValue(name, value.trim());
  };

  return (
    <PageWrapper title={'Sửa sản phẩm xuất nhập kho'}>
      <PageBreadcrumbs
        title={'Sửa sản phẩm xuất nhập kho'}
        items={[
          { link: '/inventory?value=filter1', text: 'Sản phẩm xuất nhập kho' },
        ]}
      />
      <Stack direction="column" marginTop={'10px'}>
        <ProForm form={form} onFinish={handleSubmit}>
          <ProFormContent>
            <Paper sx={{ p: 2 }}>
              <ProFormHeader>{`XNK tại kho: ${
                product?.storeName ?? 'N/A'
              }`}</ProFormHeader>
              <Grid container spacing={2} marginTop={1} marginBottom={1}>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <ProFormLabel title={'Sản phẩm'} name="productName" />
                  <ProFormTextField
                    name="productName"
                    placeholder={'Sản phẩm'}
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
                <Grid item xs={12} sm={12} md={6} lg={6}></Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <ProFormLabel title={'Số lượng'} name="quantity" />
                  <ProFormTextField
                    name="quantity"
                    placeholder={'Số lượng'}
                    validate={Validation.pattern(
                      Regexs.number,
                      'Số lượng không hợp lệ'
                    )
                      .test(
                        'valiRequestQuantity',
                        'Số lượng phải lớn hơn 0',
                        async (value, context) => {
                          const numberVal = parseInt(value);
                          return !(numberVal <= 0);
                        }
                      )
                      .required('Số lượng không được để trống')
                      .nullable()
                      .trim()
                      .default('')}
                    InputProps={{
                      inputComponent: PriceDecimalInput,
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
                <Grid item xs={12} sm={12} md={6} lg={6}></Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <ProFormLabel title={'Giá tiền'} name="price" />
                  <ProFormTextField
                    name="price"
                    placeholder={'Giá tiền'}
                    validate={Validation.pattern(
                      Regexs.number2,
                      'Giá tiền không hợp lệ'
                    )
                      .required('Giá tiền không được để trống')
                      .nullable()
                      .trim()
                      .default('0')}
                    InputProps={{
                      inputComponent: PriceDecimalInput,
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
                <Grid item xs={12} sm={12} md={6} lg={6}></Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <ProFormLabel title={'Mô tả'} name="note" />
                  <ProFormTextField
                    name="note"
                    placeholder={'Mô tả'}
                    onBlur={(event) => trimSpaceForm(event, 'note')}
                  />
                </Grid>
              </Grid>
              <Box sx={{ marginTop: '25px' }}>
                <Stack direction="row" spacing={1}>
                  <ActionButton
                    actionType="save"
                    type="submit"
                    loading={loadingBTN}
                  >
                    Lưu
                  </ActionButton>
                </Stack>
              </Box>
            </Paper>
          </ProFormContent>
        </ProForm>
      </Stack>
    </PageWrapper>
  );
};

export default EditImexProducts;
