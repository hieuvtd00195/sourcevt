import InfoIcon from '@mui/icons-material/Info';
import PrintIcon from '@mui/icons-material/Print';
import StorefrontIcon from '@mui/icons-material/Storefront';
import {
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { nanoid } from '@reduxjs/toolkit';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import ProFormLabel from 'components/ProForm/ProFormLabel';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import ProFormAutocomplete from 'components/ProTable/core/EditableCell/ProFormAutocomplete';
import ProFormMultiAutocomplete from 'components/ProTable/core/EditableCell/ProFormMultiAutocomplete';
import { isEmpty } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import {
  APIGetProductWarehouse,
  APIGetStore,
} from 'services/warehouseTransfer';
import {
  approveDraftTicket,
  getDraftTicketSetApproveById,
} from 'slices/draftTicket';
import { useTypedDispatch, useTypedSelector } from 'store';
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
import { TableRef } from 'components/ProTable/types/refs';
import SelectFiles from '../CreateDraft/components/SelectFiles';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import useNotification from 'hooks/useNotification';
import { useNavigate } from 'react-router';
import { setTab } from 'slices/warehouseTransfer';
import ProFormSearchField from 'components/ProForm/ProFormSearchField';

const AddcashTable = () => {
  const navigate = useNavigate();
  const [, refetch] = useRefresh();
  const dispatch = useTypedDispatch();
  const setNotification = useNotification();
  const tableRef = useRef<TableRef>(null);
  const [filtedData, setFiltedData] = useState<IProductCreateDraftTicket[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const { id, loadingGet } = useTypedSelector((state) => state.draftTicket);
  const { filters, onSortingChange, onPageChange, onPageSizeChange } =
    useFilters();

  const [images, setImages] = useState<ImageObject[]>([]);
  const [storeListOption, setStoreListOption] = useState<IStore[]>([]);
  const [productListOption, setProductListOption] = useState<IProduct[]>([]);

  const form = useForm<CreateDraftTicket>({
    mode: 'onChange',
    defaultValues: {
      form: [],
    },
  });

  const handleRowEditableChange = (
    rowEditableState: Record<string, boolean>
  ) => {
    // const isEditing = TypedObject.isExist(rowEditableState);
    refetch();
  };

  const handleSubmit = (data: CreateDraftTicket) => {
    if (!data.form.length) {
      setNotification({
        error: 'Cần ít nhất 1 sản phẩm để lưu phiếu đặt hàng',
      });
      return;
    }

    dispatch(
      approveDraftTicket({
        draftTicketProducts: data.form.map(
          (item: IProductCreateDraftTicket) => ({
            approveQuantity: Number(item.approveQuantity),
            id: item.id,
          })
        ),
        note: data.note,
      })
    )
      .unwrap()
      .then(() => {
        setNotification({
          message: 'Duyệt phiếu nháp thành công',
          severity: 'success',
        });
        dispatch(setTab('1'));
        navigate('/warehouse');
      })
      .catch((error) => {
        setNotification({
          error: error?.message || 'Lỗi khi duyệt phiếu nháp!',
        });
      });
  };

  const fetchData = () => {
    id &&
      dispatch(getDraftTicketSetApproveById(id))
        .unwrap()
        .then((res) => {
          if (res.attachments) {
            setImages(
              res.attachments.map((_item) => ({
                file: null,
                id: _item.id,
                src: _item.url,
              }))
            );
          }

          form.reset(res);

          res.draftTicketProducts.forEach((_item) => {
            append(_item, { shouldFocus: false });
            tableRef.current?.startRowEditMode(_item.id);
          });
        })
        .catch(console.log);
  };

  const sourceStoreId = useWatch({
    control: form.control,
    name: 'sourceStoreId',
  });

  const { fields, append, update, remove } = useFieldArray({
    control: form.control,
    name: 'form',
    keyName: 'rowId',
  });

  const handleSetValueToField = useCallback(
    () => async () => {
      form.watch('form').map((item: any, index: number) => {
        const value = Number(form.getValues(`form.${index}.requestQuantity`));
        const isValid = form.trigger(`form.${index}`);
        if (!isValid) return;
        const row = form.getValues(`form.${index}`);
        update(index, {
          ...row,
          approveQuantity: value,
        });

        form.trigger(`form.${index}.approveQuantity`);
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
        fetchData();
      })
      .catch((error) => console.error(error))
      .finally(() => {
        console.log('All API calls finished');
      });
  }, [id]);

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
    const value = searchText.trim();

    setFiltedData(fields.filter((_item) => _item.productName?.includes(value)));
  }, [fields, searchText]);

  return (
    <PageWrapper title="Duyệt kho hàng">
      <PageBreadcrumbs
        title="Duyệt kho hàng"
        items={[{ link: '/warehouse', text: 'Kho hàng' }]}
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
                    disabled
                    name="sourceStoreId"
                    options={storeListOption}
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
                  />
                </Grid>
                <Divider />
                <Grid item xs={12} sm={12} lg={3}>
                  <ProFormLabel title={'Đến kho:'} required name="warehouse" />
                </Grid>
                <Grid item xs={12} sm={12} lg={9}>
                  <ProFormAutocomplete
                    name="destinationStoreId"
                    options={storeListOption}
                    renderValue={(item) => item.value}
                    renderLabel={(item) => item.label}
                    placeholder="Đến kho hàng"
                    validate={Validation.selectString().required(
                      'Kho hàng không được để trống'
                    )}
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
            <ProFormSearchField
              label=""
              name="productName"
              placeHolder="Tên sản phẩm"
              searchText={searchText}
              onSearch={(searchText) => setSearchText(searchText)}
              disabled
            />
            {/* <ProFormMultiAutocomplete
              name="productId"
              options={productListOption}
              renderValue={(item) => item.id}
              renderLabel={(item) => `${item.code} - ${item.name}`}
              placeholder={'Tên sản phẩm(*)'}
              onSelect={onSelect}
              sx={{ background: 'white' }}
            /> */}
          </Grid>

          <Grid item xs={12} sx={{ height: '500px' }}>
            <ProTable<IProductCreateDraftTicket>
              loading={false}
              columns={columns}
              ref={tableRef}
              data={filtedData}
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
            <Stack spacing={2} justifyContent="flex-end">
              <ActionButton variant="contained" type="submit">
                Duyệt
              </ActionButton>
            </Stack>
          </Grid>
        </Grid>
      </ProForm>
    </PageWrapper>
  );
};

export default AddcashTable;
