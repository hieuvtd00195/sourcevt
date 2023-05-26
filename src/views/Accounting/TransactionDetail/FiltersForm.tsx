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
import { useSearchParams } from 'react-router-dom';
import ProFormTextFiedTrim from 'components/ProForm/Label/ProFormTextFiedTrim';
import ProFormSelectSorted from 'components/ProForm/Label/ProFormSelectSorted';

interface FilterValues {
  storeIds: number[];
  ticketType: number | null;
  code: string | null;
  parentCode: string | null;
  documentCode: string | null;
  accountCode: string | null;
  start: string | null;
  end: string | null;
  audienceType: number | null;
  audience: string | null;
}

const schema = Validation.shape({
  // storeIds: Validation.number().optional(),
  // ticketType: Validation.number().optional(),
  // parentCode: Validation.string().optional(),
  // code: Validation.string().optional(),
  // documentType: Validation.string().optional(),
  // accountId: Validation.string().optional(),
  // searchDateFrom: Validation.date().optional(),
  // searchDateTo: Validation.date().optional(),
  // audienceType: Validation.number().optional(),
  // audience: Validation.string().optional(),
});

interface Props {
  onSearch: (params: Partial<FilterParams>) => void;
  checkReset: boolean;
}

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { onSearch, checkReset } = props;
  const storeApplicationList = useSelector(getStoreApplicationList);
  const [searchParams] = useSearchParams();
  const codeQueryURL = searchParams.get('code') || null;

  const form = useForm<FilterValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  useEffect(() => {
    form.reset({
      storeIds: [],
      ticketType: null,
      parentCode: '',
      code: '',
      documentCode: '',
      accountCode: '',
      start: null,
      end: null,
      audienceType: null,
      audience: '',
    })
  }, [checkReset]);

  const handleSubmit = (values: FilterValues) => {
    onSearch({
      ...values,
      start: DateTime.Format(values.start, 'YYYY-MM-DD'),
      end: DateTime.Format(values.end, 'YYYY-MM-DD'),
    })
    // onSearch({
    //   orderBy: '',
    //   orderDirection: '',
    //   storeIds: values.storeIds.length > 0 ? values.storeIds : null,
    //   ticketType: values.ticketType,
    //   searchDateFrom: values.searchDateFrom,
    //   searchDateTo: values.searchDateTo,
    //   documentType: values.documentType,
    //   audienceType: values.audienceType,
    //   accountId: values.accountId ? values.accountId : null,
    // });
  };
  const fetchDataStoreApplication = async () => {
    try {
      await dispatch(getListStoreApplication({}));
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchDataStoreApplication();
  }, []);

  useEffect(() => {
    if (!codeQueryURL) return;
    form.setValue('parentCode', codeQueryURL);
  }, [codeQueryURL]);

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
            placeholder={t('Cửa hàng')}
            options={storeApplicationList}
            renderLabel={(option) => option?.name}
            renderValue={(option) => option?.id}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.5}>
          <ProFormSelectSorted
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
              { value: 8, label: 'Phiếu bán hàng' },
              { value: 9, label: 'Phiếu trả hàng' },
              { value: 7, label: 'Khác' },
            ]}
            renderLabel={(option) => option.label}
            renderValue={(option) => option.value}
          />
        </Grid>


        <Grid item xs={12} sm={6} md={3} lg={1.2}>
          <ProFormTextFiedTrim
            name="code"
            placeholder={t('ID')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.5}>
          <ProFormTextFiedTrim
            name="parentCode"
            placeholder={t('ID bút toán')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.5}>
          <ProFormTextFiedTrim
            name="documentCode"
            placeholder={t('ID chứng từ')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.5}>
          <ProFormTextFiedTrim
            name="accountCode"
            placeholder={t('Mã tài khoản')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.8}>
          <ProDateRange
            from="start"
            to="end"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <ProFormSelect
            name="audienceType"
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
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <ProFormTextFiedTrim
            name="audience"
            placeholder={t('Đối tượng')}
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
          </ButtonGroup>
        </Grid>
      </Grid>
    </ProForm>
  );
});

export default FiltersForm;
