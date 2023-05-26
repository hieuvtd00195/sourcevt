import { yupResolver } from '@hookform/resolvers/yup';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import {
  Divider,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import ProFormAutoCompleteDoubleFind from 'components/ProForm/ProFormAutoCompleteDoubleFind';
import ProFormContent from 'components/ProForm/ProFormContent';
import ProFormDate from 'components/ProForm/ProFormDate';
import ProFormSelect from 'components/ProForm/ProFormSelect';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import useNotification from 'hooks/useNotification';
import { isEmpty } from 'lodash';
import { PriceInput } from 'plugins/NumberFormat';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  APIPaymentreciptGet,
  APIUpdatePaymentReceipt,
} from 'services/paymentReceipt';
import {
  getListMasterDataAccount,
  getListMasterDataAudience,
} from 'slices/masterData';
import {
  getDebt,
  postDebtSearch,
  postPaymentReceiptCreate,
} from 'slices/paymentReceipt';
import { AppDispatch, useTypedSelector } from 'store';
import Numeral from 'utils/Numeral';
import { validationSchema } from './utils/schema';
import {
  AccountingAccountType,
  AddCash,
  ResponseAccountingAccountType,
} from './utils/types';

const AddcashTable = () => {
  const { id } = useParams();
  // const [radioValue, setRadioValue] = useState<string>('1');
  const [accountingAccount, setAccountingAccount] = useState<
    AccountingAccountType[]
  >([]);
  const [account, setAccount] = useState<AccountingAccountType[]>([]);
  const setNotification = useNotification();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  // const audientList = useSelector(getMasterDataListAudience);

  const { MasterDataAudience: audientList } = useTypedSelector(
    (state) => state.masterData
  );
  const debtData = useSelector(getDebt);

  const form = useForm<AddCash>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const handleSubmit = async (value: any) => {
    let params = {
      ...value,
      amountVND: Number(value.amountVND),
      amountCNY: value.amountCNY ? Number(value.amountCNY) : null,
      audienceId: value?.audienceId ? value?.audienceId : null,
      reciprocalAccountCode: value.reciprocalAccountCode
        ? value.reciprocalAccountCode
        : null,
    };
    if (value.audienceId === '') {
      const { audienceId, ...res } = params;
      params = res;
    }

    if (id) {
      try {
        await APIUpdatePaymentReceipt({ ...params, id });

        setNotification({
          message: 'Cập nhật phiếu thu chi thành công',
        });
        navigate('/accounting/cashbook');
      } catch (err) {
        setNotification({
          error: 'Cập nhật phiếu thu chi không thành công',
        });
      } finally {
      }
      return;
    }

    try {
      const response = await dispatch(postPaymentReceiptCreate(params));
      if (!response.payload) {
        setNotification({
          error: 'Tạo phiếu thu chi không thành công',
        });
      } else {
        setNotification({
          message: 'Tạo phiếu thu chi thành công',
        });
        navigate('/accounting/cashbook');
      }
    } catch (err) {
      console.log(err);
      setNotification({
        error: 'Tạo phiếu thu chi không thành công',
      });
    } finally {
    }
  };

  const audientType = form.watch('audienceType');
  const ticketType = form.watch('ticketType');

  useEffect(() => {
    if (!ticketType) {
      return;
    }
    if (ticketType !== 10) {
      dispatch(
        getListMasterDataAccount({
          searchText: '',
          accountCode: [],
          parentAccountCode: [parentAccount(ticketType)],
        })
      )
        .then((res: ResponseAccountingAccountType) => {
          setAccount(res.payload);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (audientType !== 4) {
      return;
    } else {
      dispatch(
        getListMasterDataAccount({
          searchText: '',
          accountCode: [],
          parentAccountCode: ticketType === 10 ? ['111', '112'] : [],
        })
      )
        .then((res: ResponseAccountingAccountType) => {
          setAccountingAccount(res.payload);
          ticketType === 10 && setAccount(res.payload);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [audientType, dispatch, ticketType]);

  const renderlabel = (type: number | null) => {
    switch (type) {
      case 0:
        return 'khách hàng';
      case 1:
        return 'nhà cung cấp VN';
      case 2:
        return 'nhà cung cấp TQ';
      case 3:
        return 'nhân viên';
      default:
        break;
    }
  };

  const parentAccount = (type: number | string) => {
    switch (type) {
      case 2:
      case 3:
        return '111';
      case 4:
      case 5:
        return '112';
      default:
        break;
    }
  };

  const onSelectAudientType = useCallback(
    async (e: number | string) => {
      if (e === 4) {
        form.setValue('audienceId', null);
        return;
      }
      form.setValue('reciprocalAccountCode', null);
      setAccountingAccount([]);
      const params = {
        searchText: '',
        pageSize: 0,
        audienceType: e,
      };
      try {
        await dispatch(getListMasterDataAudience(params));
      } catch (err) {
        console.log(err);
      } finally {
        form.reset(form.getValues());
      }
    },
    [dispatch, form]
  );
  const renderAmount = () => {
    const amoutVND = form.watch('amountVND');
    const ticketType = form.watch('ticketType');
    switch (ticketType) {
      case 2:
      case 4:
        return debtData[0]?.endDebt
          ? Numeral.price(debtData[0]?.endDebt + Number(amoutVND))
          : Numeral.price(debtData[0]?.endCredit + Number(amoutVND));

      case 3:
      case 5:
        return debtData[0]?.endDebt
          ? Numeral.price(debtData[0]?.endDebt - Number(amoutVND))
          : Numeral.price(debtData[0]?.endCredit - Number(amoutVND));
      default:
        break;
    }
  };

  const onSelectTicketType = useCallback(
    async (e: number | string) => {
      if (e === 10) {
        form.setValue('audienceType', 4);
      }
    },
    [form]
  );

  const onSelectAudient = async (e: string | number | null) => {
    const params = {
      orderBy: null,
      orderDirection: null,
      pageIndex: 1,
      pageSize: 25,
      supplierId: e,
      phoneNumber: null,
      debtType: null,
      searchDateFrom: null,
      searchDateTo: new Date(),
      type: null,
      supplierCode: null,
      ndt: null,
    };
    try {
      await dispatch(postDebtSearch(params));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!id) return;
    APIPaymentreciptGet(id)
      .then((data) => {
        form.reset(data);
        data.audienceType && onSelectAudientType(data.audienceType);
        data.ticketType && onSelectTicketType(data.ticketType);
      })
      .catch(console.log);
  }, [form, id, onSelectAudientType, onSelectTicketType]);

  return (
    <PageWrapper title={id ? 'Sửa phiếu thu chi' : 'Thêm phiếu thu chi'}>
      <PageBreadcrumbs
        title={id ? 'Sửa phiếu thu chi' : 'Thêm phiếu thu chi'}
        items={[{ link: '/accounting/cashbook', text: 'Tổng hợp thu chi' }]}
      />
      <ProForm form={form} onFinish={handleSubmit}>
        <ProFormContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={8} md={8} lg={8}>
              <Paper sx={{ p: 2, pb: 5 }}>
                <Stack mb={1.5}>
                  <ErrorOutlineIcon />
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {'Thông tin'}
                  </Typography>
                </Stack>
                <Divider />
                <Grid container spacing={2} sx={{ mt: 0 }}>
                  {form.watch('audienceType') !== null &&
                    form.watch('audienceType') !== 4 && (
                      <Grid item xs={12} sm={12} lg={12}>
                        <Typography variant="subtitle2">
                          {debtData[0]?.endDebt
                            ? `Hiện tại  ${renderlabel(
                                form.watch('audienceType')
                              )} đang nợ:`
                            : `Hiện tại đang nợ ${renderlabel(
                                form.watch('audienceType')
                              )}: `}

                          <span style={{ color: 'red' }}>
                            {debtData[0]?.endDebt
                              ? Numeral.price(debtData[0]?.endDebt)
                              : Numeral.price(debtData[0]?.endCredit)}
                          </span>
                        </Typography>
                        <Typography variant="subtitle2">
                          {`Sau khi ${
                            id ? 'sửa' : 'thêm'
                          } phiếu sẽ nợ  ${renderlabel(
                            form.watch('audienceType')
                          )}:`}

                          <span style={{ color: 'red' }}>{renderAmount()}</span>
                        </Typography>
                      </Grid>
                    )}

                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormDate
                      name="transactionDate"
                      DatePickerProps={{ label: 'Ngày thu chi' }}
                      type="start"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormSelect
                      name="audienceType"
                      placeholder="Loại đối tượng"
                      options={[
                        { value: 0, label: 'Khách hàng' },
                        { value: 1, label: 'Nhà cung cấp VN' },
                        { value: 2, label: 'Nhà cung cấp TQ' },
                        { value: 3, label: 'Nhân viên' },
                        { value: 4, label: 'Khác' },
                      ]}
                      renderLabel={(option) => option.label}
                      renderValue={(option) => option.value}
                      onSelect={(e) => onSelectAudientType(e)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormSelect
                      name="ticketType"
                      placeholder="Loại phiếu"
                      options={[
                        { value: 4, label: 'Phiếu thu' },
                        { value: 5, label: 'Phiếu chi' },
                        { value: 2, label: 'Báo nợ' },
                        { value: 3, label: 'Báo có' },
                        { value: 10, label: 'Phiếu chuyển quỹ' },
                      ]}
                      renderLabel={(option) => option.label}
                      renderValue={(option) => option.value}
                      onSelect={(e) => onSelectTicketType(e)}
                    />
                  </Grid>
                  {form.watch('audienceType') !== 4 ? (
                    <Grid item xs={12} sm={12} lg={6}>
                      <ProFormAutoCompleteDoubleFind
                        name="audienceId"
                        placeholder="Đối tượng"
                        options={audientList}
                        renderLabel={(option) => option?.value}
                        renderValue={(option) => option?.id}
                        onSelect={(e) => onSelectAudient(e)}
                      />
                    </Grid>
                  ) : (
                    <Grid item xs={12} sm={12} lg={6}>
                      <ProFormAutoCompleteDoubleFind
                        name="reciprocalAccountCode"
                        placeholder="Tài khoản đối ứng"
                        options={accountingAccount}
                        renderLabel={(option) => option?.value}
                        renderValue={(option) => option?.code}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12} sm={12} lg={6}>
                    <ProFormAutoCompleteDoubleFind
                      name="accountCode"
                      placeholder="Tài khoản"
                      options={account}
                      renderLabel={(option) => option?.value}
                      renderValue={(option) => option?.code}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <Paper sx={{ p: 2, pb: 5 }}>
                <Stack mb={1.5}>
                  <LocalAtmIcon />
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {'Thanh toán'}
                  </Typography>
                </Stack>
                <Divider />
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {form.watch('audienceType') === 2 && (
                    <Grid item xs={12} sm={12} lg={12}>
                      <ProFormTextField
                        name="amountCNY"
                        placeholder="Số tiền tệ"
                        InputProps={{
                          inputComponent: PriceInput,
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocalAtmIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12} sm={12} lg={12}>
                    <ProFormTextField
                      name="amountVND"
                      placeholder="Số tiền VND"
                      InputProps={{
                        inputComponent: PriceInput,
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocalAtmIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={12}>
                    <ProFormTextField
                      name="note"
                      placeholder="Ghi chú"
                      multiline
                      rows={2}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ChatBubbleIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
          {/* <FormControl>
            <RadioGroup
              row
              sx={{ mt: 4, mb: 4 }}
              value={radioValue}
              onChange={handleChangeRaio}
            >
              <FormControlLabel
                value="1"
                control={<Radio />}
                label="Tiếp tục thêm phiếu thu chi"
              />
              <FormControlLabel
                value="2"
                control={<Radio />}
                label="Về danh sách thu chi"
              />
            </RadioGroup>
          </FormControl> */}
        </ProFormContent>
        <Stack spacing={2} mt={2}>
          <ActionButton actionType="save" variant="contained" type="submit">
            Lưu
          </ActionButton>
          {/* <Button startIcon={<PrintIcon />} sx={{ backgroundColor: '#2196F3' }}>
            Lưu và In
          </Button> */}
        </Stack>
      </ProForm>
    </PageWrapper>
  );
};

export default AddcashTable;
