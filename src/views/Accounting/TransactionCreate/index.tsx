import { yupResolver } from '@hookform/resolvers/yup';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import {
  Divider,
  FormControl,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { nanoid, unwrapResult } from '@reduxjs/toolkit';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormAutocompleteSingal from 'components/ProForm/ProFormAutocompleteSingal';
import ProFormContent from 'components/ProForm/ProFormContent';
import ProFormDate from 'components/ProForm/ProFormDate';
import ProTable from 'components/ProTable';
import ProFormSelect from 'components/ProTable/core/EditableCell/ProFormSelect';
import { TableRef } from 'components/ProTable/types/refs';
import useNotification from 'hooks/useNotification';
import { isEmpty } from 'lodash';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { FieldValues, useFieldArray, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { CreateEntryApi, GetEntryApi, UpdateEntryApi } from 'slices/entry';
import {
  getListMasterDataAudience,
  getListMasterDataPaymentAccount,
  getMasterDataListAudience,
  getMasterDataListPaymentAccount,
} from 'slices/masterData';
import { AppDispatch, useTypedSelector } from 'store';
import Numeral from 'utils/Numeral';
import TypedObject from 'utils/TypedObject';
import Validation from 'utils/Validation';
import * as yup from 'yup';
import useTable from './Table';
import {
  TableCreateEntry,
  TableFormValuesObjectEntry,
} from './utils/entryCreate';
import useFilters from './utils/filters';
import { FiltersRef } from './utils/types';
import DateFns, { compare } from 'utils/DateFns';
import DateTime from 'utils/DateTime';
import Regexs from 'utils/Regexs';
const schema = Validation.shape({
  transactionDate: Validation.date()
    .required('Ngày thu chi không được để trống')
    .max(
      DateFns.EndOfDay(new Date()),
      'Ngày thu chi không được lớn hơn ngày hiện tại'
    ),
  audienceType: Validation.option().required(
    'Loại đối tượng không được để trống'
  ),
  ticketType: Validation.option().required('Loại phiếu không được để trống'),
  audienceId: Validation.string().when('audienceType', {
    is: (value: any) => value !== 4,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.optional(),
  }),
  form: yup.array().when('audienceType', {
    is: (value: any) => value === 2,
    then: (schema) =>
      yup.array().of(
        yup.object().shape(
          {
            amountVnd: Validation.string().when('amountCny', {
              is: '',
              then: (schema) => Validation.pattern(Regexs.number2, 'Tiền CNY không hợp lệ')
              .required()
              .nullable()
              .default(''),
              otherwise: (schema) => schema.optional(),
            }),
            amountCny: Validation.string().when('amountVnd', {
              is: '',
              then: (schema) =>   Validation.pattern(Regexs.number2, 'Tiền VND không hợp lệ')
              .required()
              .nullable()
              .default(''),
              otherwise: (schema) => schema.optional(),
            }),
            debtAccountCode: Validation.string().when('creditAccountCode', {
              is: '',
              then: (schema) => schema.required(),
              otherwise: (schema) => schema.optional(),
            }),
            creditAccountCode: Validation.string().when('debtAccountCode', {
              is: '',
              then: (schema) => schema.required(),
              otherwise: (schema) => schema.optional(),
            }),
          },
          [
            ['amountCny', 'amountVnd'],
            ['debtAccountCode', 'creditAccountCode'],
          ]
        )
      ),
    otherwise: (schema) =>
      yup.array().of(
        yup.object().shape(
          {
            amountVnd: Validation.pattern(Regexs.number2, 'Tiền VND không hợp lệ')
            .required()
            .nullable()
            .default(''),
            amountCny: Validation.string().optional(),
            debtAccountCode: Validation.string().when('creditAccountCode', {
              is: '',
              then: (schema) => schema.required(),
              otherwise: (schema) => schema.optional(),
            }),
            creditAccountCode: Validation.string().when('debtAccountCode', {
              is: '',
              then: (schema) => schema.required(),
              otherwise: (schema) => schema.optional(),
            }),
          },
          [['debtAccountCode', 'creditAccountCode']]
        )
      ),
  }),
});
const TransactionCreate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const tableRef = useRef<TableRef>(null);
  const setNotification = useNotification();
  const dispatch = useDispatch<AppDispatch>();
  const filtersRef = useRef<FiltersRef>(null);
  const { loadingGet, loadingCreate } = useTypedSelector(
    (state) => state.entry
  );
  const masterDataLisPaymentAccount = useSelector(
    getMasterDataListPaymentAccount
  );
  const [radioVal, setRadioVal] = useState<string>('1');
  const [disabled, setDisabled] = useState<string[]>([]);
  const [selectedFileImage, setSelectedFileImage] = useState<any>();
  const [previewImage, setPreviewImage] = useState<any>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [textValueSearch, setTextSearchValue] = useState('');
  const masterDataListAudience = useSelector(getMasterDataListAudience);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>(['amountCny']);

  const { filters, onSortingChange, onPageChange, onPageSizeChange } =
    useFilters();

  const form = useForm<TableFormValuesObjectEntry<TableCreateEntry>>({
    mode: 'onChange',
    // resolver: yupResolver(validationSchema),
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });
  // #region Table form
  const { fields, append, update, remove } = useFieldArray({
    control: form.control,
    name: 'form',
    keyName: 'rowId',
  });

  const audienceType = form.watch('audienceType');

  useEffect(() => {
    const rowId = nanoid();
    const row: TableCreateEntry = {
      id: rowId,
      amountVnd: null,
      amountCny: null,
      creditAccountCode: '',
      debtAccountCode: '',
      note: '',
    };
    append(row, { shouldFocus: false });
    tableRef.current?.startRowEditMode(rowId);
  }, []);

  useEffect(() => {
    if (!selectedFileImage) {
      setPreviewImage(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFileImage);
    form.setValue('imageUrls', selectedFileImage.name);
    setPreviewImage(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFileImage]);

  const handleAddRow = () => {
    const rowId = nanoid();
    const row = {
      id: rowId,
      amountVnd: null,
      amountCny: null,
      creditAccountCode: '',
      debtAccountCode: '',
      note: '',
    };
    append(row, { shouldFocus: false });
    tableRef.current?.startRowEditMode(rowId);
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

  // Remove the row and leave edit mode
  const handleRemoveRow = useCallback(
    (rowIndex: number, rowId: string) => () => {
      remove(rowIndex);
      tableRef.current?.stopRowEditMode(rowId);
      filtersRef.current?.clear(rowId);
      setDisabled((state) => state.filter((item) => item !== rowId));
    },
    [remove]
  );
  // Restore row form value and clear errors
  const handleResetRow = useCallback(
    (rowIndex: number, rowId: string) => () => {
      const original = fields[rowIndex];
      form.setValue(`form.${rowIndex}`, original);
      form.clearErrors(`form.${rowIndex}`);
      tableRef.current?.stopRowEditMode(rowId);
    },
    [form, fields]
  );

  const handleRowEditableChange = (
    rowEditableState: Record<string, boolean>
  ) => {
    const isEditing = TypedObject.isExist(rowEditableState);
    setIsEditing(isEditing);
  };

  const { columns } = useTable({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
    onDelete: handleRemoveRow,
    onUpdate: handleUpdateRow,
    onCancel: handleResetRow,
    disabled,
    checkTypeCurrency: audienceType,
    hiddenColumns: hiddenColumns,
    dataPaymentAccount: masterDataLisPaymentAccount,
  });

  const onSelectFileImage = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFileImage(undefined);
      return;
    }

    setSelectedFileImage(e.target.files[0]);
  };

  const handleSubmit = async (val: any) => {
    const entryForm = val.form.map((_item: TableCreateEntry, index: any) => ({
      debtAccountCode: _item.debtAccountCode,
      creditAccountCode: _item.creditAccountCode,
      amountCny: _item.amountCny ? Number(_item.amountCny) : 0,
      amountVnd: _item.amountVnd ? Number(_item.amountVnd) : 0,
      id: _item.id,
      note: _item.note,
    })) as TableCreateEntry[];

    const bodySubmit = {
      storeId: null,
      transactionDate: val.transactionDate ? DateTime.Format(val.transactionDate , 'YYYY-MM-DD') :  DateTime.Format(new Date(), 'YYYY-MM-DD'),
      ticketType: val.ticketType,
      audienceId: val.audienceId,
      audienceType: val.audienceType,
      documentCode: val.documentCode,
      note: val.note,
      entryAccounts: entryForm,
      attachments: selectedFileImage ? selectedFileImage : null,
    };

    const body = {
      ...val,
      transactionDate: val.transactionDate ? DateTime.Format(val.transactionDate , 'YYYY-MM-DD') :  DateTime.Format(new Date(), 'YYYY-MM-DD'),
      audienceCode: !isEmpty(val.audienceCode) ? val.audienceCode : null,
      documentCode: !isEmpty(val.documentCode) ? val.documentCode : null,
      imageUrls: !isEmpty(val.imageUrls) ? val.imageUrls : null,
      note: !isEmpty(val.note) ? val.note : null,
      attachments: selectedFileImage ? selectedFileImage : null,
    };
    if (id) {
      dispatch(UpdateEntryApi({ id, ...body }))
        .unwrap()
        .then(() => {
          setNotification({
            message: 'Cập nhật bút toán thành công',
            severity: 'success',
          });
          navigate('/accounting/transaction/index');
        })
        .catch((error) => {
          setNotification({
            error: 'Lỗi khi cập nhật bút toán!',
          });
        });
      return;
    }
    try {
      setLoading(true);
      const response = await dispatch(CreateEntryApi(bodySubmit));
      if (response.payload === true) {
        setNotification({
          message: 'Tạo mới bút toán thành công',
          severity: 'success',
        });
        navigate('/accounting/transaction/index');
      } else {
        setNotification({
          error: 'Lỗi khi tạo mới bút toán!',
        });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const fetchMasterDataAudience = async () => {
    const body = {
      audienceType,
      searchText: textValueSearch,
    };
    try {
      if (audienceType !== null && audienceType !== 4) {
        await dispatch(getListMasterDataAudience(body));
      }
    } catch (error) {
    } finally {
    }
  };
  useEffect(() => {
    fetchMasterDataAudience();
  }, [audienceType, textValueSearch]);

  const handleChangeRadio = (_: any, val: string) => {
    setRadioVal(val);
  };

  const fetchData = useCallback(async () => {
    if (!id) {
      return;
    }
    try {
      const resultAction = await dispatch(GetEntryApi(id));
      const response = unwrapResult(resultAction);
      const {
        transactionDate,
        audienceType,
        documentCode,
        note,
        audienceId,
        ticketType,
        audienceCode,
        attachments,
      } = response.entry;

      const tableValues = response.entryAccount.map((_item, index) => ({
        id: _item.id,
        amountVnd: _item.amountVnd,
        amountCny: _item.amountCny,
        creditAccountCode: _item.creditAccountCode,
        debtAccountCode: _item.debtAccountCode,
        note: _item.note,
      })) as TableCreateEntry[];

      form.reset({
        transactionDate,
        audienceId,
        audienceType,
        documentCode,
        note,
        ticketType,
        audienceCode,
        imageUrls: attachments?.files.map((_item) => _item.name).join(', '),
        form: tableValues,
      });
      tableValues.forEach((_item) => {
        tableRef.current?.startRowEditMode(_item.id);
      });

      if (audienceType === 2) {
        tableRef.current?.arrayCols
          .find((item) => item.id === 'amountCny')
          ?.toggleVisibility(true);
      } else {
        tableRef.current?.arrayCols
          .find((item) => item.id === 'amountCny')
          ?.toggleVisibility(false);
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, form, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData, id]);
  function checkItemExist(item: any | undefined, array: any[]) {
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

  const fetchDataStoreApplication = async () => {
    try {
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
  useEffect(() => {
    fetchDataStoreApplication();
  }, []);

  const totalNDTValue = () => {
    let totalNDT = 0;
    const listDetail = form.watch('form');
    if (listDetail) {
      listDetail.forEach((item, index) => {
        totalNDT += Number(item.amountCny);
      });
    }

    return Numeral.price(totalNDT);
  };
  const totalVNDValue = () => {
    let totalVND = 0;
    const listDetail = form.watch('form');
    if (listDetail) {
      listDetail.forEach((item, index) => {
        totalVND += Number(item.amountVnd);
      });
    }

    return Numeral.price(totalVND);
  };

  return (
    <Fragment>
      <PageWrapper title="Thêm giao dịch">
        <PageBreadcrumbs
          title={`${id ? 'Sửa' : 'Thêm'} giao dịch`}
          items={[{ link: '/accounting/transaction/index', text: 'Kế toán' }]}
        />
        <ProForm form={form} onFinish={handleSubmit}>
          <ProFormContent>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={8} md={8} lg={8}>
                <Paper sx={{ p: 2, pb: 5 }}>
                  <Stack mb={1.5}>
                    <ErrorOutline />
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {'Thông tin giao dịch'}
                    </Typography>
                  </Stack>

                  <Divider />

                  <Grid container spacing={2} mt={2} justifyContent="start">
                    <Grid item xs={12} sm={12} md={6}>
                      <ProFormDate
                        name="transactionDate"
                        type="start"
                        max={true}
                        valueMax={new Date()}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                      <ProFormSelect
                        name="audienceType"
                        placeholder="Loại đối tượng"
                        options={[
                          { value: 0, label: 'Khách hàng' },
                          { value: 1, label: 'Nhà cung cấp VN' },
                          { value: 2, label: 'Nhà cung cấp TQ ' },
                          { value: 3, label: 'Nhân viên' },
                          { value: 4, label: 'Khác' },
                        ]}
                        onSelect={(e) => {
                          if (e === 2) {
                            tableRef.current?.arrayCols
                              .find((item) => item.id === 'amountCny')
                              ?.toggleVisibility(true);
                          } else {
                            tableRef.current?.arrayCols
                              .find((item) => item.id === 'amountCny')
                              ?.toggleVisibility(false);
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                      <ProFormSelect
                        name="ticketType"
                        placeholder="Loại phiếu"
                        options={[
                          { value: 0, label: 'Phiếu nhập' },
                          { value: 1, label: 'Phiếu xuất' },
                          { value: 2, label: 'Báo nợ' },
                          { value: 3, label: 'Báo có' },
                          { value: 4, label: 'Phiếu thu' },
                          { value: 5, label: 'Phiếu chi' },
                          { value: 6, label: 'Kết chuyển' },
                          { value: 7, label: 'Khác' },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                      {/* <ProFormTextField
                        name="audienceCode"
                        placeholder="Đối tượng"
                      /> */}
                      {audienceType !== 4 && (
                        <ProFormAutocompleteSingal<FieldValues, string>
                          name="audienceId"
                          placeholder={'Đối tượng'}
                          options={masterDataListAudience}
                          renderLabel={(option) => option?.value}
                          renderValue={(option) => option?.id}
                          setTextSearchValue={setTextSearchValue}
                          onKeyUp={(e) =>
                            setTimeout(() => {
                              setTextSearchValue(
                                (e.target as HTMLInputElement).value
                              );
                            }, 1700)
                          }
                        />
                      )}
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                      <ProFormTextField
                        name="documentCode"
                        placeholder="Chứng từ ngoài"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Paper sx={{ p: 2, pb: 5 }}>
                  <Stack mb={1.5}>
                    <PriorityHighIcon />
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {'Thông tin thêm'}
                    </Typography>
                  </Stack>

                  <Divider />

                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    {/* <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Stack direction="row">
                        <ProFormTextField title={'Ảnh'} name="imageUrls" />
                        <Button variant="contained" component="label">
                          Upload
                          <UploadInput
                            accept="image/*"
                            onChange={onSelectFileImage}
                          />
                        </Button>
                      </Stack>
                    </Grid> */}

                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <ProFormTextField
                        name="note"
                        placeholder="Ghi chú"
                        multiline
                        rows="auto"
                        // InputProps={{
                        //   startAdornment: (
                        //     <InputAdornment position="start">
                        //       <ChatBubbleIcon />
                        //     </InputAdornment>
                        //   ),
                        // }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>

            {/* fix Table */}
            <Paper sx={{ p: 1, pb: 5, mt: 5 }}>
              <ProTable<TableCreateEntry>
                ref={tableRef}
                loading={loadingGet}
                columns={columns}
                data={fields}
                onRowEditableChange={handleRowEditableChange}
                getRowId={(row) => row.id}
                form={form}
                initialstate={{
                  hiddenColumns: hiddenColumns,
                  hiddenVisibilityColumns: true,
                }}
                editable
                hideFooter
                toolBar={
                  <ActionButton
                    actionType="save"
                    type="submit"
                    loading={loadingCreate}
                  >
                    Lưu
                  </ActionButton>
                }
                rightToolBar={
                  <Fragment>
                    <IconButton onClick={handleAddRow} color="primary">
                      <AddCircleIcon sx={{ color: '#AB1D1D' }} />
                    </IconButton>
                  </Fragment>
                }
              />
              <Stack
                direction={'row'}
                spacing={4}
                alignItems={'center'}
                justifyContent={'flex-end'}
                sx={{ p: 1 }}
              >
                {audienceType === 2 && (
                  <Typography fontWeight={'bold'} color={'primary'}>
                    TT NDT: {totalNDTValue()}
                  </Typography>
                )}
                <Typography fontWeight={'bold'} color={'primary'}>
                  TT VND: {totalVNDValue()}
                </Typography>
              </Stack>
            </Paper>
            <FormControl>
              {/* <RadioGroup
                row
                sx={{ mt: 4, mb: 4 }}
                value={radioVal}
                onChange={handleChangeRadio}
              >
                <FormControlLabel
                  value="1"
                  control={<Radio />}
                  label="Tiếp tục thêm giao dịch"
                />
                <FormControlLabel
                  value="2"
                  control={<Radio />}
                  label="Danh sách giao dịch"
                />
              </RadioGroup> */}
            </FormControl>
          </ProFormContent>
        </ProForm>
      </PageWrapper>
    </Fragment>
  );
};

export default TransactionCreate;
