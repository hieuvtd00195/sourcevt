import ActionButton from 'components/ProButton/ActionButton';
import LinkButton from 'components/ProButton/LinkButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useNotification from 'hooks/useNotification';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  deleteDraftTicketApi,
  getListDraftTicketApi,
  setSelected,
} from 'slices/draftTicket';
import { AppDispatch, useTypedSelector } from 'store';
import { DraftTicket } from 'types/draftTicket';
import type { FiltersRef } from 'types/refs';
import FiltersForm from './FiltersForm';
import useTableColumnnsDraft from './TableColumns';
import useFilters from './utils/filters';
import { APIDeleteDraftRangeTicket } from 'services/draftTicket';

const CreateDraftTicket = () => {
  const { t } = useTranslation();
  const [, refetch] = useRefresh();
  const setNotification = useNotification();
  const dispatch = useDispatch<AppDispatch>();
  const filtersRef = useRef<FiltersRef>(null);

  const { loading, DraftTicketList, total, selected } = useTypedSelector(
    (state) => state.draftTicket
  );
  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();

  const handleResetFilters = () => {
    filtersRef.current?.reset();
  };

  const handleSubmitFilters = () => {
    filtersRef.current?.submit();
  };

  const handleDelete = (id: string) => {
    dispatch(deleteDraftTicketApi(id))
      .unwrap()
      .then(() => {
        setNotification({
          message: 'Xóa phiếu nháp thành công',
          severity: 'success',
        });
        fetchData();
      })
      .catch((error) => {
        setNotification({
          error: error.error.message || 'Lỗi khi xóa phiếu nháp',
        });
      });
  };

  const { columns } = useTableColumnnsDraft({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
    handleDelete,
  });

  const fetchData = useCallback(() => {
    dispatch(getListDraftTicketApi(filters))
      .unwrap()
      .catch(() => {
        setNotification({
          error: 'Lỗi khi tải danh sách phiếu nháp',
        });
      });
  }, [dispatch, filters, setNotification]);

  const handleDeleteRows = async () => {
    try {
      await APIDeleteDraftRangeTicket(selected.map((_item) => _item.id));
      fetchData();
      dispatch(setSelected([]));
      setNotification({
        message: 'Xóa nhiều phiếu nháp thành công',
        severity: 'success',
      });
    } catch (error) {
      setNotification({ error: 'Lỗi khi xóa nhiều phiếu nháp' });
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData, filters, refetch]);

  return (
    <ProTable<DraftTicket>
      title="Danh sách sản phẩm"
      loading={loading}
      columns={columns}
      data={DraftTicketList}
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
          <LinkButton
            iconPosition="end"
            actionType="add"
            color="success"
            to="/warehouse/draft"
          >
            {t('Thêm mới')}
          </LinkButton>
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
                label: 'In mã vạch sản phẩm trong các phiếu XNK đã chọn',
                value: 2,
                actionType: 'print',
              },
              { type: 'divider' },
              {
                label: 'In Imeil sản phẩm các phiếu XNK đã chọn',
                value: 3,
                actionType: 'print',
              },

              { type: 'divider' },
              {
                label: 'Gắn nhãn phiếu chuyển kho đã chọn',
                value: 8,
                actionType: 'tag',
              },
              { type: 'divider' },
              {
                label: 'Xóa các dòng đã chọn',
                value: 7,
                actionType: 'delete',
                color: 'error.main',
                onSelect: handleDeleteRows,
              },
            ]}
          >
            <ActionButton iconPosition="end" actionType="expand" color="info">
              {t('Thao tác')}
            </ActionButton>
          </ProMenu>
        </Fragment>
      }
      onRowSelectionChange={(newSelection) => {
        // setRows((prevRows) =>
        //   prevRows.map((row) => ({
        //     ...row,
        //     isSelected: newSelection.selectionModel.includes(row.id),
        //   }))
        // );
      }}
      hideFooter
    />
  );
};

export default CreateDraftTicket;
