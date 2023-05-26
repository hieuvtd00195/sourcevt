import styled from '@emotion/styled';
import CallIcon from '@mui/icons-material/Call';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import {
  Box,
  Button,
  Collapse,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  Typography,
} from '@mui/material';
import ActionButton from 'components/ProButton/ActionButton';
import ProFormAutocomplete from 'components/ProForm/Label/ProFormAutocomplete';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormAutoCompleteDoubleFind from 'components/ProForm/ProFormAutoCompleteDoubleFind';
import ProFormDate from 'components/ProForm/ProFormDate';
import ProFormSelect from 'components/ProForm/ProFormSelect';
import { useCallback, useEffect, useState } from 'react';
import { FieldErrors, useForm, useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  getBillCustomerEmployee,
  getBillCustomerEmployeeList,
  getCustomerProductDropListStore,
  getListCustomerProductDrop,
  saveCustomerBill,
} from 'slices/billCustomerApplicationSlice';
import { AppDispatch } from 'store';
import ProFormAutoCompleteFreeSolo from 'components/ProForm/ProFormAutoCompleteFreeSolo';
import { getMasterDataListProvince, getProvinceList } from 'slices/masterData';
import { APISaveCustomerBill } from 'services/billCustomerApplication';
import ProForm from 'components/ProForm';
import useNotification from 'hooks/useNotification';
import useRefresh from 'hooks/useRefresh';
import Numeral from 'utils/Numeral';
import { getTotalDebtCustomer } from 'slices/debtCustomer';

