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
import { NumberInput, PriceInput } from 'plugins/NumberFormat';
import {
  getListStoreApplication,
  getStoreApplicationList,
} from 'slices/storeApplication';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';

interface FilterValues {
  parentId: string | null;
  parentCode: string | null;
  documentCode: string | null;
  ticketType: number | null;
  start: Date | null;
  end: Date | null;
  note: string | null;
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

  const form = useForm<FilterValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  useEffect(() => {
    form.reset({
      parentId: null,
      parentCode: null,
      documentCode: null,
      ticketType: null,
      start: null,
      end: null,
      note: null,
    })
  }, [checkReset]);

  const handleSubmit = (values: FilterValues) => {
    onSearch(values)
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

  return (
    <ProForm
      form={form}
      onFinish={handleSubmit}
      PaperProps={{ sx: { padding: '16px 16px 0 16px' } }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3} lg={1.2}>
          <ProFormTextField
            name="parentId"
            placeholder={t('ID')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.5}>
          <ProFormTextField
            name="parentCode"
            placeholder={t('ID bút toán')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.8}>
          <ProDateRange
            from="start"
            to="end"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
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
              { value: 7, label: 'Khác' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.5}>
          <ProFormTextField
            name="documentCode"
            placeholder={t('ID chứng từ')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.5}>
          <ProFormTextField
            name="note"
            placeholder={t('Ghi chú')}
            InputLabelProps={{ shrink: true }}
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
