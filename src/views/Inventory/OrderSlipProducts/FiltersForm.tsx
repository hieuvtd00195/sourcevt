import { yupResolver } from '@hookform/resolvers/yup';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, ButtonGroup, Collapse } from '@mui/material';
import Grid from '@mui/material/Grid';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProForm from 'components/ProForm';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';
import ProFormHiddenInput from 'components/ProForm/ProFormHiddenInput';
import ProFormSelect from 'components/ProForm/ProFormSelect';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  getListProductCategory,
  getProductCategoryList,
} from 'slices/productCategory';
import {
  getListStoreApplication,
  getStoreApplicationList,
} from 'slices/storeApplication';
import { AppDispatch } from 'store';
import { IProductCategory } from 'types/productCategory';
import type { FiltersRef } from 'types/refs';
import Validation from 'utils/Validation';
import type { FilterParams } from './utils/filters';
import ProFormAutocomplete from 'components/ProForm/Label/ProFormAutocomplete';
import dayjs from 'dayjs';

interface FilterValues {
  [key: string]: any;
}

export interface IStoreOptions {
  value: string;
  label: string;
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

  const [openMoreFilter, setOpenMoreFilter] = useState<boolean>(false);
  const [openExpand, setOpenExpand] = useState<boolean>(false);
  const [storeOptions, setStoreOptions] = useState<IStoreOptions[]>([]);
  const [productOptions, setProductOptions] = useState<IProductCategory[]>([]);

  const storeApplicationList = useSelector(getStoreApplicationList);
  const productCategoryList = useSelector(getProductCategoryList);

  const form = useForm<FilterValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const handleExpand = () => {
    setOpenExpand((prev) => !prev);
  };

  const handleSubmit = (values: FilterValues) => {
    const params = {
      ...values,
      fromDate: values?.fromDate
        ? dayjs(values?.fromDate).format('YYYY-MM-DD')
        : null,
      toDate: values?.toDate
        ? dayjs(values?.toDate).format('YYYY-MM-DD')
        : null,
    };
    onSearch(params);
  };

  const handleReset = () => {
    form.reset(schema.getDefault());
  };

  useImperativeHandle(ref, () => ({
    reset: handleReset,
    submit: form.handleSubmit(handleSubmit),
  }));

  const onExpanded = () => setOpenMoreFilter(!openMoreFilter);

  // fetch api Store
  const fetchDataStoreApplication = async () => {
    try {
      await dispatch(getListStoreApplication({}));
    } catch (error) {
    } finally {
    }
  };

  const fetchDataProductCategory = async () => {
    try {
      await dispatch(getListProductCategory({}));
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchDataStoreApplication();
    fetchDataProductCategory();
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
    setProductOptions(productCategoryList);
  }, [productCategoryList]);

  const trimSpaceForm = (event: any, name: string) => {
    const value = event.target.value;
    form.setValue(name, value.trim());
  };

  return (
    <ProForm form={form} onFinish={handleSubmit} PaperProps={{ sx: { p: 2 } }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={2.7}>
          <ProDateRange label={t('Từ - Đến')} from="fromDate" to="toDate" />
        </Grid>

        <Grid item xs={6} sm={3} md={2} lg={1.5}>
          <ProFormTextField
            name="saleOrderLineCode"
            placeholder={t('ID phiếu đặt hàng')}
            InputLabelProps={{ shrink: true }}
            onBlur={(event) => trimSpaceForm(event, 'saleOrderLineCode')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <ProFormTextField
            name="chargerName"
            placeholder={t('Tên người phụ trách')}
            InputLabelProps={{ shrink: true }}
            onBlur={(event) => trimSpaceForm(event, 'chargerName')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <ProFormTextField
            name="productName"
            placeholder={t('Tên sản phẩm')}
            InputLabelProps={{ shrink: true }}
            onBlur={(event) => trimSpaceForm(event, 'productName')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <ProFormTextField
            name="suplierName"
            placeholder={t('Tên NCC')}
            InputLabelProps={{ shrink: true }}
            onBlur={(event) => trimSpaceForm(event, 'suplierName')}
          />
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
              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <ProFormAutocomplete
                  name="categoryProductSearch"
                  placeholder={t('Loại')}
                  options={[
                    { value: 1, label: 'Chưa thực thi' },
                    { value: 2, label: 'Đã thực thi' },
                  ]}
                  renderLabel={(option) => option.label}
                  renderValue={(option) => option.value}
                />
              </Grid>

              <Grid item xs={6} sm={3} md={2} lg={1.2}>
                <ProFormTextField
                  name="invoiceNumber"
                  placeholder={t('Số hóa đơn')}
                  InputLabelProps={{ shrink: true }}
                  onBlur={(event) => trimSpaceForm(event, 'invoiceNumber')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <ProFormCheckboxSelect
                  name="storeId"
                  placeholder={t('Chọn cửa hàng')}
                  options={storeOptions}
                  renderLabel={(option) => option.label}
                  renderValue={(option) => option.value}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <ProFormAutocomplete
                  name="saleOrderStatus"
                  placeholder={t('Trạng thái phiếu')}
                  options={[
                    { value: 1, label: 'Đã hoàn thành' },
                    { value: 0, label: 'Chưa hoàn thành' },
                  ]}
                  renderLabel={(option) => option.label}
                  renderValue={(option) => option.value}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <ProFormCheckboxSelect
                  name="productCategory"
                  placeholder={t('Loại sản phẩm')}
                  options={productOptions}
                  renderLabel={(option) => option?.value ?? ''}
                  renderValue={(option) => option?.id ?? ''}
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
