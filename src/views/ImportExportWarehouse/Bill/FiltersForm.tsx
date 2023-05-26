import { yupResolver } from '@hookform/resolvers/yup';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, ButtonGroup, Collapse } from '@mui/material';
import Grid from '@mui/material/Grid';
import { nanoid } from '@reduxjs/toolkit';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProForm from 'components/ProForm';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormAutocomplete from 'components/ProForm/ProFormAutocomplete';
import ProFormAutocompleteSingal from 'components/ProForm/ProFormAutocompleteSingal';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';
import ProFormHiddenInput from 'components/ProForm/ProFormHiddenInput';
import { isEmpty } from 'lodash';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { APIGetProduct } from 'services/saleOrder';
import {
  getListMasterData,
  getListMasterDataAudience,
  getMasterDataList,
  getMasterDataListAudience,
} from 'slices/masterData';
import {
  getListStoreApplication,
  getStoreApplicationList,
} from 'slices/storeApplication';
import { AppDispatch } from 'store';
import type { FiltersRef } from 'types/refs';
import Validation from 'utils/Validation';
import { IProduct } from 'views/Inventory/OrderSlip/AddOrderSlip/utils/types';
import type { FilterParams } from './utils/filters';
import { useSearchParams } from 'react-router-dom';
import DateTime from 'utils/DateTime';

interface FilterValues {
  [key: string]: any;
}
interface MasterDataList {
  [key: string]: any;
}

interface Props {
  onSearch: (params: Partial<FilterParams>) => void;
  onSubmit: VoidFunction;
  codeQueryURL: string | null;
  onClear: (params: Partial<FilterParams>) => void;
}

