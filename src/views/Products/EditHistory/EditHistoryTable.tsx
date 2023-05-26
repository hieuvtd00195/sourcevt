import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useNotification from 'hooks/useNotification';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useEffect, useRef, useState } from 'react';
import { searchProductModificationHistoryApi } from 'slices/productModificationHistory';
import { useTypedDispatch, useTypedSelector } from 'store';
import type { FiltersRef } from 'types/refs';
import FiltersForm from './FiltersForm';
import PopupDetail from './PopupDetail';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import { IProductModificationHistory } from './utils/type';

const EditHistoryTable = () => {
  const [, refetch] = useRefresh();
  const dispatch = useTypedDispatch();
  const setNotification = useNotification();
  const { productModificationHistoryList, loading, total } = useTypedSelector(
    (state) => state.productModificationHistory
  );
  const filtersRef = useRef<FiltersRef>(null);
  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();

  const [isOpenDialogInfo, setOpenDialogInfo] = useState<boolean>(false);
  const handleToggleDialog = () => {
    setOpenDialogInfo((prev) => !prev);
  };

  const handleResetFilters = () => {
    filtersRef.current?.reset();
  };

  const handleSubmitFilters = () => {
    filtersRef.current?.submit();
  };

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
    handleToggleDialog,
  });

  useEffect(() => {
    dispatch(searchProductModificationHistoryApi(filters))
      .unwrap()
      .then(console.log)
      .catch((error) => {
        setNotification({
          error: error?.error?.message || 'Lỗi khi tải danh sách khách hàng',
        });
      });
  }, [dispatch, filters, setNotification]);

  return (
    <>
      <ProTable<IProductModificationHistory>
        loading={loading}
        columns={columns}
        data={productModificationHistoryList}
        refetch={refetch}
        onSortingChange={onSortingChange}
        pagination={{
          page: filters.pageNumber,
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
            <ActionButton iconPosition="end" actionType="print" color="info">
              {'In mã vạch'}
            </ActionButton>
            <ProMenu
              items={[
                {
                  label: 'Xuất Excel',
                  value: 1,
                  onSelect: () => {
                    console.log('hihi');
                  },
                  actionType: 'excel',
                },
              ]}
            >
              <ActionButton
                iconPosition="end"
                actionType="expand"
                color="success"
              >
                {'Thao tác'}
              </ActionButton>
            </ProMenu>
          </Fragment>
        }
        hideFooter
      />
      {isOpenDialogInfo ? (
        <PopupDetail open={isOpenDialogInfo} onClose={handleToggleDialog} />
      ) : null}
    </>
  );
};

export default EditHistoryTable;
