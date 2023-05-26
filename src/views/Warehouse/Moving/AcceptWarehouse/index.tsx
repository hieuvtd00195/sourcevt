import { yupResolver } from '@hookform/resolvers/yup';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import {
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormContent from 'components/ProForm/ProFormContent';
import ProFormLabel from 'components/ProForm/ProFormLabel';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Validation from 'utils/Validation';
import {
  DataWarehouse,
  IImportExport,
  IImportTable,
  ImageObject,
} from './utils/types';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ProFormAutocomplete from 'components/ProTable/core/EditableCell/ProFormAutocomplete';
import {
  APIAcceptWarehouse,
  APIGetProductWarehouse,
  APIGetStore,
} from 'services/warehouseTransfer';
import {
  IProduct,
  IResponseStore,
  IStore,
} from 'views/Inventory/OrderSlip/AddOrderSlip/utils/types';
import ProFormMultiAutocomplete from 'components/ProTable/core/EditableCell/ProFormMultiAutocomplete';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { APIGetProduct } from 'services/saleOrder';
import ProTable from 'components/ProTable';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import useRefresh from 'hooks/useRefresh';
import { nanoid, unwrapResult } from '@reduxjs/toolkit';
import useNotification from 'hooks/useNotification';
import { useFieldArray } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store';
import { TableRef } from 'components/ProTable/types/refs';
import UploadInput from 'components/UploadInput';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import Image from 'components/Image';
import { isEmpty } from 'lodash';
import * as yup from 'yup';
import {
  acceptWarehouseTransferBill,
  getWarehouseTransferDetail,
  setTab,
} from 'slices/warehouseTransfer';

const schema = Validation.shape({
  form: yup.array().of(
    yup.object().shape({
      quantity: Validation.number(),
      confirmQuantity: Validation.number()
        .test(
          'quantity',
          'Vui lòng nhập bằng số lượng duyệt',
          function (value) {
            return this.parent.quantity === value;
          }
        )
        .positive('Số lượng phải là số nguyên dương và lớn hơn 0')
        .typeError('Số lượng không được để trống'),
    })
  ),
});
interface ImageFiles {
  id: string;
  name: string;
  url: string;
}

const DetailWarehouse = () => {
  const form = useForm<DataWarehouse<IImportTable[]>>({
    mode: 'onChange',
    // defaultValues: {
    //   form: []
    // },
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const [, refetch] = useRefresh();
  const [barCodeNote, setBarCodeNote] = useState<string>();
  const setNotification = useNotification();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();

  const { fields, append, update, replace, remove } = useFieldArray({
    control: form.control,
    name: 'form',
    keyName: 'rowId',
  });

  const handleAccept = async (data: any) => {
    const { form } = data;

    const newWarehouseTransferBillProducts = form.map((item: any) => {
      return {
        confirmQuantity: item.confirmQuantity,
        id: item.id,
      };
    });

    const object = {
      id,
      warehouseTransferBillProducts: newWarehouseTransferBillProducts,
    };

    try {
      // setLoading(true);
      const response = await dispatch(acceptWarehouseTransferBill(object));

      if (response.payload) {
        setNotification({
          message: 'Xác nhận phiếu chuyển kho thành công',
          severity: 'success',
        });
        dispatch(setTab('3'));
        navigate('/warehouse');
      } else {
        setNotification({
          error: 'Lỗi khi xác nhận phiếu chuyển kho!',
        });
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  const [selectedFileImage, setSelectedFileImage] = useState<any>();

  const [images, setImages] = useState<ImageFiles[]>([]);
  const [showAllImages, setShowAllImages] = useState<boolean>(false);

  const tableRef = useRef<TableRef>(null);
  const [storeListOption, setStoreListOption] = useState<IStore[]>([]);
  const [productListOption, setProductListOption] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const { filters, onSortingChange, onPageChange, onPageSizeChange } =
    useFilters();

  const [total] = useState<number>(1);

  const fetchData = useCallback(async () => {
    if (!id) {
      return;
    }
    try {
      setLoading(true);
      const responseSOD = await dispatch(getWarehouseTransferDetail(id));
      const response = unwrapResult(responseSOD);

      if (!response) {
        setNotification({
          error: 'Lỗi khi lấy dữ liệu!',
        });
      }
      const { destinationStoreId, sourceStoreId, note, attachments } = response;

      const tableValues = response.warehouseTransferBillProducts.map(
        (item: any, index: any) => ({
          id: item.id,
          productId: item.productId,
          name: item.productName,
          quantity: item.quantity,
          stockQuantity: item.quantity,
          code: item.barCode,
          note: item.note,
        })
      );
      setImages(attachments);

      form.reset({
        destinationStoreId,
        sourceStoreId,
        note,
        form: tableValues,
      });
      tableValues.forEach((item: any) => {
        tableRef.current?.startRowEditMode(item.id);
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

  useEffect(() => {
    Promise.all([APIGetStore()])
      .then(([storeRes]) => {
        setStoreListOption(
          storeRes.map((item: IResponseStore) => ({
            value: item.id,
            label: item.name,
          }))
        );
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  }, []);

  const handleRowEditableChange = (
    rowEditableState: Record<string, boolean>
  ) => {
    refetch();
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
      tableRef.current?.stopRowEditMode(rowId);
    },
    [remove]
  );

  // const handleSetValueToField = () => {
  //   () => async () => {
  //     console.log('set');

  //   }
  // }

  const handleSetValueToField = useCallback(
    () => async () => {
      form.watch('form').map((item: any, index: any) => {
        const value = Number(form.getValues(`form.${index}.quantity`));
        const isValid = form.trigger(`form.${index}`);
        if (!isValid) return;
        const row = form.getValues(`form.${index}`);
        update(index, {
          ...row,
          confirmQuantity: value,
        });
        form.trigger(`form[${index}].confirmQuantity`);
      });
    },
    [form, update]
  );

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
    onSetAll: handleSetValueToField,
  });

  const handleImageRemove = (id: string) => {
    const newImages = images.filter((image) => image.id !== id);
    setImages(newImages);
  };

  const handleShowAllImages = () => {
    setShowAllImages(true);
  };

  const displayedImages = showAllImages ? images : images.slice(0, 5);

  return (
    <PageWrapper title={'Chi tiết phiếu chuyển kho'}>
      <PageBreadcrumbs
        title={'Chi tiết phiếu chuyển kho'}
        items={[
          { link: '/warehouse', text: 'Chuyển kho' },
          { link: '/warehouse', text: 'Danh sách chuyển kho' },
        ]}
      />
      <ProForm form={form} onFinish={handleAccept}>
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
            <ProFormContent>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, pb: 5 }}>
                    <Stack mb={1.5}>
                      <StorefrontIcon />
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {'Kho hàng'}
                      </Typography>
                    </Stack>
                    <Divider />
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={12} sm={12} lg={3}>
                        <ProFormLabel
                          title={'Từ cửa hàng:'}
                          required
                          name="warehouse"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} lg={9}>
                        <ProFormAutocomplete
                          name="sourceStoreId"
                          options={storeListOption}
                          renderValue={(item) => item.value}
                          renderLabel={(item) => item.label}
                          placeholder="Từ cửa hàng"
                          disabled
                          validate={Validation.selectString().required(
                            'Kho hàng không được để trống'
                          )}
                          InputProps={{
                            sx: {
                              '& .MuiInputBase-input.Mui-disabled': {
                                WebkitTextFillColor: '#000000',
                              },
                              '.MuiInputBase-input': { fontWeight: 700 },
                            },
                          }}
                        />
                      </Grid>
                      <Divider />
                      <Grid item xs={12} sm={12} lg={3}>
                        <ProFormLabel
                          title={'Đến cửa hàng:'}
                          required
                          name="warehouse"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} lg={9}>
                        <ProFormAutocomplete
                          name="destinationStoreId"
                          options={storeListOption}
                          renderValue={(item) => item.value}
                          renderLabel={(item) => item.label}
                          placeholder="Đến cửa hàng"
                          disabled
                          validate={Validation.selectString().required(
                            'Kho hàng không được để trống'
                          )}
                          InputProps={{
                            sx: {
                              '& .MuiInputBase-input.Mui-disabled': {
                                WebkitTextFillColor: '#000000',
                              },
                              '.MuiInputBase-input': { fontWeight: 700 },
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={6}></Grid>
              </Grid>
            </ProFormContent>
          </Stack>
          <Stack
            direction={'column'}
            sx={{ gridArea: 'right', marginTop: '24px' }}
          >
            <ProFormContent>
              <Paper sx={{ p: 2, pb: 5 }}>
                <Stack mb={1.5}>
                  <InfoIcon />
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {'Thông tin'}
                  </Typography>
                </Stack>
                <Divider />
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={12} lg={3}>
                    <ProFormLabel title={'Ghi chú'} name="note" />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={9}>
                    <ProFormTextField
                      name="note"
                      placeholder="Ghi chú"
                      multiline
                      rows={2}
                      disabled
                      InputProps={{
                        sx: {
                          '& .MuiInputBase-input.Mui-disabled': {
                            WebkitTextFillColor: '#000000',
                          },
                          '.MuiInputBase-input': { fontWeight: 700 },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} lg={3}>
                    <ProFormLabel title={'Chọn File'} name="note" />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={9}>
                    <Button
                      variant="contained"
                      size="medium"
                      component="label"
                      sx={{ height: '100%' }}
                      disabled
                    >
                      Chọn File
                      <UploadInput accept="image/*" multiple />
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={12} lg={12}>
                    <Grid container spacing={2}>
                      {displayedImages.map((image) => (
                        <Grid
                          item
                          xs={4}
                          key={image.id}
                          sx={{
                            position: 'relative',
                            width: 'fit-content',
                          }}
                        >
                          <Image
                            src={image.url}
                            sx={{
                              width: '100%',
                              height: '100px',
                              objectFit: 'cover',
                              borderRadius: 1,
                            }}
                          />
                        </Grid>
                      ))}
                      {images.length > 5 && !showAllImages && (
                        <Grid item xs={4} spacing={2}>
                          <Grid
                            item
                            sx={{
                              width: '100%',
                              height: '100px',
                              objectFit: 'cover',
                              borderRadius: 1,
                              background: '#F5F5F5',
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            onClick={handleShowAllImages}
                          >
                            <Typography fontSize="32px">
                              {images.length - 5} +
                            </Typography>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </ProFormContent>
          </Stack>
          <Box sx={{ gridArea: 'mid', height: 'auto', padding: '8px' }}>
            <Grid container spacing={2} marginBottom={2}>
              <Grid item xs={2} sm={2} md={2} lg={2}>
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
              <Grid item xs={10} sm={10} md={10} lg={10}>
                <ProFormMultiAutocomplete
                  name="productId"
                  options={productListOption}
                  renderValue={(item) => item.id}
                  renderLabel={(item) => `${item.code} - ${item.name}`}
                  placeholder={'Tên sản phẩm(*)'}
                  disabled
                  // onSelect={onSelect}
                  validate={Validation.selectAutocompleteMulti().required(
                    'Cần ít nhất 1 sản phẩm để lưu phiếu đặt hàng'
                  )}
                />
              </Grid>
            </Grid>
            <Box sx={{ height: '35vh' }}>
              <ProTable<IImportExport>
                loading={loading}
                columns={columns}
                ref={tableRef}
                data={fields}
                onSortingChange={onSortingChange}
                onRowEditableChange={handleRowEditableChange}
                refetch={refetch}
                getRowId={(row) => row.id}
                form={form}
                editable
                // pagination={{
                //   page: filters.pageNumber,
                //   total,
                //   pageSize: filters.pageSize,
                //   onPageChange,
                //   onPageSizeChange,
                // }}
                hideFooter={true}
              />
            </Box>
          </Box>
          <Stack direction="column" spacing={2} sx={{ gridArea: 'bot' }}>
            <Box sx={{ p: 2 }}>
              <Stack direction="row" spacing={1}>
                <ActionButton
                  actionType="save"
                  variant="contained"
                  type="submit"
                  sx={{ backgroundColor: '#4CAF50 ' }}
                >
                  Xác nhận
                </ActionButton>
              </Stack>
            </Box>
          </Stack>
          <Divider sx={{ gridArea: 'divider' }} />
        </div>
      </ProForm>
    </PageWrapper>
  );
};

export default DetailWarehouse;
