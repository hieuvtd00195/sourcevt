import { yupResolver } from '@hookform/resolvers/yup';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
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
import BillTable from './ImportBillTable';
import { IImportExport, ImageObject, TableCreateOrder } from './utils/types';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ProFormAutocomplete from 'components/ProTable/core/EditableCell/ProFormAutocomplete';
import {
  APIGetProductWarehouse,
  APIGetStore,
} from 'services/warehouseTransfer';
import {
  IProduct,
  IResponseStore,
  IStore,
} from 'views/Inventory/OrderSlip/AddOrderSlip/utils/types';
import ProFormMultiAutocomplete from 'components/ProTable/core/EditableCell/ProFormMultiAutocomplete';
import { useNavigate } from 'react-router-dom';
import { APIGetProduct } from 'services/saleOrder';
import ProTable from 'components/ProTable';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import useRefresh from 'hooks/useRefresh';
import { nanoid } from '@reduxjs/toolkit';
import useNotification from 'hooks/useNotification';
import { useFieldArray } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store';
import { TableRef } from 'components/ProTable/types/refs';
import TypedObject from 'utils/TypedObject';
import UploadInput from 'components/UploadInput';
import { ChangeEvent } from 'types/react';
import { isEmpty } from 'lodash';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import Image from 'components/Image';
import {
  CreateWarehouseTransferBill,
  createWarehouseTransferWithFile,
  setTab,
} from 'slices/warehouseTransfer';
import { log } from 'console';

interface TableCreateWarehouse {
  [key: string]: any;
}
interface DataAddWarehouse<TableCreateWarehouse> {
  [key: string]: any;
}

// const schema = Validation.shape({
//   quantityInput: Validation.string().optional(),
//   form: [],
// });

