import { TableRow, Typography } from '@mui/material';
import ActionButton from 'components/ProButton/ActionButton';
import ProTable from 'components/ProTable';
import ProTableCell from 'components/ProTable/ProTableCell';
import useNotification from 'hooks/useNotification';
import useRefresh from 'hooks/useRefresh';
import { isEmpty } from 'lodash';
import { Fragment, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getListDebtSupplierApi } from 'slices/debtSupplier';
import { AppDispatch, useTypedSelector } from 'store';
import { DebtSupplier } from 'types/debtSupplier';
import { FiltersRef } from 'types/refs';
import Currency from 'utils/Currency';

import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import Logger from 'utils/Logger';
import { ExportDebtSupplierAPI } from 'services/debtSupplier';
import DownloadFile from 'utils/downloadFiles';

const DebtSupplierTable = () => {
  const { t } = useTranslation();
  const [, refetch] = useRefresh();
  const setNotification = useNotification();
  const dispatch = useDispatch<AppDispatch>();

  const filtersRef = useRef<FiltersRef>(null);

  const { loading, DebtSupplierList, total, type, ndt } = useTypedSelector(
    (state) => state.debtSupplier
  );

  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
  });

  const handleResetFilters = () => {
    filtersRef.current?.reset();
  };

  const handleSubmitFilters = () => {
    filtersRef.current?.submit();
  };

  const fetchData = useCallback(() => {
    dispatch(getListDebtSupplierApi(filters))
      .unwrap()
      .catch((error) => {
        setNotification({
          error: 'Lỗi khi tải danh sách công nợ',
        });
      });
  }, [dispatch, filters, setNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData, filters, refetch]);


  const handleExport = async () => {
    try {
      const res = await ExportDebtSupplierAPI(filters);
      const { headers, data } = res;
      DownloadFile.getDownloadBinaryFile(data, headers);
      if (!data) {
        setNotification({
          error: 'Đã xảy ra lỗi, vui lòng thử lại sau',
        });

        return;
      }
    } catch (error) {
      Logger.log(error);
    }
  };

  const renderTotalRow = () => {
    if (loading) {
      return <></>;
    }

    let typeInPage = null;

    if (DebtSupplierList.filter((x) => x.supplierType === 1).length === 0) {
      if (ndt) {
        typeInPage = 1;
      } else {
        typeInPage = 0;
      }
    }

    if (DebtSupplierList.filter((x) => x.supplierType === 0).length === 0) {
      typeInPage = 1;
    }

    let CurrencyFormat;

    if (typeInPage === 1) {
      CurrencyFormat = Currency.FormatVND;
    } else if (typeInPage === 0) {
      CurrencyFormat = Currency.FormatNDT;
    } else {
      if (ndt) {
        CurrencyFormat = Currency.FormatVND;
      } else {
        return <></>;
      }
    }

    const totalBeginReceivable =
      DebtSupplierList.reduce((pre, next) => pre + (next?.beginDebt || 0), 0) *
      (typeInPage === 1 ? ndt || 1 : 1);

    const totalBeginPayable =
      DebtSupplierList.reduce(
        (pre, next) => pre + (next?.beginCredit || 0),
        0
      ) * (typeInPage === 1 ? ndt || 1 : 1);

    const totalReceivable =
      DebtSupplierList.reduce((pre, next) => pre + (next?.debt || 0), 0) *
      (typeInPage === 1 ? ndt || 1 : 1);

    const totalPayable =
      DebtSupplierList.reduce((pre, next) => pre + (next?.credit || 0), 0) *
      (typeInPage === 1 ? ndt || 1 : 1);

    const totalEndReceivable =
      DebtSupplierList.reduce((pre, next) => pre + (next?.endDebt || 0), 0) *
      (typeInPage === 1 ? ndt || 1 : 1);

    const totalEndPayable =
      DebtSupplierList.reduce((pre, next) => pre + (next?.endCredit || 0), 0) *
      (typeInPage === 1 ? ndt || 1 : 1);

    return (
      <>
        {!isEmpty(DebtSupplierList) && (
          <TableRow hover>
            <ProTableCell offset={0} colSpan={2}>
              <Typography fontWeight="bold">Tổng</Typography>
            </ProTableCell>
            <ProTableCell offset={0}>
              <Typography fontWeight="bold">
                {CurrencyFormat(totalBeginReceivable || 0)}
              </Typography>
            </ProTableCell>
            <ProTableCell offset={0}>
              <Typography fontWeight="bold">
                {CurrencyFormat(totalBeginPayable || 0)}
              </Typography>
            </ProTableCell>
            <ProTableCell offset={0}>
              <Typography fontWeight="bold">
                {CurrencyFormat(totalReceivable || 0)}
              </Typography>
            </ProTableCell>
            <ProTableCell offset={0}>
              <Typography fontWeight="bold">
                {CurrencyFormat(totalPayable || 0)}
              </Typography>
            </ProTableCell>
            <ProTableCell offset={0}>
              <Typography fontWeight="bold">
                {CurrencyFormat(totalEndReceivable || 0)}
              </Typography>
            </ProTableCell>
            <ProTableCell offset={0}>
              <Typography fontWeight="bold">
                {CurrencyFormat(totalEndPayable || 0)}
              </Typography>
            </ProTableCell>
            <ProTableCell offset={0}></ProTableCell>
          </TableRow>
        )}
      </>
    );
  };

  return (
    <ProTable<DebtSupplier>
      title="Danh sách sản phẩm"
      loading={loading}
      columns={columns}
      data={DebtSupplierList}
      refetch={refetch}
      onSortingChange={onSortingChange}
      pagination={{
        page: filters.pageIndex || 1,
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
      toolBar={
        <Fragment>
          <ActionButton onClick={handleExport} iconPosition="start" actionType="upload" color="info">
            {t('Xuất excel')}
          </ActionButton>
        </Fragment>
      }
      totalRow={renderTotalRow()}
      hideFooter
    />
  );
};

export default DebtSupplierTable;
