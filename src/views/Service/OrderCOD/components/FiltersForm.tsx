import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { FiltersRef } from 'types/refs';
import Validation from 'utils/Validation';
import { FilterParams } from '../utils/filters';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DateTime from 'utils/DateTime';
import ProForm from 'components/ProForm';
import { Collapse, Grid, Typography } from '@mui/material';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import ProFormSelect from 'components/ProForm/ProFormSelect';
import ProFormFilterAction from 'components/ProForm/ProFormFilterAction';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import {
  getListMasterDataAudience,
  getMasterDataListAudience,
} from 'slices/masterData';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';
import {
  getListStoreApplication,
  getStoreApplicationList,
} from 'slices/storeApplication';
import ProFormAutocomplete from 'components/ProForm/Label/ProFormAutocomplete';

interface FilterValues {
  [key: string]: any;
}

const schema = Validation.shape({});

interface Props {
  onSearch: (params: Partial<FilterParams>) => void;
  onSubmit: VoidFunction;
  onClear: VoidFunction;
}

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { onSearch, onSubmit, onClear } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const [isShowFilter, setIsShowFilter] = useState<boolean>(false);

  const storeApplicationList = useSelector(getStoreApplicationList);
  const masterDataListAudience = useSelector(getMasterDataListAudience);

  const form = useForm<FilterValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });
  const handleSubmit = (values: FilterValues) => {
    const { startDate, endDate, ...rest } = values;

    onSearch({
      ...rest,
      startDate: DateTime.Format(startDate),
      endDate: DateTime.Format(endDate),
    });
  };

  const handleReset = () => {
    form.reset(schema.getDefault());
  };

  const handleShowFilter = () => {
    setIsShowFilter(!isShowFilter);
  };

  useImperativeHandle(ref, () => ({
    reset: handleReset,
    submit: form.handleSubmit(handleSubmit),
  }));

  // fetch api Store
  const fetchDataStoreApplication = async () => {
    try {
      await dispatch(getListStoreApplication({}));
    } catch (error) {
    } finally {
    }
  };

  const fetchMasterDataAudience = async () => {
    const body = {
      audienceType: 0,
      searchText: '',
    };
    try {
      await dispatch(getListMasterDataAudience(body));
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchDataStoreApplication();
    fetchMasterDataAudience();
  }, []);

  return (
    <ProForm form={form} onFinish={handleSubmit} PaperProps={{ sx: { p: 2 } }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProDateRange label={t('Ngày tạo')} from="startDate" to="endDate" />
        </Grid>
        <Grid item xs={6} sm={3} md={2} lg={2.4}>
          <ProFormTextField
            name="id"
            placeholder="ID"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormCheckboxSelect
            name="storeIds"
            placeholder={t('Chọn cửa hàng')}
            options={storeApplicationList}
            renderLabel={(option) => option.value}
            renderValue={(option) => option.id}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormAutocomplete
            name="customerId"
            placeholder={t('Khách hàng')}
            options={masterDataListAudience}
            renderLabel={(option) => option.value}
            renderValue={(option) => option.id}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Grid item xs={6} sm={3} md={2} lg={1.2}>
            <ProFormFilterAction onSubmit={onSubmit} onClear={onClear} />
          </Grid>
        </Grid>
      </Grid>
    </ProForm>
  );
});

export default FiltersForm;
