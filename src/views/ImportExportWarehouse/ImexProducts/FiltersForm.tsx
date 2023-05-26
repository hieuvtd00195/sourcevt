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
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';
import ProFormHiddenInput from 'components/ProForm/ProFormHiddenInput';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { FiltersRef } from 'types/refs';
import Validation from 'utils/Validation';
import type { FilterParams } from './utils/filters';
import { typeOption, exportOption, importOption } from './utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import {
  getListStoreApplication,
  getStoreApplicationList,
} from 'slices/storeApplication';
import { IStoreOptions } from './utils/types';
import { APISearchStoreApplication } from 'services/storeApplication';
import {
  getListMasterData,
  getListMasterDataAudience,
  getMasterDataList,
  getMasterDataListAudience,
} from 'slices/masterData';
import { APISearcMasterAudience } from 'services/masterdata';
import { APIGetProduct } from 'services/saleOrder';
import { IProduct } from 'views/Inventory/OrderSlip/AddOrderSlip/utils/types';
import ProFormAutocompleteSingal from 'components/ProForm/ProFormAutocompleteSingal';
import * as yup from 'yup';
import Regexs from 'utils/Regexs';
import dayjs from 'dayjs';

interface FilterValues {
  [key: string]: any;
}

const schema = Validation.shape({
  billId: yup
    .string()
    .nullable()
    .trim()
    .matches(Regexs.number, 'ID không hợp lệ')
    .default(''),
  productName: yup.string().nullable().trim().default(''),
  startDate: yup.date().nullable().default(null),
  endDate: yup.date().nullable().default(null),
  orderCode: yup
    .string()
    .nullable()
    .trim()
    .matches(Regexs.number, 'ID không hợp lệ')
    .default(''),
  note: yup.string().nullable().trim().default(''),
  draftTransferBillCode: yup
    .string()
    .nullable()
    .trim()
    .matches(Regexs.number, 'ID không hợp lệ')
    .default(''),
});

interface Props {
  onSearch: (params: Partial<FilterParams>) => void;
  onSubmit: VoidFunction;
  onClear: VoidFunction;
  codeQueryURL: string | null;
}

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { onSearch, codeQueryURL } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const masterDataList = useSelector(getMasterDataList);
  const storeApplicationList = useSelector(getStoreApplicationList);

  const form = useForm<FilterValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });
  const [openExpand, setOpenExpand] = useState<boolean>(false);
  const [storeOptions, setStoreOptions] = useState<IStoreOptions[]>([]);
  const [supplierList, setSupplierList] = useState<FilterValues[]>([]);
  const [customerList, setCustomerList] = useState<FilterValues[]>([]);

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
      if (form.watch('billType') !== null) {
        await dispatch(getListMasterData(body));
      }
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    Promise.all([
      APISearcMasterAudience({
        audienceType: 0,
        searchText: '',
      }),
      APISearcMasterAudience({
        audienceType: 1,
        searchText: '',
      }),
    ])
      .then(([customerRes, supplierRes]) => {
        setCustomerList(customerRes);
        setSupplierList(supplierRes);
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  }, []);

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

  useEffect(() => {
    const dateFirst = new Date();
    dateFirst.setDate(1);
    const dateNow = new Date();
    form.setValue('startDate', dateFirst);
    form.setValue('endDate', dateNow);
  }, []);

  const handleSubmit = (values: FilterValues) => {
    const params = {
      ...values,
      startDate: values.startDate
        ? dayjs(values.startDate).format('YYYY-MM-DD')
        : null,
      endDate: values.endDate
        ? dayjs(values.endDate).format('YYYY-MM-DD')
        : null,
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

  const trimSpaceForm = (event: any, name: string) => {
    const value = event.target.value;
    form.setValue(name, value.trim());
  };
  useEffect(() => {
    if (!codeQueryURL) return;
    form.setValue('billId', codeQueryURL);
  }, [codeQueryURL]);

  return (
    <ProForm form={form} onFinish={handleSubmit} PaperProps={{ sx: { p: 2 } }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormCheckboxSelect
            name="storeIds"
            placeholder={t('Chọn cửa hàng')}
            options={storeOptions}
            renderLabel={(option) => option.label}
            renderValue={(option) => option.value}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormTextField
            name="billId"
            placeholder="ID"
            InputLabelProps={{ shrink: true }}
            onBlur={(event) => trimSpaceForm(event, 'billId')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormTextField
            name="productName"
            placeholder={t('Nhập sản phẩm')}
            InputLabelProps={{ shrink: true }}
            onBlur={(event) => trimSpaceForm(event, 'productName')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormSelect
            name="billType"
            placeholder={t('Chọn loại phiếu')}
            options={typeOption}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormCheckboxSelect
            name="xnkTypes"
            placeholder={t('Chọn kiểu')}
            options={masterDataList}
            renderLabel={(option) => option?.value}
            renderValue={(option) => option?.id}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProDateRange label={t('Từ - đến')} from="startDate" to="endDate" />
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
                  placeholder={t('ID đơn hàng')}
                  InputLabelProps={{ shrink: true }}
                  onBlur={(event) => trimSpaceForm(event, 'orderCode')}
                />
              </Grid>
              {/* <Grid item xs={12} sm={6} md={3} lg={3}>
                <ProFormAutocompleteSingal
                  name="customerIds"
                  placeholder={t('Khách hàng')}
                  options={customerList}
                  renderLabel={(option) => option?.value}
                  renderValue={(option) => option?.id}
                />
              </Grid> */}
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <ProFormAutocompleteSingal
                  name="supplierIds"
                  placeholder={t('Nhà cung cấp')}
                  options={supplierList}
                  renderLabel={(option) => option?.value}
                  renderValue={(option) => option?.id}
                />
              </Grid>
              {/* <Grid item xs={12} sm={6} md={3} lg={3}>
                <ProFormTextField
                  name="inventorySheetCode"
                  placeholder={t('ID phiếu kiểm kho')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid> */}
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <ProFormTextField
                  name="note"
                  placeholder={t('Ghi chú')}
                  InputLabelProps={{ shrink: true }}
                  onBlur={(event) => trimSpaceForm(event, 'note')}
                />
              </Grid>
              {/* <Grid item xs={12} sm={6} md={3} lg={3}>
                <ProFormTextField
                  name="warrantyCardCode"
                  placeholder={t('ID phiếu bảo hành')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid> */}
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <ProFormTextField
                  name="draftTransferBillCode"
                  placeholder={t('ID phiếu nháp')}
                  InputLabelProps={{ shrink: true }}
                  onBlur={(event) =>
                    trimSpaceForm(event, 'draftTransferBillCode')
                  }
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
