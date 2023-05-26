import { yupResolver } from '@hookform/resolvers/yup';
import ProForm from 'components/ProForm';
import { forwardRef, useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { FiltersRef } from 'types/refs';
import Validation from 'utils/Validation';
import DateTime from 'utils/DateTime';
import { Grid } from '@mui/material';
import { FilterParams } from './utils/filters';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import { useTranslation } from 'react-i18next';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import { Button, ButtonGroup, Collapse } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { NumberInput, PriceInput } from 'plugins/NumberFormat';
import {
  getListStoreApplication,
  getStoreApplicationList,
} from 'slices/storeApplication';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import ProFormAutocompleteSingal from 'components/ProForm/ProFormAutocompleteSingal';
import { getListMasterData, getListMasterDataAudience, getMasterDataList, getMasterDataListAudience } from 'slices/masterData';
import { useSearchParams } from 'react-router-dom';

interface FilterValues {
  storeIds: number[];
  searchDateType: number | null;
  searchDateFrom: Date | null;
  searchDateTo: Date | null;
  entryType: number | null;
  documentCode: string | null;
  isDocument: boolean | null;
  accountingType: number | null;
  audienceType: number | null;
  audienceText: string | null;
  note: string | null;
  accountCode: string | null;
  amount: string | number | null;
  creator: string | null;
  ticketType: number | null;
  entryCode: string | null;
  audienceId: string | null;
  documentDetailType: any[]
}

const schema = Validation.shape({
  entryCode: Validation.string().optional(),
  searchDateFrom: Validation.date().optional(),
  searchDateTo: Validation.date().optional(),
  documentCode: Validation.string().optional(),
  accountCode: Validation.string().optional(),
  audienceText: Validation.string().optional(),
  note: Validation.string().optional(),
  amount: Validation.string().optional(),
  creator: Validation.string().optional(),
});

interface Props {
  onSearch: (params: Partial<FilterParams>) => void;
  checkReset: boolean;
}

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { onSearch, checkReset } = props;
  const [openExpand, setOpenExpand] = useState<boolean>(false);
  const storeApplicationList = useSelector(getStoreApplicationList);
  const [textValueSearch, setTextSearchValue] = useState('');
  const masterDataListAudience = useSelector(getMasterDataListAudience);
  const masterDataList = useSelector(getMasterDataList);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchUrl = searchParams.get('entryCode');

  const form = useForm<FilterValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  useEffect(() => {
    if (searchUrl) {
      form.setValue('entryCode', searchUrl.toString())
    }
  }, [form, searchUrl])
  const fetchMasterData = async () => {
    const body = {
      warehousingBillType:null,
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

  useEffect(() => {
    fetchMasterData();
  }, []);

  useEffect(() => {
    form.reset({
      storeIds: [],
      entryCode: null,
      ticketType: null,
      documentDetailType: [],
      searchDateType: null,
      searchDateFrom: null,
      searchDateTo: null,
      entryType: null,
      documentCode: null,
      isDocument: null,
      accountingType: null,
      audienceType: null,
      audienceText: null,
      audienceId: null,
      note: null,
      accountCode: null,
      amount: null,
      creator: null,
    });
  }, [checkReset]);

  const handleSubmit = (values: FilterValues) => {
    onSearch({
      orderBy: '',
      orderDirection: '',
      storeIds: values.storeIds.length > 0 ? values.storeIds : null,
      entryCode: values.entryCode ? values.entryCode : null,
      ticketType: values.ticketType,
      searchDateType: values.searchDateType,
      searchDateFrom: DateTime.Format(values.searchDateFrom, 'YYYY-MM-DD'),
      searchDateTo: DateTime.Format(values.searchDateTo, 'YYYY-MM-DD'),
      entryType: values.entryType,
      documentCode: values.documentCode,
      isDocument: values.isDocument,
      accountingType: values.accountingType,
      audienceType: values.audienceType,
      audienceId: values.audienceId,
      note: values.note ? values.note : null,
      accountCode: values.accountCode ? values.accountCode : null,
      amount: values.amount ? Number(values.amount) : null,
      creator: values.creator ? values.creator : null,
      documentDetailType: values.documentDetailType ? values.documentDetailType : [],
    });
  };
  const fetchDataStoreApplication = async () => {
    try {
      await dispatch(getListStoreApplication({}));
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

  useEffect(() => {
    fetchMasterDataAudience();
  }, [form.watch('audienceType'), textValueSearch]);

  useEffect(() => {
    fetchDataStoreApplication();
  }, []);
  const handleExpand = () => {
    setOpenExpand((isOp) => !isOp);
  };

  return (
    <ProForm
      form={form}
      onFinish={handleSubmit}
      PaperProps={{ sx: { padding: '16px 16px 0 16px' } }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3} lg={1.7}>
          <ProFormCheckboxSelect<FieldValues, number>
            name="storeIds"
            // label={t('Cửa hàng')}
            placeholder={t('Cửa hàng')}
            options={storeApplicationList}
            renderLabel={(option) => option?.name}
            renderValue={(option) => option?.id}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1}>
          <ProFormTextField
            name="entryCode"
            placeholder={t('ID bút toán')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.5}>
          <ProFormSelect
            name="searchDateType"
            // label={t('Kiểu ngày')}
            placeholder={t('Kiểu ngày')}
            options={[
              { value: 0, label: 'Ngày tạo' },
              { value: 1, label: 'Ngày giao dịch' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <ProDateRange
            // label={t('Chọn ngày')}
            from="searchDateFrom"
            to="searchDateTo"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1}>
          <ProFormSelect
            name="isDocument"
            // label={t('Chứng từ')}
            placeholder={t('Chứng từ')}
            options={[
              { value: true, label: 'Có' },
              { value: false, label: 'Không' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.5}>
          <ProFormTextField
            name="documentCode"
            // label={t('Số tiền')}
            placeholder={t('ID chứng từ')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.5}>
          <ProFormTextField
            name="amount"
            // label={t('Số tiền')}
            placeholder={t('Số tiền')}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              inputComponent: PriceInput,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.5}>
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button type="submit" fullWidth>
              Lọc
            </Button>
            <Button
              variant="contained"
              endIcon={openExpand ? <ExpandLess /> : <ExpandMore />}
              onClick={handleExpand}
              size="medium"
            />
          </ButtonGroup>
        </Grid>

        <Grid item xs={12} lg={12}>
          <Collapse in={openExpand} timeout="auto">
            <Grid container spacing={2} pt={1}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <ProFormSelect
                  name="ticketType"
                  //   label={t('Loại phiếu')}
                  placeholder={t('Loại phiếu')}
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
                  renderLabel={(option) => option.label}
                  renderValue={(option) => option.value}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <ProFormSelect
                  name="accountingType"
                  //   label={t('Loại hạch toán')}
                  placeholder={t('Loại hạch toán')}
                  options={[
                    { value: 0, label: 'Tự động' },
                    { value: 1, label: 'Thủ công' },
                  ]}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <ProFormSelect
                  name="audienceType"
                  //   label={t('Loại đối tượng')}
                  placeholder={t('Loại đối tượng')}
                  options={[
                    { value: 0, label: 'Khách hàng' },
                    { value: 1, label: 'Nhà cung cấp VN' },
                    { value: 2, label: 'Nhà cung cấp TQ ' },
                    { value: 3, label: 'Nhân viên' },
                    { value: 4, label: 'Khác' },
                  ]}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <ProFormTextField
                  name="note"
                  //   label={t('Ghi chú')}
                  placeholder={t('Ghi chú')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                {/* <ProFormSelect
                  name="entryType"
                  //   label={t('Kiểu')}
                  placeholder={t('Kiểu')}
                  options={[
                    { value: 0, label: 'Nhập NCC' },
                    { value: 1, label: 'Nhập' },
                    { value: 2, label: 'Xuất' },
                    { value: 3, label: 'Bán hàng' },
                    { value: 4, label: 'Trả hàng' },
                  ]}
                /> */}
                   <ProFormCheckboxSelect<FieldValues, number>
            name="documentDetailType"
            placeholder={t('Chọn kiểu')}
            options={masterDataList}
            renderLabel={(option) => option?.value}
            renderValue={(option) => option?.id}
          />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <ProFormTextField
                  name="accountCode"
                  //   label={t('Mã tài khoản')}
                  placeholder={t('Mã tài khoản')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* <Grid item xs={12} sm={6} md={4} lg={3}>
                <ProFormTextField
                  name="audienceText"
                  //   label={t('Đối tượng')}
                  placeholder={t('Đối tượng')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid> */}
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <ProFormAutocompleteSingal
                  name="audienceId"
                  placeholder={t('Đối tượng')}
                  options={masterDataListAudience}
                  renderLabel={(option) => option?.value}
                  renderValue={(option) => option?.id}
                  setTextSearchValue={setTextSearchValue}
                  // onSelect={(value) => {
                  //   if (value) {
                  //     form.setValue('audienceId', value);
                  //     const findItem = masterDataListAudience.find(
                  //       (item) => item.id === value
                  //     );
                  //     setOldValue({
                  //       audienceId: findItem,
                  //       numberPhone: findItem,
                  //     });
                  //   }
                  // }}
                  onKeyUp={(e) =>
                    setTimeout(() => {
                      setTextSearchValue((e.target as HTMLInputElement).value);
                    }, 1700)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <ProFormTextField
                  name="creator"
                  //   label={t('Người tạo')}
                  placeholder={t('Người tạo')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Collapse>
        </Grid>
      </Grid>
    </ProForm>
  );
});

export default FiltersForm;