const ImportBill = () => {
  const [radioValue, setRadioValue] = useState<string>('1');
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<DataAddWarehouse<TableCreateWarehouse>>({
    mode: 'onChange',
    defaultValues: {
      form: [],
    },
    // resolver: yupResolver(schema),
    // defaultValues: schema.getDefault(),
  });

  const [, refetch] = useRefresh();
  const setNotification = useNotification();
  const dispatch = useDispatch<AppDispatch>();

  const { fields, append, update, replace, remove } = useFieldArray({
    control: form.control,
    name: 'form',
    keyName: 'rowId',
  });

  console.log('fields', fields);


  const [images, setImages] = useState<ImageObject[]>([]);
  const [showAllImages, setShowAllImages] = useState<boolean>(false);

  const handleChangeRaio = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    setRadioValue(value);
  };

  const tableRef = useRef<TableRef>(null);
  const [storeListOption, setStoreListOption] = useState<IStore[]>([]);
  const [productListOption, setProductListOption] = useState<IProduct[]>([]);
  const [note, setNote] = useState<string>('');
  const navigate = useNavigate();

  const { filters, onSortingChange, onPageChange, onPageSizeChange } =
    useFilters();

  const [total] = useState<number>(1);

  const onSubmit = async (data: DataAddWarehouse<TableCreateWarehouse>) => {
    const { form, ...rest } = data;

    const warehouseTransferBillProducts = form.map(
      (item: TableCreateWarehouse) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        note: item.note,
      })
    );
    const updatedObject = {
      sourceStoreId: data.sourceStoreId,
      destinationStoreId: data.destinationStoreId,
      note: note,
      warehouseTransferBillProducts,
    };

    try {
      setLoading(true);
      const response = await dispatch(
        createWarehouseTransferWithFile({
          data: updatedObject,
          images: images
            .map((_item) => _item.file)
            .filter((x) => x !== null) as File[],
        })
      );
      // @ts-ignore
      if (isEmpty(response.error)) {
        setNotification({
          message: 'Tạo mới phiếu chuyển kho thành công',
          severity: 'success',
        });
        dispatch(setTab('0'));
        navigate('/warehouse');
      } else {
        setNotification({
          error: 'Lỗi khi tạo mới phiếu chuyển kho!',
        });
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEmpty(form.watch('sourceStoreId'))) return;
    APIGetProductWarehouse(form.watch('sourceStoreId'))
      .then((res) => {
        setProductListOption(res);
        let preWatch = form.watch();

        form.reset({
          ...preWatch,
          form: [],
          productId: undefined,
        })
      })
      .catch((err) => console.log(err))
      .finally(() => { });
  }, [form.watch('sourceStoreId')]);

  useEffect(() => {
    Promise.all([
      APIGetStore(),
    ])
      .then(([storeRes]) => {
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
        name: product.name,
        quantity: null,
        stockQuantity: product.stockQuantity,
        code: product.code,
        barCode: null,
      });
      return acc;
    }, []);
    append(rows, { shouldFocus: false });
    tableRef.current?.startRowEditMode(rowId);
  };
  const handleRowEditableChange = (
    rowEditableState: Record<string, boolean>
  ) => {
    refetch();
  };

  const handleSetValueToField = useCallback(
    () => async () => {
      const valuePR = Number(form.watch('quantityInput'));
      form.watch('form').map((item: any, index: any) => {
        const isValid = form.trigger(`form.${index}`);
        if (!isValid) return;
        const row = form.getValues(`form.${index}`);
        update(index, {
          ...row,
          quantity: valuePR,
        });
        form.trigger(`form[${index}].quantity`);
      });
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
  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
    onDelete: handleRemoveRow,
    handleBlur,
    onSetAll: handleSetValueToField,
    setValue: form.setValue,
  });

  const handleOnBlurNote = (event: any) => {
    setNote(event.target.value.trim());
  };

  const onSelectFileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList;

    const newImages: ImageObject[] = [];
    for (let i = 0; i < files.length; i++) {
      const id = nanoid();
      const reader = new FileReader();
      reader.readAsDataURL(files[i]);
      reader.onload = (e) => {
        const newImage: ImageObject = {
          id,
          file: files[i],
          src: e.target?.result as string,
        };
        newImages.push(newImage);

        if (newImages.length === files.length) {
          setImages((prevImages) => [...prevImages, ...newImages]);
        }
      };
    }
  };

  const handleImageRemove = (id: string) => {
    const newImages = images.filter((image) => image.id !== id);
    setImages(newImages);
  };

  // const handleImageEdit = (id, file) => {
  //   const newImages = [...images];
  //   const index = newImages.findIndex((image) => image.id === id);
  //   newImages[index].file = file;

  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);

  //   reader.onload = (e) => {
  //     newImages[index].src = e.target.result;
  //     setImages(newImages);
  //   };
  // };

  const handleShowAllImages = () => {
    setShowAllImages(true);
  };

  const displayedImages = showAllImages ? images : images.slice(0, 5);

  return (
    <PageWrapper title={'Thêm phiếu chuyển kho'}>
      <PageBreadcrumbs
        title={'Thêm phiếu chuyển kho'}
        items={[
          { link: '/warehouse', text: 'Chuyển kho' },
          { link: '/warehouse', text: 'Danh sách chuyển kho' },
        ]}
      />
      <ProForm form={form} onFinish={onSubmit}>
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
                        {'Cửa hàng'}
                      </Typography>
                    </Stack>
                    <Divider />
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={12} sm={12} lg={3}>
                        <ProFormLabel
                          title={'Từ cửa hàng:'}
                          required
                          name="warehouse"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} lg={9}>
                        <ProFormAutocomplete
                          name="sourceStoreId"
                          options={storeListOption.filter(
                            (item) => item.value !== form.watch('destinationStoreId')
                          )}
                          renderValue={(item) => item.value}
                          renderLabel={(item) => item.label}
                          placeholder="Từ cửa hàng"
                          validate={Validation.selectString().required(
                            'Kho hàng không được để trống'
                          )}
                        />
                      </Grid>
                      <Divider />
                      <Grid item xs={12} sm={12} lg={3}>
                        <ProFormLabel
                          title={'Đến cửa hàng:'}
                          required
                          name="warehouse"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} lg={9}>
                        <ProFormAutocomplete
                          name="destinationStoreId"
                          options={storeListOption.filter(
                            (item) => item.value !== form.watch('sourceStoreId')
                          )}
                          renderValue={(item) => item.value}
                          renderLabel={(item) => item.label}
                          placeholder="Đến cửa hàng"
                          validate={Validation.selectString().required(
                            'Kho hàng không được để trống'
                          )}
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
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      onBlur={(event) => handleOnBlurNote(event)}
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
                    >
                      Chọn File
                      <UploadInput
                        accept="image/*"
                        multiple
                        onChange={onSelectFileImage}
                      />
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
                            src={image.src}
                            sx={{
                              width: '100%',
                              height: '100px',
                              objectFit: 'cover',
                              borderRadius: 1,
                            }}
                          />
                          <CancelOutlinedIcon
                            sx={{
                              position: 'absolute',
                              top: '16px',
                              right: 0,
                              cursor: 'pointer',
                            }}
                            onClick={() => handleImageRemove(image.id)}
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
          <Box sx={{ gridArea: 'mid', height: 'auto' }}>
            <Grid container spacing={2} marginBottom={2}>
              <Grid item xs={2} sm={2} md={2} lg={2}>
                {/* <ProFormSelect
                  name="company"
                  placeholder={''}
                  options={[
                    { value: 1, label: 'Sản phẩm' },
                    { value: 2, label: 'Nhập theo Imei' },
                  ]}
                /> */}
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
                  onSelect={onSelect}
                  validate={Validation.selectAutocompleteMulti().required(
                    'Cần ít nhất 1 sản phẩm để lưu phiếu đặt hàng'
                  )}
                  sx={{ background: '#ffffff' }}
                />
              </Grid>
            </Grid>
            <Paper sx={{ p: 1, pb: 5 }}>
              <Box sx={{ p: 2 }}>
                <ActionButton actionType="save" type="submit">
                  Lưu
                </ActionButton>
                {/* <BillTable /> */}
              </Box>
              <ProTable<IImportExport>
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
                // pagination={{
                //   page: filters.pageNumber,
                //   total,
                //   pageSize: filters.pageSize,
                //   onPageChange,
                //   onPageSizeChange,
                // }}
                hideFooter={true}

              />
            </Paper>
            {/* <Box sx={{ p: 2 }}>
              <Grid container spacing={2} marginTop={1} marginBottom={1}>
                <FormControl>
                  <RadioGroup
                    row
                    sx={{ mt: 4, mb: 4 }}
                    value={radioValue}
                    onChange={handleChangeRaio}
                  >
                    <FormControlLabel
                      value="1"
                      control={<Radio />}
                      label="Xem chi tiết phiếu chuyển kho
                "
                    />
                    <FormControlLabel
                      value="2"
                      control={<Radio />}
                      label="Tiếp tục lập phiếu chuyển kho"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid> */}
          </Box>
        </div>
      </ProForm>
    </PageWrapper>
  );
};

export default ImportBill;
