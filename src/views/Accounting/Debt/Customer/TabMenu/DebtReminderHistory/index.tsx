import Box from '@mui/material/Box';
import ActionButton from 'components/ProButton/ActionButton';
import ProTable from 'components/ProTable';
import useNotification from 'hooks/useNotification';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getListDebtReminderLogApi } from 'slices/debtReminderLog';
import { useTypedDispatch, useTypedSelector } from 'store';
import { FiltersRef } from 'types/refs';
import UpdateDebtHistory from '../../components/UpdateDebtHistory';
import AddDialog from './AddDialog';
import FiltersForm from './FilterForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import { IDebtReminderLog } from 'types/debtReminderLog';
import { APIExportDebtReminderHistory } from 'services/debtReminderLog';
import DownloadFile from 'utils/downloadFiles';
import Logger from 'utils/Logger';

const DebtReminderHistory = () => {
  const { t } = useTranslation();
  const [reRender, refetch] = useRefresh();
  const dispatch = useTypedDispatch();
  const setNotification = useNotification();
  const filtersRef = useRef<FiltersRef>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { DebtReminderLogList, loading, total } = useTypedSelector(
    (state) => state.debtReminderLog
  );

  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();
  const [isShowPopup, setIsShowPopup] = useState<boolean>(false);

  const handleClickShowPopup = () => {
    setIsShowPopup(!isShowPopup);
  };

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
    handleClickShowPopup,
  });

  const handleResetFilters = () => {
    filtersRef.current?.reset();
  };

  const handleSubmitFilters = () => {
    filtersRef.current?.submit();
  };

  const handleExport = async () => {
    try {
      const res = await APIExportDebtReminderHistory(filters);
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
      setNotification({ error: 'Lỗi khi export danh sách lịch sử nhắc nợ!' });
    }
  };

  useEffect(() => {
    dispatch(getListDebtReminderLogApi(filters))
      .unwrap()
      .catch(() => {
        setNotification({
          error: 'Lỗi khi tải danh sách lịch sử nhắc nợ!',
        });
      });
  }, [dispatch, filters, setNotification, reRender]);

  return (
    <Fragment>
      <ProTable<IDebtReminderLog>
        title="Danh sách công nợ khách hàng"
        loading={loading}
        columns={columns}
        data={DebtReminderLogList}
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
            <ActionButton
              iconPosition="end"
              actionType="add"
              onClick={() => setOpenDialog(true)}
            >
              {t('Thêm mới')}
            </ActionButton>
            <ActionButton
              iconPosition="end"
              actionType="download"
              variant="outlined"
              onClick={handleExport}
            >
              {t('Xuất excel')}
            </ActionButton>
            <UpdateDebtHistory
              open={isShowPopup}
              handleClose={() => setIsShowPopup(false)}
            />
          </Fragment>
        }
        hideFooter
      />
      <AddDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        refetch={refetch}
      />
    </Fragment>
  );
};

export default DebtReminderHistory;
