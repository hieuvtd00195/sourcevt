import { yupResolver } from '@hookform/resolvers/yup';
import { Button, ButtonGroup, Grid } from '@mui/material';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProForm from 'components/ProForm';
import ProFormAutocomplete from 'components/ProForm/Label/ProFormAutocomplete';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  APIGetListCustomer,
  APIGetListUser,
  ICustomer,
  IUser,
} from 'services/masterdata';
import { getStoreApplicationList } from 'slices/storeApplication';
import { IParamsGetListDebtReminderHistory } from 'types/debtReminderLog';
import { FiltersRef } from 'types/refs';
import Validation from 'utils/Validation';

interface Props {
  onSearch: (params: Partial<IParamsGetListDebtReminderHistory>) => void;
  onSubmit: VoidFunction;
  onClear: VoidFunction;
}

const schema = Validation.shape({});

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { onSearch } = props;
  const { t } = useTranslation();
  const [users, setUsers] = useState<IUser[]>([]);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const storeApplicationList = useSelector(getStoreApplicationList);

  const form = useForm<IParamsGetListDebtReminderHistory>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const handleSubmit = (values: IParamsGetListDebtReminderHistory) => {
    onSearch(values);
  };

  const handleReset = () => {
    form.reset(schema.getDefault());
  };

  useImperativeHandle(ref, () => ({
    reset: handleReset,
    submit: form.handleSubmit(handleSubmit),
  }));

  const trimSpaceForm = (event: any, name: string) => {
    const value = event.target.value;
    // form.setValue(name, value.trim());
  };

  useEffect(() => {
    APIGetListUser()
      .then((result) => {
        setUsers(result);
      })
      .catch(console.log);
    APIGetListCustomer()
      .then((result) => {
        setCustomers(result);
      })
      .catch(console.log);
  }, []);

  return (
    <ProForm
      form={form}
      onFinish={handleSubmit}
      PaperProps={{ sx: { padding: '16px 16px 0 16px' } }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={2.5}>
          <ProDateRange
            label={t('Ngày nhắc nợ')}
            from="payDateFrom"
            to="payDateTo"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.4}>
          <ProFormTextField
            name="code"
            placeholder={t('ID')}
            InputLabelProps={{ shrink: true }}
            onBlur={(event) => trimSpaceForm(event, 'code')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.4}>
          <ProFormAutocomplete
            name="customerId"
            placeholder={t('Khách hàng')}
            options={customers}
            renderValue={(option) => option.id}
            renderLabel={(option) => option?.name || ''}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.4}>
          <ProFormAutocomplete
            name="creatorId"
            placeholder={t('Người tạo')}
            options={users}
            renderValue={(option) => option.id}
            renderLabel={(option) => option.name || ''}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.4}>
          <ProFormAutocomplete
            name="handlerEmployeeId"
            placeholder={t('Nhân viên phụ trách')}
            options={users}
            renderValue={(option) => option.id}
            renderLabel={(option) => option.name || ''}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.4}>
          <ProFormCheckboxSelect<FieldValues, number>
            name="handlerStoreIds"
            placeholder={t('Cửa hàng phụ trách')}
            options={storeApplicationList}
            renderLabel={(option) => option?.name}
            renderValue={(option) => option?.id}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2} lg={1}>
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button type="submit">Lọc</Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </ProForm>
  );
});

export default FiltersForm;
