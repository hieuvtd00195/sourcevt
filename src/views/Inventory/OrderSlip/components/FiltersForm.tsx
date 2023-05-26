import { yupResolver } from '@hookform/resolvers/yup';
import Grid from '@mui/material/Grid';
import { nanoid } from '@reduxjs/toolkit';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProForm from 'components/ProForm';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';
import ProFormFilterAction from 'components/ProForm/ProFormFilterAction';
import ProFormHiddenInput from 'components/ProForm/ProFormHiddenInput';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { FiltersRef } from 'types/refs';
import Validation from 'utils/Validation';
import { STATUS } from '../utils/constants';
import type { FilterParams } from '../utils/filters';
import { isEmpty } from 'lodash';
import ProFormTextFiedTrim from 'components/ProForm/Label/ProFormTextFiedTrim';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import {
  getListStoreApplication,
  getStoreApplicationList,
} from 'slices/storeApplication';
import { FieldValues } from 'react-hook-form';
import ProFormAutocompleteSingal from 'components/ProForm/ProFormAutocompleteSingal';

const statusOptions = [
  { value: '1', label: 'Đã hoàn thành' },
  { value: '0', label: 'Chưa hoàn thành' },
];

interface FilterValues {
  code: string | null;
  supplierId: string | null;
  storeId: string | null;
  status: string | null ;
  fromDate: string | null;
  toDate: string | null;
  supplierName: string | null;
}

const schema = Validation.shape({
  //   name: Validation.string().optional(),
  //   status: Validation.select(STATUS.ALL),
  //   inventory: Validation.select(1),
});
interface OptionValue {
  id: string;
}
interface Props {
  onSearch: (params: Partial<FilterParams>) => void;
  onSubmit: VoidFunction;
  onClear: VoidFunction;
  codeQueryURL: string | null;
  supplierNameQueryURL: string | null;
}

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { onSearch, onSubmit, onClear, codeQueryURL, supplierNameQueryURL } =
    props;
  const dispatch = useDispatch<AppDispatch>();
  const [textValue, setTextValue] = useState<string>('');
  const [textIDValue, setTextIDValue] = useState<string>('');
  const storeApplicationList = useSelector(getStoreApplicationList);

  const { t } = useTranslation();

  const form = useForm<FilterValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const handleSubmit = (values: FilterValues) => {
    console.log(values);
    onSearch({
      //   code: values.code ? values.code : null,
      code: textIDValue ? textIDValue : null,
      storeId: !isEmpty(values.storeId) ? values.storeId : null,
      status: Number(values.status) >= 0 ? values.status : null,
      fromDate: values.fromDate ? values.fromDate : null,
      toDate: values.toDate ? values.toDate : null,
      supplierName: textValue ? textValue.trim() : null,
    });
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
  const handleReset = () => {
    form.reset(schema.getDefault());
  };

  useImperativeHandle(ref, () => ({
    reset: handleReset,
    submit: form.handleSubmit(handleSubmit),
  }));

  const handleOnBlur = (event: any) => {
    setTextValue(event.target.value.trim());
  };

  const handleOnBlurTextID = (event: any) => {
    setTextIDValue(event.target.value.trim());
  };

  useEffect(() => {
    if (!codeQueryURL) return;
    setTextIDValue(codeQueryURL);
  }, [codeQueryURL]);

  useEffect(() => {
    if (!supplierNameQueryURL) return;
    setTextValue(supplierNameQueryURL);
  }, [supplierNameQueryURL]);

  return (
    <ProForm form={form} onFinish={handleSubmit} PaperProps={{ sx: { p: 2 } }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProDateRange label={t('Từ - Đến')} from="fromDate" to="toDate" />
        </Grid>
        <Grid item xs={6} sm={3} md={2} lg={1.2}>
          <ProFormTextFiedTrim
            name="code"
            placeholder={t('ID yêu cầu')}
            // InputLabelProps={{ shrink: true }}
            value={textIDValue}
            onChange={(event) => setTextIDValue(event.target.value)}
            onBlur={(event) => handleOnBlurTextID(event)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormTextFiedTrim
            name="supplierName"
            placeholder={t('Tên NCC')}
            InputLabelProps={{ shrink: true }}
            value={textValue}
            onChange={(event) => setTextValue(event.target.value)}
            onBlur={(event) => handleOnBlur(event)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormCheckboxSelect<FieldValues, number>
            name="storeId"
            label={t('Cửa hàng')}
            placeholder={t('Chọn cửa hàng')}
            options={storeApplicationList}
            renderLabel={(option) => option?.name}
            renderValue={(option) => option?.id}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormAutocompleteSingal
            name="status"
            placeholder="Trạng thái phiếu"
            options={statusOptions}
            renderLabel={(option) => option.label}
            renderValue={(option) => option.value}
          />
          {/* <ProFormSelect
            name="status"
            placeholder="Trạng thái phiếu"
            options={statusOptions}
            renderLabel={(option) => option.label}
            renderValue={(option) => option.value}
          /> */}
        </Grid>
        
        <Grid item xs={6} sm={3} md={2} lg={1.2}>
          <ProFormFilterAction onSubmit={onSubmit} onClear={onClear} />
        </Grid>
      </Grid>

      <ProFormHiddenInput />
    </ProForm>
  );
});

export default FiltersForm;
