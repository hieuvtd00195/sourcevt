import { yupResolver } from '@hookform/resolvers/yup';
import Grid from '@mui/material/Grid';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProForm from 'components/ProForm';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormFilterAction from 'components/ProForm/ProFormFilterAction';
import ProFormHiddenInput from 'components/ProForm/ProFormHiddenInput';
import { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FiltersRef } from 'types/refs';
import Validation from 'utils/Validation';
import { ISearchProductModificationHistory } from './utils/type';

const schema = Validation.shape({});

interface Props {
  onSearch: (params: Partial<ISearchProductModificationHistory>) => void;
  onSubmit: VoidFunction;
  onClear: VoidFunction;
}

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { onSearch, onSubmit, onClear } = props;
  const { t } = useTranslation();

  const form = useForm<ISearchProductModificationHistory>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const handleSubmit = (values: ISearchProductModificationHistory) => {
    const { startDate, endDate, ...rest } = values;

    onSearch(rest);
  };

  const handleReset = () => {
    form.reset(schema.getDefault());
  };

  useImperativeHandle(ref, () => ({
    reset: handleReset,
    submit: form.handleSubmit(handleSubmit),
  }));

  return (
    <ProForm form={form} onFinish={handleSubmit} PaperProps={{ sx: { p: 2 } }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProDateRange label={t('Từ - Đến')} from="startDate" to="endDate" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormTextField
            name="productName"
            placeholder={t('Nhập sản phẩm')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormSelect
            name="logType"
            placeholder={t('Chọn loại log')}
            options={[
              { value: 1, label: 'Sửa sản phẩm' },
              { value: 2, label: 'Xóa sản phẩm' },
              { value: 3, label: 'Xóa links sản phẩm' },
              { value: 4, label: 'Thêm hàng lỗi' },
              { value: 5, label: 'Sửa hàng lỗi' },
              { value: 6, label: 'Xóa hàng lỗi' },
              { value: 7, label: 'Thay đổi SL lỗi khi làm phiếu XNK' },
              { value: 8, label: 'Sửa ghi chú hàng lỗi' },
              { value: 9, label: 'Sửa giá chi nhánh' },
              { value: 10, label: 'Xóa tag từ Website Tag' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormSelect
            name="logKind"
            placeholder={t('Chọn kiểu log')}
            options={[
              { value: 1, label: 'Sửa giá bán' },
              { value: 2, label: 'Sửa giá nhập' },
              { value: 3, label: 'Thay đổi số lượng lỗi' },
              { value: 4, label: 'Sửa sản phẩm Combo' },
              { value: 5, label: 'Sửa đơn vị tính' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormSelect
            name="parentChild"
            placeholder={t('Cha con')}
            options={[
              { value: 1, label: 'Sản phẩm cha' },
              { value: 2, label: 'Sản phẩm độc lập' },
              { value: 3, label: 'Sản phẩm con' },
              { value: 4, label: 'Sản phẩm cha + độc lập' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormTextField
            name="modifier"
            placeholder={t('Nhập người sửa')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <ProFormFilterAction onSubmit={onSubmit} onClear={onClear} />
        </Grid>
      </Grid>
      <ProFormHiddenInput />
    </ProForm>
  );
});

export default FiltersForm;
