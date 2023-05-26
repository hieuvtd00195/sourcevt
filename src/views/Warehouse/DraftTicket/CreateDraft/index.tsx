import InfoIcon from '@mui/icons-material/Info';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { Divider, Grid, Stack, TextField, Typography } from '@mui/material';
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
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router';
import {
  APIGetProductWarehouse,
  APIGetStore,
} from 'services/warehouseTransfer';
import { createDraftTicket } from 'slices/draftTicket';
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
import useTableColumns from './TableColumns';
import SelectFiles from './components/SelectFiles';
import useFilters from './utils/filters';
import { setTab } from 'slices/warehouseTransfer';

const ImportBill = () => {
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

    dispatch(
      createDraftTicket({
        data: {
          ...data,
          draftTicketProducts: data.form.map(
            (item: IProductCreateDraftTicket) => ({
              ...item,
              quantity: Number(item.quantity),
            })
          ),
        },
        images: images
          .map((_item) => _item.file)
          .filter((x) => x !== null) as File[],
      })
    )
      .unwrap()
      .then(() => {
        setNotification({
          message: 'Tạo phiếu nháp thành công',
          severity: 'success',
        });
        dispatch(setTab('1'));
        navigate('/warehouse');
      })
      .catch((error) => {
        setNotification({
          error: error || 'Lỗi khi tạo phiếu nháp!',
        });
      });
  };

  const { fields, append, remove } = useFieldArray({
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
    tableRef.current?.startRowEditMode(rowId);
  };

  const handleSetValueToField = useCallback(
    () => async () => {
      const valuePR = Number(form.watch('quantityInput'));

      const updatedList = form.watch('form').map((item: any, index: any) => {
        // const isValid = form.trigger(`form.${index}`);
        // if (!isValid) return;
        return {
          ...item,
          quantity: valuePR,
        };
      });

      form.setValue('form', updatedList);

      // form.watch('form').map((item: any, index: any) => {
      //   const isValid = form.trigger(`form.${index}`);
      //   if (!isValid) return;
      //   const row = form.getValues(`form.${index}`);
      //   update(index, {
      //     ...row,
      //     quantity: valuePR,
      //   });
      // });
    },
    [form]
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

  return (
    <PageWrapper title={'Thêm phiếu chuyển kho nháp'}>
      <PageBreadcrumbs
        title={'Thêm phiếu chuyển kho nháp'}
        items={[
          { link: '/warehouse', text: 'Chuyển kho nháp' },
          { link: '/warehouse', text: 'Danh sách chuyển kho nháp' },
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
                  />
                </Grid>

                <Grid item xs={12} sm={12} lg={3}>
                  <ProFormLabel title={'Chọn File'} name="note" />
                </Grid>
                <Grid item xs={12} sm={12} lg={9}>
                  <SelectFiles {...{ images, setImages }} />
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
              pagination={{
                page: filters.pageNumber,
                total: fields.length,
                pageSize: filters.pageSize,
                onPageChange,
                onPageSizeChange,
              }}
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
            <ActionButton actionType="save" type="submit" sx={{ m: 2 }}>
              Lưu
            </ActionButton>
          </Grid>
        </Grid>

        <Divider />
      </ProForm>
    </PageWrapper>
  );
};

export default ImportBill;