const schema = Validation.shape({
  storeIds: Validation.array().optional().default([]),
  billCode: Validation.string().optional(),
  billType: Validation.option().optional(),
  dateFrom: Validation.date().optional(),
  dateTo: Validation.date().optional(),
  orderCode: Validation.string().optional(),
  audienceType: Validation.option().optional(),
  idphieukiemkho: Validation.string().optional(),
  note: Validation.string().optional(),
  idphieubaohanh: Validation.string().optional(),
  draftTransferBillCode: Validation.string().optional(),
});

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { onSearch, onClear, codeQueryURL } = props;
  const [searchParams] = useSearchParams();
  const billCodeQueryURL = searchParams.get('billCode') || null;
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const [openExpand, setOpenExpand] = useState<boolean>(false);
  const [productListOption, setProductListOption] = useState<IProduct[]>([]);
  const storeApplicationList = useSelector(getStoreApplicationList);
  const masterDataList = useSelector(getMasterDataList);
  const masterDataListAudience = useSelector(getMasterDataListAudience);
  const [textValueSearch, setTextSearchValue] = useState('');
  const [oldValue, setOldValue] = useState<{
    audienceId: MasterDataList | undefined;
    numberPhone: MasterDataList | undefined;
  }>({
    audienceId: undefined,
    numberPhone: undefined,
  });

  const form = useForm<FilterValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  useEffect(() => {
    Promise.all([APIGetProduct()])
      .then(([productRes]) => {
        setProductListOption(productRes);
      })
      .catch((error) => console.error(error))
      .finally(() => { });
  }, []);

  const fetchMasterData = async () => {
    const body = {
      warehousingBillType:
        form.watch('billType') === 2
          ? null
          : form.watch('billType') === 0
            ? 0
            : form.watch('billType'),
      audienceType: null,
      ticketType: null,
      documentType: null,
      isWarehousingBillForm: false,
    };
    try {
      //   if (form.watch('billType') !== null) {
      await dispatch(getListMasterData(body));
      //   }
    } catch (error) {
    } finally {
    }
  };

  const fetchMasterDataAudience = async () => {
    const body = {
      audienceType:
        form.watch('audienceType') === 3
          ? null
          : form.watch('audienceType') === 0
            ? 0
            : form.watch('audienceType'),
      searchText: textValueSearch,
    };
    try {
      //   if (form.watch('audienceType') !== null) {
      await dispatch(getListMasterDataAudience(body));
      //   }
    } catch (error) {
    } finally {
    }
  };

  const fetchDataStoreApplication = async () => {
    try {
      await dispatch(getListStoreApplication({}));
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    if (!codeQueryURL) return;
    form.setValue('billCode', codeQueryURL);
  }, [codeQueryURL]);

  useEffect(() => {
    fetchDataStoreApplication();
  }, []);

  useEffect(() => {
    fetchMasterDataAudience();
  }, [form.watch('audienceType'), textValueSearch]);

  useEffect(() => {
    fetchMasterData();
  }, [form.watch('billType')]);

  const handleSubmit = (values: FilterValues) => {
    const body = {
      ...values,
      billType: values.billType === 2 ? null : values.billType,
      audienceType: values.audienceType === 3 ? null : values.audienceType,
      dateFrom: DateTime.Format(values.dateFrom, 'YYYY-MM-DD'),
      dateTo: DateTime.Format(values.dateTo, 'YYYY-MM-DD'),
    };
    onSearch(body);
  };

  const handleExpand = () => {
    setOpenExpand((prev) => !prev);
  };

  const handleReset = () => {
    form.reset({
      ...schema.getDefault(),
      audienceId: null,
      documentDetailType: [],
      productId: null,
    });
    onClear({
      ...schema.getDefault(),
      audienceId: null,
      documentDetailType: [],
      productId: null,
    });
  };

  useImperativeHandle(ref, () => ({
    reset: handleReset,
    submit: form.handleSubmit(handleSubmit),
  }));

  function checkItemExist(
    item: MasterDataList | undefined,
    array: MasterDataList[]
  ) {
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

  return (
    <ProForm form={form} onFinish={handleSubmit} PaperProps={{ sx: { p: 2 } }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormCheckboxSelect<FieldValues, number>
            name="storeIds"
            placeholder={t('Cửa hàng')}
            options={storeApplicationList}
            renderLabel={(option) => option?.name}
            renderValue={(option) => option?.id}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormTextField
            name="billCode"
            placeholder={t('Nhập ID')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormSelect
            name="billType"
            placeholder={t('Chọn loại phiếu')}
            options={[
              { value: 0, label: 'Nhập' },
              { value: 1, label: 'Xuất' },
              { value: 2, label: 'Tất cả' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormCheckboxSelect<FieldValues, number>
            name="documentDetailType"
            placeholder={t('Chọn kiểu')}
            options={masterDataList}
            renderLabel={(option) => option?.value}
            renderValue={(option) => option?.id}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProDateRange
          //  label={t('Từ - đến')} 
           from="dateFrom" to="dateTo" />
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={1.5}>
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button type="submit">Lọc</Button>
            <Button
              variant="contained"
              endIcon={openExpand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={handleExpand}
              size="medium"
            />
          </ButtonGroup>
        </Grid>
        <Grid item xs={12} lg={12}>
          <Collapse in={openExpand} timeout="auto">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <ProFormTextField
                  name="orderCode"
                  placeholder={t('ID phiếu đặt hàng')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <ProFormSelect
                  name="audienceType"
                  placeholder={t('Loại đối tượng')}
                  options={[
                    { value: 0, label: 'Khách hàng' },
                    { value: 1, label: 'Nhà cung cấp' },
                    { value: 3, label: 'Tất cả' },
                  ]}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <ProFormAutocompleteSingal
                  name="audienceId"
                  placeholder={t('Đối tượng')}
                  options={checkItemExist(
                    oldValue.audienceId,
                    masterDataListAudience
                  )}
                  renderLabel={(option) => option?.value}
                  renderValue={(option) => option?.id}
                  setTextSearchValue={setTextSearchValue}
                  onSelect={(value) => {
                    if (value) {
                      form.setValue('audienceId', value);
                      const findItem = masterDataListAudience.find(
                        (item) => item.id === value
                      );
                      setOldValue({
                        audienceId: findItem,
                        numberPhone: findItem,
                      });
                    }
                  }}
                  onKeyUp={(e) =>
                    setTimeout(() => {
                      setTextSearchValue((e.target as HTMLInputElement).value);
                    }, 1700)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <ProFormAutocompleteSingal
                  name="productId"
                  placeholder={t('Sản phẩm')}
                  options={productListOption}
                  renderValue={(item) => item.id}
                  renderLabel={(item) => `${item.code} - ${item.name}`}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <ProFormTextField
                  name="idphieukiemkho"
                  placeholder={t('ID phiếu kiểm kho')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <ProFormTextField
                  name="note"
                  placeholder={t('Ghi chú')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              {/* <Grid item xs={12} sm={6} md={3} lg={3}>
                <ProFormTextField
                  name="imei"
                  placeholder={t('IMEI')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid> */}
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <ProFormTextField
                  name="idphieubaohanh"
                  placeholder={t('ID phiếu bảo hành')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              {/* <Grid item xs={12} sm={6} md={3} lg={3}>
                <ProFormCheckboxSelect
                  name="nhan"
                  placeholder={t('Chọn nhãn')}
                  options={[
                    { value: nanoid(), label: 'TM' },
                    { value: nanoid(), label: 'HN-1' },
                    { value: nanoid(), label: 'HN-2' },
                  ]}
                  renderLabel={(option) => option.label}
                  renderValue={(option) => option.value}
                />
              </Grid> */}
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <ProFormTextField
                  name="draftTransferBillCode"
                  placeholder={t('ID phiếu nháp')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Collapse>
        </Grid>
      </Grid>
      <ProFormHiddenInput />
    </ProForm>
  );
});

export default FiltersForm;
