import { yupResolver } from '@hookform/resolvers/yup';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, ButtonGroup, Collapse } from '@mui/material';
import Grid from '@mui/material/Grid';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProForm from 'components/ProForm';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormAutoCompleteDoubleFind from 'components/ProForm/ProFormAutoCompleteDoubleFind';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';
import ProFormHiddenInput from 'components/ProForm/ProFormHiddenInput';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FiltersRef } from 'types/refs';
import DateTime from 'utils/DateTime';
import Validation from 'utils/Validation';
import type { FilterParams } from './utils/filters';
import { documentDetailType } from './utils/constant';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store';
import { APIGetStore } from 'services/saleOrder';
import useNotification from 'hooks/useNotification';
import ProFormTextFiedTrim from 'components/ProForm/Label/ProFormTextFiedTrim';

interface FilterValues {
  storeIds: string[];
  ticketType: number[];
  accountCode: string | null;
  searchDateFrom: Date | null;
  searchDateTo: Date | null;
  isDocument: string | null;
  paymentReceiptCode: string | null;
  documentCode: string | null;
  audienceType: number | null;
  accountingType: number | null;
  documentDetailType: number | null;
  audienceName: string | null;
  note: string;
  creator: string | null;
}
const schema = Validation.shape({
  storeIds: Validation.array().optional(),
  ticketType: Validation.array().optional(),
  accountCode: Validation.string().optional(),
  searchDateFrom: Validation.date().optional(),
  searchDateTo: Validation.date().optional(),
  isDocument: Validation.string().optional().default(null),
  paymentReceiptCode: Validation.string().optional(),
  documentCode: Validation.string().optional(),
  audienceType: Validation.number().optional().nullable(),
  accountingType: Validation.number().optional().nullable().default(null),
  documentDetailType: Validation.number().optional().nullable(),
  audienceName: Validation.string().optional(),
  note: Validation.string().optional(),
  creator: Validation.string().optional(),
});
interface Props {
  onSearch: (params: Partial<FilterParams>) => void;
}

interface StoreType {
  [key: string]: any;
}

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { onSearch } = props;
  const { t } = useTranslation();
  const [openExpand, setOpenExpand] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const setNotification = useNotification();

  const [storeList, setStoreList] = useState<StoreType[]>([]);

  const form = useForm<FilterValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const handleSubmit = (values: FilterValues) => {
    const { ...rest } = values;

    onSearch({
      ...rest,
      isDocument: values.isDocument
        ? values.isDocument === '0'
          ? true
          : false
        : null,
    });
  };

  const handleReset = () => {
    form.reset(schema.getDefault());
  };

  useImperativeHandle(ref, () => ({
    reset: handleReset,
    submit: form.handleSubmit(handleSubmit),
  }));

  const handleExpand = () => {
    setOpenExpand((prev) => !prev);
  };

  useEffect(() => {
    fetchDataStore();
  }, []);

  const fetchDataStore = async () => {
    try {
      const response = await dispatch(APIGetStore);
      if (!response.length) {
        setNotification({
          error: 'Lỗi khi lấy dữ liệu',
        });
      } else {
        setStoreList(response);
      }
    } catch (err) {
      setNotification({
        error: 'Lỗi khi lấy dữ liệu',
      });
    }
  };

  return (
    <ProForm
      form={form}
      onFinish={handleSubmit}
      PaperProps={{ sx: { padding: '16px 16px 0 16px' } }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3} lg={1.7}>
          <ProFormCheckboxSelect
            name="storeIds"
            placeholder={t('Cửa hàng')}
            options={storeList}
            renderLabel={(option) => option?.value}
            renderValue={(option) => option?.id}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.7}>
          <ProFormCheckboxSelect
            name="ticketType"
            placeholder={t('Loại phiếu')}
            options={[
              { value: 4, label: 'Phiếu thu' },
              { value: 5, label: 'Phiếu chi' },
              { value: 2, label: 'Báo nợ' },
              { value: 3, label: 'Báo có' },
            ]}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={2}>
          <ProFormTextFiedTrim
            name="accountCode"
            placeholder={t('Mã tài khoản')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2.5}>
          <ProDateRange
            label={t('Chọn ngày')}
            from="searchDateFrom"
            to="searchDateTo"
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
              endIcon={!openExpand ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              onClick={handleExpand}
              size="medium"
            />
          </ButtonGroup>
        </Grid>
        <Grid item xs={12} lg={12}>
          <Collapse in={openExpand} timeout="auto">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <ProFormAutoCompleteDoubleFind
                  name="isDocument"
                  placeholder={t('Chứng từ')}
                  options={[
                    { value: '0', label: 'Có' },
                    { value: '1', label: 'Không' },
                  ]}
                  renderValue={(option) => option.value}
                  renderLabel={(option) => option.label}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <ProFormTextFiedTrim
                  name="paymentReceiptCode"
                  placeholder={t('ID')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <ProFormTextFiedTrim
                  name="documentCode"
                  placeholder={t('ID chứng từ')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <ProFormAutoCompleteDoubleFind
                  name="audienceType"
                  placeholder={t('Loại đối tượng')}
                  options={[
                    { value: '0', label: 'Khách hàng' },
                    { value: '1', label: 'Nhà cung cấp VN' },
                    { value: '2', label: 'Nhà cung cấp TQ' },
                    { value: '3', label: 'Nhân viên' },
                    { value: '4', label: 'Khác' },
                  ]}
                  renderValue={(option) => option.value}
                  renderLabel={(option) => option.label}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <ProFormAutoCompleteDoubleFind
                  name="accountingType"
                  placeholder={t('Loại hạch toán')}
                  options={[
                    { value: '0', label: 'Tự động' },
                    { value: '1', label: 'Không tự động' },
                  ]}
                  renderValue={(option) => option.value}
                  renderLabel={(option) => option.label}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <ProFormAutoCompleteDoubleFind
                  name="documentDetailType"
                  placeholder={t('Kiểu')}
                  options={documentDetailType}
                  renderValue={(option) => option.id}
                  renderLabel={(option) => option.label}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <ProFormTextFiedTrim
                  name="audienceName"
                  placeholder={t('Đối tượng')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <ProFormTextFiedTrim
                  name="creator"
                  placeholder={t('Người tạo')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <ProFormTextFiedTrim
                  name="note"
                  placeholder={t('Ghi chú')}
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
