import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useCallback, useRef, useState } from 'react';
import type { FiltersRef } from 'types/refs';
import EditNote from './components/EditNote';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import { Expire } from './utils/type';

const DATA: Expire[] = [
  {
    id: 1,
    storeName: 'Kho Màn Hình HCM',
    storeCode: 'Kho Màn Hình HCM',
    city: {
      city: 'Hồ Chí Minh',
      district: 'Quận 3',
    },
    address: {
      phone: '981212331',
      address: 'Kho màn hình HCM',
    },
    note: 'Lưu ý về sản phẩm',
    expireDate: '2022-10-16T12:00:00.000+00:00',
    visible: true,
    creator: {
      name: 'CSKH-Nhanh',
      time: '2022-10-16T12:00:00.000+00:00',
    },
  },
  {
    id: 2,
    storeName: 'Kho Màn Hình HCM',
    storeCode: 'Kho Màn Hình HCM',
    city: {
      city: 'Hồ Chí Minh',
      district: 'Quận 3',
    },
    address: {
      phone: '981212331',
      address: 'Kho màn hình HCM',
    },
    note: 'Lưu ý về sản phẩm',
    expireDate: '2022-10-16T12:00:00.000+00:00',
    visible: true,
    creator: {
      name: 'CSKH-Nhanh',
      time: '2022-10-16T12:00:00.000+00:00',
    },
  },
  {
    id: 3,
    storeName: 'Kho Màn Hình HCM',
    storeCode: 'Kho Màn Hình HCM',
    city: {
      city: 'Hồ Chí Minh',
      district: 'Quận 3',
    },
    address: {
      phone: '981212331',
      address: 'Kho màn hình HCM',
    },
    note: 'Lưu ý về sản phẩm',
    expireDate: '2022-10-16T12:00:00.000+00:00',
    visible: false,
    creator: {
      name: 'CSKH-Nhanh',
      time: '2022-10-16T12:00:00.000+00:00',
    },
  },
];

const ExpireTable = () => {
  const [, refetch] = useRefresh();
  const [data] = useState<Expire[]>(DATA);
  const [loading] = useState<boolean>(false);
  const [total] = useState<number>(data.length || 0);
  const filtersRef = useRef<FiltersRef>(null);
  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();
  const [, setEditRowId] = useState<number | null>(null);
  const [value, setValue] = useState<string>('');
  const [openEditNote, setEditNote] = useState<boolean>(false);

  // edit note
  const handleEditNote = useCallback((rowId: number, note: string) => {
    setEditNote(true);
    setEditRowId(rowId);
    setValue(note);
  }, []);

  const handleCloseEditNote = () => {
    setEditNote(false);
    setEditRowId(null);
  };

  const confirmEditNote = (price: string) => {};

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
    handleEditNote,
  });

  return (
    <Fragment>
      <PageWrapper title="Cửa hàng">
        <PageBreadcrumbs
          title="Cửa hàng"
          items={[{ link: '/setting/expire', text: 'Cài đặt' }]}
        />
        <ProTable<Expire>
          title="Danh sách sản phẩm"
          loading={loading}
          columns={columns}
          data={data}
          refetch={refetch}
          onSortingChange={onSortingChange}
          pagination={{
            page: filters.pageNumber,
            total,
            pageSize: filters.pageSize,
            onPageChange,
            onPageSizeChange,
          }}
          initialstate={{
            hiddenColumns: [],
            hiddenVisibilityColumns: false,
            hiddenFilterActions: false,
          }}
          filter={<FiltersForm ref={filtersRef} onSearch={onSearch} />}
          toolBar={
            <Fragment>
              <ProMenu<number>
                position="left"
                items={[
                  {
                    label: 'Xuất Toàn Bộ',
                    value: 1,
                    // onSelect: handleToggleExportInventory,
                    actionType: 'excel',
                  },
                ]}
              >
                <ActionButton color="info">Thao tác</ActionButton>
              </ProMenu>
            </Fragment>
          }
        />
      </PageWrapper>
      <EditNote
        open={openEditNote}
        onClose={handleCloseEditNote}
        confirmChange={confirmEditNote}
        value={value}
      />
    </Fragment>
  );
};

export default ExpireTable;
