import { yupResolver } from '@hookform/resolvers/yup';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/system';
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
import { STATUS, actionOptions, billTypeOptions } from './utils/constants';
import type { FilterParams } from './utils/filters';
import { IStoreOptions } from './utils/types';
import { useDispatch, useSelector } from 'react-redux';
import {
  getListStoreApplication,
  getStoreApplicationList,
} from 'slices/storeApplication';
import { AppDispatch } from 'store';
import {
  getListMasterData,
  getListMasterDataAudience,
  getMasterDataList,
  getMasterDataListAudience,
} from 'slices/masterData';
import { Button, ButtonGroup, Collapse } from '@mui/material';
import dayjs from 'dayjs';
import ProFormAutocompleteSingal from 'components/ProForm/ProFormAutocompleteSingal';
import ProFormAutocomplete from 'components/ProForm/Label/ProFormAutocomplete';
import ProFormLabel from 'components/ProForm/ProFormLabel';

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

  const masterDataList = useSelector(getMasterDataList);
  const storeApplicationList = useSelector(getStoreApplicationList);

  const [openExpand, setOpenExpand] = useState<boolean>(false);
  const [storeOptions, setStoreOptions] = useState<IStoreOptions[]>([]);

  const form = useForm<FilterValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  // fetch api Store
  const fetchDataStoreApplication = async () => {
    try {
      await dispatch(getListStoreApplication({}));
    } catch (error) {
    } finally {
    }
  };

  const fetchMasterData = async () => {
    const body = {
      warehousingBillType:
        form.watch('billType') === 0 ? 0 : form.watch('billType'),
      audienceType: null,
      ticketType: null,
      documentType: null,
      isWarehousingBillForm: false,
    };

    try {
      // if (form.watch('billType') !== null) {
      await dispatch(getListMasterData(body));
      // }
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchDataStoreApplication();
  }, []);

  useEffect(() => {
    setStoreOptions(
      storeApplicationList.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      })
    );
  }, [storeApplicationList]);

  useEffect(() => {
    fetchMasterData();
  }, [form.watch('billType')]);

  const setHoursFormDate = (value: any) => {
    if (!value) return value;
    const date = new Date(value);
    date.setHours(0, 0, 0);
    return date;
  };

  const setHoursToDate = (value: any) => {
    if (!value) return value;
    const date = new Date(value);
    date.setHours(23, 59, 59);
    return date;
  };

  const handleSubmit = (values: FilterValues) => {
    const params = {
      ...values,
      fromDate: setHoursFormDate(values?.fromDate),
      fromDateBill: setHoursFormDate(values?.fromDateBill),
      toDate: setHoursToDate(values?.toDate),
      toDateBill: setHoursToDate(values?.toDateBill),
    };
    onSearch(params);
  };

  const handleReset = () => {
    form.reset(schema.getDefault());
  };

  const handleExpand = () => {
    setOpenExpand((prev) => !prev);
  };

  useImperativeHandle(ref, () => ({
    reset: handleReset,
    submit: form.handleSubmit(handleSubmit),
  }));

  return (
    <ProForm form={form} onFinish={handleSubmit} PaperProps={{ sx: { p: 2 } }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <ProFormCheckboxSelect
            name="storeIds"
            label={t('Cửa hàng')}
            placeholder={t('Chọn cửa hàng')}
            options={storeOptions}
            renderLabel={(option) => option.label}
            renderValue={(option) => option.value}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2} lg={1.5}>
          <ProFormTextField
            name="billCode"
            placeholder={t('ID Phiếu XNK')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2} lg={1.5}>
          <ProFormAutocompleteSingal
            name="action"
            placeholder={t('- Kiểu log -')}
            options={actionOptions}
            renderLabel={(option) => option?.label}
            renderValue={(option) => option?.id}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2} lg={1.5}>
          <ProFormAutocomplete
            name="billType"
            placeholder={t('- Loại-')}
            options={billTypeOptions}
            renderLabel={(option) => option?.label}
            renderValue={(option) => option?.id}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2} lg={1.5}>
          <ProFormCheckboxSelect
            name="documentDetailType"
            placeholder={t('Chọn kiểu')}
            options={masterDataList}
            renderLabel={(option) => option?.value}
            renderValue={(option) => option?.id}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.5} xl={2}>
          <ProDateRange
            label={t('Ngày tạo')}
            from="fromDateBill"
            to="toDateBill"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={1.5} xl={1}>
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
            <Grid container spacing={2} sx={{ alignItems: 'center' }}>
              <Grid item xs={12} sm={6} md={4.5} lg={3.4} xl={2}>
                <ProDateRange
                  label={t('Ngày XNK')}
                  from="fromDate"
                  to="toDate"
                />
              </Grid>
              <Grid item xs={6} sm={3} md={4} lg={1.2} xl={1.5}>
                <ProFormTextField
                  name="creator"
                  placeholder={t('Người Sửa/Xóa')}
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

const StyledLabel = styled(Grid)`
  text-align: right;
`;

export default FiltersForm;
