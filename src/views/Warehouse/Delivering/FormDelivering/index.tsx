import InfoIcon from '@mui/icons-material/Info';
import StorefrontIcon from '@mui/icons-material/Storefront';
import {
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import { nanoid } from '@reduxjs/toolkit';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import ProFormLabel from 'components/ProForm/ProFormLabel';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import ProTable from 'components/ProTable';
import ProFormAutocomplete from 'components/ProTable/core/EditableCell/ProFormAutocomplete';
import ProFormMultiAutocomplete from 'components/ProTable/core/EditableCell/ProFormMultiAutocomplete';
import { TableRef } from 'components/ProTable/types/refs';
import useNotification from 'hooks/useNotification';
import useRefresh from 'hooks/useRefresh';
import { isEmpty } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import {
  APIGetProductWarehouse,
  APIGetStore,
} from 'services/warehouseTransfer';
import { getWarehouseTransferMoving } from 'slices/warehouseDelivering';
import { useTypedDispatch } from 'store';
import {
  CreateDraftTicket,
  IProductCreateDraftTicket,
} from 'types/draftTicket';
import Validation from 'utils/Validation';
import {
  IProduct,
  IResponseStore,
  IStore,
} from 'views/Inventory/OrderSlip/AddOrderSlip/utils/types';
import { ImageObject } from 'views/Warehouse/CreateWarehouse/utils/types';
import SelectFiles from 'views/Warehouse/DraftTicket/CreateDraft/components/SelectFiles';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import LinkButton from 'components/LinkButton';
import { setTab } from 'slices/warehouseTransfer';

const FormDelivering = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [, refetch] = useRefresh();
  const dispatch = useTypedDispatch();
  const tableRef = useRef<TableRef>(null);
  const setNotification = useNotification();
  const [loading] = useState<boolean>(false);

  const [images, setImages] = useState<ImageObject[]>([]);
  const [storeListOption, setStoreListOption] = useState<IStore[]>([]);
  const [productListOption, setProductListOption] = useState<IProduct[]>([]);

  const { filters, onSortingChange, onPageChange, onPageSizeChange } =
    useFilters();

  const form = useForm<CreateDraftTicket>({
    mode: 'onChange',
    defaultValues: {
      form: [],
    },
    // resolver: yupResolver(schema),
    // defaultValues: schema.getDefault(),
  });

  const handleSubmit = (data: CreateDraftTicket) => {
    if (!data.form.length) {
      setNotification({
        error: 'Cần ít nhất 1 sản phẩm để lưu phiếu đặt hàng',
      });
      return;
    }
  };

  const { fields, append, update, remove } = useFieldArray({
    control: form.control,
    name: 'form',
    keyName: 'rowId',
  });

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
        note: null,
        productId: product.id,
        quantity: null,
        code: product.code,
        barCode: product.barCode,
        name: product.name,
        stockQuantity: product.stockQuantity,
      } as IProductCreateDraftTicket);
      return acc;
    }, []);
    append(rows, { shouldFocus: false });
    if (!Boolean(id)) {
      tableRef.current?.startRowEditMode(rowId);
    }
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
      });
    },
    [form, update]
  );

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
    onSetAll: handleSetValueToField,
    setValue: form.setValue,
    handleDelete: remove,
  });

  const handleRowEditableChange = (
    rowEditableState: Record<string, boolean>
  ) => {
    // const isEditing = TypedObject.isExist(rowEditableState);
    refetch();
  };

  useEffect(() => {
    Promise.all([
      APIGetStore(),
      // APIGetProductWarehouse(),
    ])
      .then(([storeRes]) => {
        // setProductListOption(productRes);
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

  const sourceStoreId = useWatch({
    control: form.control,
    name: 'sourceStoreId',
  });

  useEffect(() => {
    if (isEmpty(sourceStoreId)) return;
    APIGetProductWarehouse(sourceStoreId || '')
      .then((res) => {
        setProductListOption(res);
      })
      .catch((err) => console.log(err))
      .finally(() => {});
  }, [sourceStoreId]);

  useEffect(() => {
    if (!id) {
      return;
    }

    dispatch(getWarehouseTransferMoving(id))
      .unwrap()
      .then((response) => {
        const { destinationStoreId, sourceStoreId, note, attachments } =
          response;

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
      })
      .catch(() =>
        setNotification({
          error: 'Lỗi khi tải thông tin chi tiết phiếu đang di chuyển',
        })
      );
  }, [dispatch, id, setNotification]);

  const titlePage = useMemo(
    () => (id ? 'Chi tiết phiếu đang di chuyển' : 'Thêm phiếu đang di chuyển'),
    [id]
  );

  return (
    <PageWrapper title={titlePage}>
      <PageBreadcrumbs
        title={titlePage}
        items={[
          { link: '/warehouse', text: 'Đang di chuyển' },
          { link: '/warehouse', text: 'Danh sách đang di chuyển' },
        ]}
      />
      <ProForm form={form} onFinish={handleSubmit}>
        <Grid
          container
          sx={{ mt: '0px' }}
          columnSpacing="20px"
          rowSpacing="30px"
        >
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, pb: 5, height: '100%' }}>
              <Stack mb={1.5}>
                <StorefrontIcon />
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {'Kho hàng'}
                </Typography>
              </Stack>
              <Divider />
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={12} lg={3}>
                  <ProFormLabel title={'Từ kho:'} required name="warehouse" />
                </Grid>
                <Grid item xs={12} sm={12} lg={9}>
                  <ProFormAutocomplete
                    name="sourceStoreId"
                    options={storeListOption.filter(
                      (x) => x.value !== form.watch('destinationStoreId')
                    )}
                    renderValue={(item) => item.value}
                    renderLabel={(item) => item.label}
                    placeholder="Từ kho hàng"
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
                    InputLabelProps={{
                      sx: {
                        '& .MuiInputBase-input.Mui-disabled': {
                          fontWeight: 700,
                        },
                      },
                    }}
                    disabled={Boolean(id)}
                  />
                </Grid>
                <Divider />
                <Grid item xs={12} sm={12} lg={3}>
                  <ProFormLabel title={'Đến kho:'} required name="warehouse" />
                </Grid>
                <Grid item xs={12} sm={12} lg={9}>
                  <ProFormAutocomplete
                    name="destinationStoreId"
                    options={storeListOption.filter(
                      (x) => x.value !== form.watch('sourceStoreId')
                    )}
                    renderValue={(item) => item.value}
                    renderLabel={(item) => item.label}
                    placeholder="Đến kho hàng"
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
                    InputLabelProps={{
                      sx: {
                        '& .MuiInputBase-input.Mui-disabled': {
                          fontWeight: 700,
                        },
                      },
                    }}
                    disabled={Boolean(id)}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, pb: 5, height: '100%' }}>
              <Stack mb={1.5}>
                <InfoIcon />
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {'Thông tin/Chọn file'}
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
                    validate={Validation.selectString()
                      .notRequired()
                      .max(256, 'Không nhập quá 256 ký tự')}
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
                    disabled={Boolean(id)}
                  />
                </Grid>

                <Grid item xs={12} sm={12} lg={3}>
                  <ProFormLabel title={'Chọn File'} name="note" />
                </Grid>
                <Grid item xs={12} sm={12} lg={9}>
                  <SelectFiles {...{ images, setImages }} disabled />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={3}>
            <TextField
              value="Sản phẩm"
              disabled
              sx={{
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: '#000000',
                },
                background: 'white',
              }}
            />
            {/* <ProFormSelect
              name="company"
              placeholder={''}
              options={[
                { value: 1, label: 'Sản phẩm' },
                { value: 2, label: 'Nhập theo Imei' },
              ]}
              disabled
              sx={{ background: 'white' }}
            /> */}
          </Grid>
          <Grid item xs={9}>
            <ProFormMultiAutocomplete
              name="productId"
              options={productListOption}
              renderValue={(item) => item.id}
              renderLabel={(item) => `${item.code} - ${item.name}`}
              placeholder={'Tên sản phẩm(*)'}
              onSelect={onSelect}
              sx={{ background: 'white' }}
              disabled={Boolean(id)}
            />
          </Grid>

          <Grid item xs={12} sx={{ height: '500px' }}>
            <ProTable<IProductCreateDraftTicket>
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
              initialstate={{
                hiddenColumns: [],
                hiddenColumnActions: true,
                hiddenFilterActions: true,
                hiddenVisibilityColumns: true,
              }}
              hideFooter
            />
          </Grid>
          <Grid item xs={12}>
            <Stack justifyContent="flex-end">
              <Button
                onClick={() => {
                  dispatch(setTab('2'));
                  navigate('/warehouse');
                }}
                sx={{ m: 2 }}
              >
                Đóng
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <Divider />

        {/* <div
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
                          title={'Từ kho:'}
                          required
                          name="warehouse"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} lg={9}>
                        <ProFormSelect
                          name="objectType"
                          placeholder="Từ kho hàng"
                          options={[
                            { value: 0, label: 'Hà Nội' },
                            { value: 1, label: 'Hải phòng' },
                            { value: 2, label: 'Bắc giang' },
                            { value: 2, label: 'Bắc hải' },
                            { value: 2, label: 'Quảng ninh' },
                            { value: 2, label: 'Sài gòn' },
                          ]}
                          renderLabel={(option) => option.label}
                          renderValue={(option) => option.value}
                        />
                      </Grid>
                      <Divider />
                      <Grid item xs={12} sm={12} lg={3}>
                        <ProFormLabel
                          title={'Từ kho:'}
                          required
                          name="warehouse"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} lg={9}>
                        <ProFormSelect
                          name="move"
                          placeholder="Đến kho hàng"
                          options={[
                            { value: 0, label: 'Ninh Bình' },
                            { value: 1, label: 'Sóc Sơn' },
                            { value: 2, label: 'Yên bái' },
                            { value: 2, label: 'Lào cai' },
                            { value: 2, label: 'Hải Dương' },
                            { value: 2, label: 'Ninh Thuận' },
                          ]}
                          renderLabel={(option) => option.label}
                          renderValue={(option) => option.value}
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
                      <input hidden accept="*" type="file" />
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </ProFormContent>
          </Stack>
          <Box sx={{ gridArea: 'mid', height: '500px', padding: '8px' }}>
            <Grid container spacing={2} marginBottom={2}>
              <Grid item xs={2} sm={2} md={2} lg={2}>
                <ProFormSelect
                  name="company"
                  placeholder={''}
                  options={[
                    { value: 1, label: 'Sản phẩm' },
                    { value: 2, label: 'Nhập theo Imei' },
                  ]}
                />
              </Grid>
              <Grid item xs={9} sm={9} md={9} lg={9}>
                <ProFormTextField
                  name="nhapsanpham"
                  placeholder={''}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={1} sm={1} md={1} lg={1}>
                <Button>
                  <AddIcon />
                </Button>
              </Grid>
            </Grid>
            <BillTable />
          </Box>
          <Stack direction="column" spacing={2} sx={{ gridArea: 'bot' }}>
            <Box sx={{ p: 2 }}>
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
              </Grid>
            </Box>
            <Box sx={{ p: 2 }}>
              <Stack direction="row" spacing={1}>
                <ActionButton actionType="save" type="submit">
                  Lưu
                </ActionButton>
              </Stack>
            </Box>
          </Stack>
          <Divider sx={{ gridArea: 'divider' }} />
        </div> */}
      </ProForm>
    </PageWrapper>
  );
};

export default FormDelivering;