const TextStyled = styled(Typography)`
  font-weight: 700;
  font-size: 16px;
  line-height: 17px;
  /* identical to box height */

  display: flex;
  align-items: center;

  color: #000000;
`;
type Props = {
  errors: FieldErrors<any>;
};
const Customer = () => {
  const {
    control,
    register,
    reset,
    watch,
    setValue,
    trigger,
    formState: { errors, isDirty, isSubmitting, touchedFields, submitCount },
  } = useFormContext<any>();
  const [collapse, setCollapse] = useState<boolean>(true);
  const [textSearchCustomerName, setTextSearchCustomerName] = useState('');
  const [totaldebt, setTotaldebt] = useState(0);
  const [textSearchCustomerPhone, setTextSearchCustomerPhone] = useState('');
  const [customerPriceInfor, setCustomerPriceIntor] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const [refresh, refetch] = useRefresh();
  const setNotification = useNotification();
  //Get Data Store
  const customerProductDropList = useSelector(getCustomerProductDropListStore);
  const employeeList = useSelector(getBillCustomerEmployeeList);

  const ProvinceList = useSelector(getMasterDataListProvince);
  const customerName = watch('customerName');
  const customerPhone = watch('customerPhone');

  const fetchCustomerDropProduct = async () => {
    const body = {
      customerName: '',
      customerPhone: '',
    };
    try {
      await dispatch(getListCustomerProductDrop(body));
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchCustomerDropProduct();
  }, [textSearchCustomerName, textSearchCustomerPhone, refresh]);

  const fetchProvince = async () => {
    try {
      await dispatch(getProvinceList({}));
    } catch (error) {
    } finally {
    }
  };

  const fetcEmployeeList = async () => {
    try {
      await dispatch(getBillCustomerEmployee({}));
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchProvince();
    fetcEmployeeList();
  }, []);

  const handleSubmit = async () => {
    const body = {
      customerId: watch('customerId'),
      customerName: watch('customerName'),
      customerType: watch('customerType'),
      provinceId: watch('provinceId'),
      customerPhone: watch('customerPhone'),
      address: watch('address'),
      note: watch('note'),
      employeeCare: watch('employeeCare'),
      employeeSell: watch('employeeSell'),
    };

    try {
      setLoading(true);
      const rest: any = await dispatch(saveCustomerBill(body));

      if (rest.payload) {
        const customerId = rest.payload.data.id;

        setNotification({
          message: 'Lưu thông tin khách hàng thành công',
          severity: 'success',
        });
        setValue('customerId', customerId);
        refetch();
      } else {
        setNotification({
          error: rest.error.message,
        });
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchTotalMissPay = () => {
    const total = watch('form');
    let TTParent = 0;
    let TTChild = 0;
    let totalBeforeDisscount = 0;
    let totalBeforeVat = 0;
    const discountType = watch('discountUnit');
    const discountRate = watch('discountValue');
    const vatValue = watch('vatValue');
    const vatUnit = watch('vatUnit');
    const Tienmat = watch('cash') ? watch('cash') : 0;
    const Chuyenkhoan = watch('banking') ? watch('banking') : 0;
    total?.forEach((item: any, index: any) => {
      TTParent += item.quantity * item.price;
      if (item.productChildren) {
        item.productChildren.forEach((ch: any) => {
          TTChild += ch.quantity * ch.price;
        });
      }
    });
    const totalValue = TTParent + TTChild;
    if (discountType === 0) {
      totalBeforeDisscount = (totalValue * discountRate) / 100;
    } else {
      totalBeforeDisscount = totalValue - discountRate;
    }
    if (vatUnit === 0) {
      totalBeforeVat = (totalBeforeDisscount * vatValue) / 100;
    } else {
      totalBeforeVat = vatValue;
    }
    const lastTotalBeforeDisscountVAT =
      totalValue - totalBeforeDisscount + Number(totalBeforeVat);
    const totalMoneyVendorHave = Number(Tienmat) + Number(Chuyenkhoan);
    const totalMissing = lastTotalBeforeDisscountVAT - totalMoneyVendorHave;

    return <>{Numeral.price(totalMissing)}</>;
  };

  const fetchCNCuoi = () => {
    const total = watch('form');
    let TTParent = 0;
    let TTChild = 0;
    let totalBeforeDisscount = 0;
    let totalBeforeVat = 0;
    const discountType = watch('discountUnit');
    const discountRate = watch('discountValue');
    const vatValue = watch('vatValue');
    const vatUnit = watch('vatUnit');
    const Tienmat = watch('cash') ? watch('cash') : 0;
    const Chuyenkhoan = watch('banking') ? watch('banking') : 0;
    total?.forEach((item: any, index: any) => {
      TTParent += item.quantity * item.price;
      if (item.productChildren) {
        item.productChildren.forEach((ch: any) => {
          TTChild += ch.quantity * ch.price;
        });
      }
    });
    const totalValue = TTParent + TTChild;
    if (discountType === 0) {
      totalBeforeDisscount = (totalValue * discountRate) / 100;
    } else {
      totalBeforeDisscount = totalValue - discountRate;
    }
    if (vatUnit === 0) {
      totalBeforeVat = (totalBeforeDisscount * vatValue) / 100;
    } else {
      totalBeforeVat = vatValue;
    }
    const lastTotalBeforeDisscountVAT =
      totalValue - totalBeforeDisscount + Number(totalBeforeVat);
    const totalMoneyVendorHave = Number(Tienmat) + Number(Chuyenkhoan);
    const totalMissing = lastTotalBeforeDisscountVAT - totalMoneyVendorHave;
    const CNCuoi = customerPriceInfor.cn ? customerPriceInfor?.cn : 0;
    const totalLastCn = totalMissing + Number(CNCuoi);
    const finalCNCuoi = totaldebt + totalLastCn;
    return <>{Numeral.price(finalCNCuoi)}</>;
  };

  const fetchTotalDebtCustomer = async (id: string) => {
    const body = {
      customerId: id,
      toDate: new Date(),
    };
    try {
      const response: any = await dispatch(getTotalDebtCustomer(body));
      if (response) {
        setTotaldebt(response.payload.debt);
      }
    } catch (error) {}
  };

  // useEffect(() => {
  //   if (!customerName || !customerPhone) {
  //     setValue('customerPhone', '');
  //     setValue('customerName', '');
  //     setValue('customerId', '');
  //     setValue('customerType', '');
  //     setValue('address', '');
  //     setValue('provinceId', '');
  //   }
  // }, [customerName, customerPhone]);

  return (
    <Paper sx={{ p: 3, pb: 4, pt: 1 }}>
      <Box
        sx={{
          marginTop: '10px',
          paddingBottom: 1,
          px: 1,
        }}
      >
        <Grid container spacing={2} sx={{ marginTop: 1, alignItems: 'center' }}>
          <Grid item xs={12} md={6}>
            <TextStyled> Thông tin khách hàng</TextStyled>
          </Grid>
          <Grid item xs={12} md={5}>
            <Collapse in={collapse} timeout="auto">
              <Box style={{ display: 'flex', gap: 5 }}>
                <Grid item xs={12} md={12}>
                  <ProFormAutocomplete
                    {...register('employeeCare')}
                    name="employeeCare"
                    placeholder="Nhân viên chăm sóc"
                    options={employeeList}
                    renderLabel={(option) => option.name}
                    renderValue={(option) => option.id}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <ProFormAutocomplete
                    {...register('employeeSell')}
                    name="employeeSell"
                    placeholder="Nhân viên bán hàng"
                    options={employeeList}
                    renderLabel={(option) => option.name}
                    renderValue={(option) => option.id}
                  />
                </Grid>
              </Box>
            </Collapse>
          </Grid>
          <Grid item xs={12} md={1}>
            <Button onClick={() => setCollapse(!collapse)} color="inherit">
              <ExpandMoreIcon
                sx={!collapse ? { transform: 'rotate(180deg)' } : null}
              />
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ p: 1, mb: 2, borderBottomWidth: 1 }} />
        <Grid
          item
          xs={12}
          md={12}
          container
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <Grid
            item
            xs={8}
            md={8}
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Grid item xs={4}>
              <Typography
                gutterBottom
                variant="subtitle2"
                sx={{ color: 'primary.main' }}
              >
                GHCN: {Numeral.price(customerPriceInfor.debtLimit) || 0}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                gutterBottom
                variant="subtitle2"
                sx={{ color: 'primary.main' }}
              >
                Tổng: {fetchTotalMissPay()}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography gutterBottom variant="subtitle2">
                CN: {Numeral.price(totaldebt) || 0}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                gutterBottom
                variant="subtitle2"
                sx={{ color: 'primary.main' }}
              >
                CN cuối: {fetchCNCuoi()}
              </Typography>
            </Grid>
          </Grid>
          <Grid direction="row" justifyContent="flex-end" alignItems="flex-end">
            <ActionButton
              iconPosition="start"
              color="info"
              onClick={async () => {
                const result = await trigger([
                  'customerName',
                  'customerPhone',
                  'customerType',
                  'provinceId',
                  'address',
                ]);
                if (result) {
                  handleSubmit();
                }
              }}
            >
              <PersonIcon />
              Lưu thông tin
            </ActionButton>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ marginTop: 1 }}>
          <Grid item xs={12} md={4}>
            <ProFormAutoCompleteFreeSolo
              {...register('customerName', {
                required: true,
              })}
              name="customerName"
              placeholder={'Tên khách hàng'}
              options={customerProductDropList}
              renderLabel={(option) => option?.customerName}
              renderValue={(option) => option?.customerName}
              setTextSearchValue={setTextSearchCustomerName}
              onBlur={(e) => {
                const phoneNumber = watch('customerPhone')
                const name = e.target.value;
                const findItem = customerProductDropList.find(
                  (item) => item.customerName === name
                );
                const findItemByPhone = customerProductDropList.find(
                  (item) => item.customerPhone === customerPhone
                );
                if (!customerName) {
                  setValue('customerPhone', '');
                  setValue('customerName', '');
                  setValue('customerId', null);
                  setValue('customerType', '0');
                  setValue('address', '');
                  setValue('provinceId', '');
                }
                if(!findItem && ! findItemByPhone){
                  setValue('customerId', null);
                }
              }}
              onSelect={(value) => {
                if (value) {
                  const findItem = customerProductDropList.find(
                    (item) => item.customerName === value
                  );

                  setCustomerPriceIntor(findItem);
                  if (findItem) {
                    fetchTotalDebtCustomer(findItem.customerId);
                    reset({
                      ...watch(),
                      customerPhone: findItem.customerPhone,
                      customerId: findItem.customerId,
                      customerName: findItem.customerName,
                      customerType: findItem.customerType,
                      address: findItem.address,
                      provinceId: findItem.provinceId,
                    });
                  }
                } else {
                  setCustomerPriceIntor(0);
                }
              }}
              valueSelect={watch('customerName')}
              onKeyUp={(e) =>
                setTimeout(() => {
                  setTextSearchCustomerName(
                    (e.target as HTMLInputElement).value
                  );
                }, 1000)
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ProFormAutoCompleteFreeSolo
              {...register('customerPhone', {
                required: true,
              })}
              name="customerPhone"
              placeholder={'Số điện thoại'}
              options={customerProductDropList}
              renderLabel={(option) => option?.customerPhone}
              renderValue={(option) => option?.customerPhone}
              setTextSearchValue={setTextSearchCustomerPhone}
              onBlur={() => {
                if (!customerPhone) {
                  setValue('customerPhone', '');
                  setValue('customerName', '');
                  setValue('customerId', '');
                  setValue('customerType', '0');
                  setValue('address', '');
                  setValue('provinceId', '');
                }
              }}
              onSelect={(value) => {
                if (value) {
                  const findItem = customerProductDropList.find(
                    (item) => item.customerPhone === value
                  );
                  setCustomerPriceIntor(findItem);
                  if (findItem) {
                    reset({
                      ...watch(),
                      customerPhone: findItem.customerPhone,
                      customerId: findItem.customerId,
                      customerName: findItem.customerName,
                      customerType: findItem.customerType,
                      address: findItem.address,
                      provinceId: findItem.provinceId,
                    });
                  }
                }
              }}
              valueSelect={watch('customerPhone')}
              onKeyUp={(e) =>
                setTimeout(() => {
                  setTextSearchCustomerPhone(
                    (e.target as HTMLInputElement).value
                  );
                }, 1000)
              }
            />
          </Grid>

          <Grid item xs={12} md={4}>
            {/* <ProFormSelect
              {...register('customerType', {
                required: true,
              })}
              disabled
              name="customerType"
              defaultValue={'0'}
              placeholder={'Loại khách hàng'}
              options={[
                { value: '0', label: 'Khách lẻ' },
                { value: '1', label: 'Khách sỉ' },
                { value: '2', label: 'Đại lý' },
              ]}
            /> */}
            <ProFormSelect
              name="customerType"
              placeholder={'Loại khách hàng'}
              options={[
                { value: '0', label: 'Khách lẻ' },
                { value: '1', label: 'Khách SPA' },
                { value: '2', label: 'Đại lý' },
              ]}
              defaultValue={'0'}
              renderLabel={(option) => option.label}
              renderValue={(option) => option.value}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <ProFormAutocomplete
              {...register('provinceId', {
                required: true,
              })}
              name="provinceId"
              placeholder="Thành phố"
              options={ProvinceList}
              renderLabel={(option) => option.name}
              renderValue={(option) => option.id}
            />
          </Grid>
          <Grid item xs={12} md={9}>
            <ProFormTextField
              name="address"
              placeholder="Địa chỉ"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HomeIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <ProFormTextField
              name="employeeNote"
              placeholder="Ghi chú"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EditIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* <Grid item xs={12} md={3}>
            <ActionButton iconPosition="start" color="info">
              <PersonIcon />
              Lưu thông tin
            </ActionButton>
          </Grid> */}
        </Grid>
      </Box>
    </Paper>
  );
};

export default Customer;
