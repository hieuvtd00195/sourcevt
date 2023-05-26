import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Collapse } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProForm from 'components/ProForm';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';
import ProFormFilterAction from 'components/ProForm/ProFormFilterAction';
import ProFormHiddenInput from 'components/ProForm/ProFormHiddenInput';
import ProNumberRange from 'components/ProNumberInput/ProNumberRange';
import ProFormAutocomplete from 'components/ProTable/core/EditableCell/ProFormAutocomplete';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { APIGetListUser, IUser } from 'services/masterdata';
import { getCustomerSelectApi } from 'slices/customer';
import { getMasterDataListProvince, getProvinceList } from 'slices/masterData';
import { getStoreApplicationList } from 'slices/storeApplication';
import { useTypedDispatch, useTypedSelector } from 'store';
import { ISearchCustomer } from 'types/customer';
import { FiltersRef } from 'types/refs';
import Validation from 'utils/Validation';
import { initFilter } from './utils/filters';
import { getListStoreApplication } from 'slices/storeApplication';

const schema = Validation.shape({});

interface Props {
  onSearch: (params: Partial<ISearchCustomer>) => void;
  onSubmit: VoidFunction;
  onClear: VoidFunction;
}

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { onSearch, onSubmit, onClear } = props;
  const { sortBy, sortDirection, pageNumber, pageSize, pageIndex, ...res } =
    initFilter;

  const { t } = useTranslation();
  const dispatch = useTypedDispatch();
  const ProvinceList = useSelector(getMasterDataListProvince);
  const storeApplicationList = useSelector(getStoreApplicationList);
  const { customerList } = useTypedSelector((state) => state.customer);

  const [users, setUsers] = useState<IUser[]>([]);
  const [isShowFilter, setIsShowFilter] = useState<boolean>(false);

  const form = useForm<ISearchCustomer>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: res,
  });

  const handleSubmit = (values: ISearchCustomer) => {
    onSearch(values);
  };

  const handleShowFilter = () => {
    setIsShowFilter(!isShowFilter);
  };

  const handleReset = () => {
    form.reset(schema.getDefault());
  };

  useImperativeHandle(ref, () => ({
    reset: handleReset,
    submit: form.handleSubmit(handleSubmit),
  }));

  useEffect(() => {
    dispatch(getCustomerSelectApi(''));
    dispatch(getProvinceList({}));
    dispatch(getListStoreApplication({}));
    APIGetListUser()
      .then((result) => {
        setUsers(result);
      })
      .catch(console.log);
  }, []);

  return (
    <ProForm form={form} onFinish={handleSubmit} PaperProps={{ sx: { p: 2 } }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={1}>
          <ProFormTextField
            name="id"
            placeholder={t('ID')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <ProFormCheckboxSelect
            name="customerIds"
            placeholder={t('Khách hàng')}
            options={customerList}
            renderLabel={(option) => option.name + ' - ' + option.phone}
            renderValue={(option) => option.id || ''}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <ProFormAutocomplete
            name="customerType"
            placeholder={t('Loại')}
            options={[
              { value: 0, label: 'Khách lẻ' },
              { value: 1, label: 'Khách spa' },
              { value: 2, label: 'Đại lý' },
            ]}
            renderLabel={(option) => option.label}
            renderValue={(option) => option.value}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <ProFormCheckboxSelect<FieldValues, number>
            name="supportEmployeeId"
            placeholder={t('Nhân viên chăm sóc')}
            options={users}
            renderValue={(option) => option.id}
            renderLabel={(option) => option.name || ''}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <ProFormCheckboxSelect<FieldValues, number>
            name="handlerEmployeeId"
            placeholder={t('Nhân viên phụ trách')}
            options={users}
            renderValue={(option) => option.id}
            renderLabel={(option) => option.name || ''}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2.5}>
          <ProFormAutocomplete
            name="debtGroup"
            placeholder={t('Phân loại công nợ')}
            options={[
              { value: 0, label: 'Bình thường' },
              { value: 1, label: 'Hạn chế' },
              { value: 2, label: 'Không xuất hàng' },
            ]}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <ProFormCheckboxSelect<FieldValues, number>
            name="handlerStoreId"
            placeholder={t('CHPT')}
            options={storeApplicationList}
            renderLabel={(option) => option?.name}
            renderValue={(option) => option?.id}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <ProFormFilterAction
            onSubmit={onSubmit}
            onClear={onClear}
            onExpanded={handleShowFilter}
          />
        </Grid>
      </Grid>

      <Collapse in={isShowFilter} timeout="auto">
        <Grid container spacing={2} mt={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4} lg={1.25}>
            <Typography>Giới tính</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.25}>
            <ProFormAutocomplete
              name="gender"
              placeholder={t('Giới tính')}
              options={[
                { value: 0, label: 'Nam' },
                { value: 1, label: 'Nữ' },
                { value: 2, label: 'Khác' },
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={0.75}>
            <Typography>Thành phố</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.25}>
            <ProFormAutocomplete
              name="provinceId"
              placeholder={t('Thành phố')}
              options={ProvinceList}
              renderLabel={(option) => option.name}
              renderValue={(option) => option.id}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={1.25}>
            <Typography>Ngày bắt đầu mua</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.25}>
            <ProDateRange
              label={t(' ')}
              from="firstPurchaseDateFrom"
              to="firstPurchaseDateTo"
            />
          </Grid>

          <Grid item xs={0} sm={0} md={0} lg={2}></Grid>

          <Grid item xs={12} sm={6} md={4} lg={1.25}>
            <Typography>Ngày cuối cùng mua</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.25}>
            <ProDateRange
              label={t(' ')}
              from="lastPurchaseDateFrom"
              to="lastPurchaseDateTo"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={0.75}>
            <Typography>Chu kỳ mua</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.25}>
            <Box width="fit-content">
              <ProNumberRange
                label={t(' ')}
                from="purchaseCycleFrom"
                to="purchaseCycleTo"
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={1.25}>
            <Typography>Số ngày chưa mua</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.25}>
            <Box width="fit-content">
              <ProNumberRange
                label={t(' ')}
                from="nonPurchaseDaysFrom"
                to="nonPurchaseDaysTo"
              />
            </Box>
          </Grid>
        </Grid>
      </Collapse>

      <ProFormHiddenInput />
    </ProForm>
  );
});

export default FiltersForm;
