import { Box, Typography, styled } from '@mui/material';
import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useNotification from 'hooks/useNotification';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDebtCustomerList,
  getDebtCustomerTotal,
  getDebtCustomerTotalList,
  getListDebtCustomer,
  getTotalDebtCustomer,
} from 'slices/debtCustomer';
import { AppDispatch } from 'store';
import { DebtCustomer } from 'types/debtCustomer';
import { FiltersRef } from 'types/refs';
import Numeral from 'utils/Numeral';
import UpdateDebtHistory from '../../components/UpdateDebtHistory';
import { Debt } from '../../utils/type';
import FiltersForm from './FilterForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';

const DebtTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [, refetch] = useRefresh();
  const setNotification = useNotification();

  const [customerDebtList, setCustomerDebtList] = useState<DebtCustomer[]>([]);

  const filtersRef = useRef<FiltersRef>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [displayTotalDebt, setDisplayTotalDebt] = useState<boolean>(false);

  const debtCustomerList = useSelector(getDebtCustomerList);
  const debtCustomerTotalList = useSelector(getDebtCustomerTotalList);
  const totalDebtCustomer = useSelector(getDebtCustomerTotal);

  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();
  const [isShowPopup, setIsShowPopup] = useState<boolean>(false);

  const handleClickShowPopup = () => {
    setIsShowPopup(!isShowPopup);
  };

  const { columns } = useTableColumns({
    pageIndex: filters.pageIndex,
    pageSize: filters.pageSize,
    handleClickShowPopup,
  });

  const handleResetFilters = () => {
    filtersRef.current?.reset();
  };

  const handleSubmitFilters = () => {
    filtersRef.current?.submit();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await dispatch(getListDebtCustomer(filters));
      if (!response.payload) {
        setNotification({
          error: 'Lỗi khi lấy dữ liệu!',
        });
      }
    } catch (error) {
      setNotification({
        error: 'Lỗi khi lấy dữ liệu!',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, refetch]);

  useEffect(() => {
    setCustomerDebtList(debtCustomerList);
    setTotal(debtCustomerTotalList);
  }, [debtCustomerList]);

  const handleChangeTotal = async () => {
    try {
      const response = await dispatch(getTotalDebtCustomer(filters));
      if (response.payload) {
        setDisplayTotalDebt(true);
      }
      if (!response.payload) {
        setNotification({
          error: 'Lỗi khi lấy dữ liệu!',
        });
      }
    } catch (error) {
      setNotification({
        error: 'Lỗi khi lấy dữ liệu!',
      });
    } finally {
    }
  };

  useEffect(() => {
    setDisplayTotalDebt(false);
  }, [filters]);

  return (
    <ProTable<Debt>
      title="Danh sách công nợ khách hàng"
      loading={loading}
      columns={columns}
      data={customerDebtList}
      refetch={refetch}
      onSortingChange={onSortingChange}
      initialstate={{
        hiddenVisibilityColumns: true,
        hiddenColumns: [],
      }}
      pagination={{
        page: filters.pageIndex,
        total,
        pageSize: filters.pageSize,
        onPageChange,
        onPageSizeChange,
      }}
      filter={
        <FiltersForm
          ref={filtersRef}
          onSearch={onSearch}
          onSubmit={handleSubmitFilters}
          onClear={handleResetFilters}
        />
      }
      titleFunction={{
        display: displayTotalDebt,
        title: (
          <BoxTotal sx={{ p: 1.5 }}>
            <Typography sx={{ fontWeight: 500 }}>
              Tổng phải thu khách hàng:{' '}
              <strong>{Numeral.price(totalDebtCustomer?.credit)}</strong>.
            </Typography>
            <Typography sx={{ pl: 1.5, fontWeight: 500 }}>
              Tổng phải trả khách hàng:{' '}
              <strong>{Numeral.price(totalDebtCustomer?.debt)}</strong>.
            </Typography>
          </BoxTotal>
        ),
      }}
      toolBar={
        <Fragment>
          <ProMenu
            position="right"
            items={[
              {
                label: 'Xuất Excel',
                value: 1,
                actionType: 'excel',
              },
              { type: 'divider' },
              {
                label: 'Tính tổng phải thu khách hàng',
                value: 2,
                actionType: 'add',
                onSelect: handleChangeTotal,
              },
            ]}
          >
            <ActionButton iconPosition="end" actionType="expand" color="info">
              {t('Thao tác')}
            </ActionButton>
          </ProMenu>
          <UpdateDebtHistory
            open={isShowPopup}
            handleClose={() => setIsShowPopup(false)}
          />
        </Fragment>
      }
    />
  );
};

const BoxTotal = styled(Box)`
  display: flex;
  align-items: center;
  strong {
    color: #ff0000;
  }
`;

export default DebtTable;
