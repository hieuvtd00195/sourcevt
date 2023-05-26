import { yupResolver } from '@hookform/resolvers/yup';
import { Button, ButtonGroup, Collapse } from '@mui/material';
import Grid from '@mui/material/Grid';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProForm from 'components/ProForm';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormHiddenInput from 'components/ProForm/ProFormHiddenInput';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Validation from 'utils/Validation';
import type { FilterParams } from './utils/filters';
import { FiltersRef } from 'types/refs';
import DateTime from 'utils/DateTime';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';

interface FilterValues {
  id: string;
  dayType: number;
  startDate: Date | null;
  endDate: Date | null;
  document: number;
  documentId: string;
  amount: string;
  billType: number;
  accountCode: string;
  objectType: number;
  note: string;
  planningType: number;
  type: number;
  object: string;
  creator: string;
}

const schema = Validation.shape({
  id: Validation.string().optional(),
  dayType: Validation.select(0),
  startDate: Validation.date().optional(),
  endDate: Validation.date().optional(),
  document: Validation.select(0),
  documentId: Validation.string().optional(),
  amount: Validation.string().optional(),
  billType: Validation.select(0),
  accountCode: Validation.string().optional(),
  objectType: Validation.select(0),
  note: Validation.string().optional(),
  planningType: Validation.select(0),
  type: Validation.select(0),
  object: Validation.string().optional(),
  creator: Validation.string().optional(),
});

interface Props {
  onSearch: (params: Partial<FilterParams>) => void;
}

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { onSearch } = props;
  const { t } = useTranslation();
  const [openExpand, setOpenExpand] = useState<boolean>(false);

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

  useImperativeHandle(ref, () => ({
    reset: handleReset,
    submit: form.handleSubmit(handleSubmit),
  }));

  const handleExpand = () => {
    setOpenExpand((prev) => !prev);
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
            name="store"
            placeholder={t('Cửa hàng')}
            options={[
              { value: 1, label: 'Chưa gắn kho' },
              { value: 2, label: 'Linh kiện Sài Gòn' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={0.8}>
          <ProFormTextField
            name="id"
            placeholder={t('ID')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.5}>
          <ProFormSelect
            name="dayType"
            placeholder={t('Kiểu ngày')}
            options={[
              { value: 0, label: '-Kiểu ngày-' },
              { value: 1, label: 'Ngày giao dịch' },
              { value: 2, label: 'Ngày tạo' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.8}>
          <ProDateRange label={t('Chọn ngày')} from="startDate" to="endDate" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.2}>
          <ProFormSelect
            name="document"
            placeholder={t('Chứng từ')}
            options={[
              { value: 0, label: '-Chứng từ-' },
              { value: 1, label: 'Có' },
              { value: 2, label: 'Không' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1}>
          <ProFormTextField
            name="documentId"
            placeholder={t('ID chứng từ')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.5}>
          <ProFormTextField
            name="amount"
            placeholder={t('Số tiền')}
            InputLabelProps={{ shrink: true }}
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
              endIcon={openExpand ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              onClick={handleExpand}
              size="medium"
            />
          </ButtonGroup>
        </Grid>
        <Grid item xs={12} lg={12}>
          <Collapse in={openExpand} timeout="auto">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <ProFormSelect
                  name="billType"
                  placeholder={t('Loại phiếu')}
                  options={[
                    { value: 0, label: '-Loại phiếu-' },
                    { value: 1, label: 'Phiếu thu' },
                    { value: 2, label: 'Phiếu chi' },
                  ]}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <ProFormTextField
                  name="accountCode"
                  placeholder={t('Mã tài khoản')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <ProFormSelect
                  name="objectType"
                  placeholder={t('Loại đối tượng')}
                  options={[
                    { value: 0, label: '-Loại đối tượng-' },
                    { value: 1, label: 'Khách hàng' },
                    { value: 2, label: 'Nhà cung cấp' },
                    { value: 3, label: 'Nhân viên' },
                  ]}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <ProFormTextField
                  name="note"
                  placeholder={t('Ghi chú')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <ProFormSelect
                  name="planningType"
                  placeholder={t('Loại hạch toán')}
                  options={[
                    { value: 0, label: '-Loại hạch toán-' },
                    { value: 1, label: 'Tự động' },
                    { value: 2, label: 'Không tự động' },
                  ]}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <ProFormSelect
                  name="type"
                  placeholder={t('Kiểu')}
                  options={[
                    { value: 0, label: '-Kiểu-' },
                    { value: 1, label: 'Nhập nhà cung cấp' },
                    { value: 2, label: 'Nhập nhà cung cấp VAT' },
                  ]}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <ProFormTextField
                  name="object"
                  placeholder={t('Đối tượng')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <ProFormTextField
                  name="creator"
                  placeholder={t('Người tạo')}
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
