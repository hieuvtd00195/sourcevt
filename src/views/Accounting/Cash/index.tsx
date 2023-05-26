import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useCallback, useRef, useState } from 'react';
import type { FiltersRef } from 'types/refs';
import ConfirmChangeStore from './components/ConfirmChangeStore';
import EditNote from './components/EditNote';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import type { Cash } from './utils/type';

const DATA: Cash[] = [
  {
    id: 1,
    transactionId: 67471,
    date: '2023-02-03T08:32:46.000+00:00',
    type: 1,
    account: { id: 12311, info: 'Tiền mặt 665 Lê Hồng Phong' },
    contraAccount: { id: 121, info: 'Phải thu khách hàng' },
    object: { id: 6692131, info: 'Đoàn Nguyễn-548 Lê Hồng Phong-SG' },
    document: 875122,
    receive: 29750000,
    spend: 320000,
    creator: 'Long SG',
    note: 'Còn Fnatic thì chẳng còn từ gì để diễn tả, sáng nay họ thua cả Astralis',
    file: '',
  },

  {
    id: 2,
    transactionId: 67471,
    date: '2023-02-03T08:32:46.000+00:00',
    type: 2,
    account: { id: 12311, info: 'Tiền mặt 665 Lê Hồng Phong' },
    contraAccount: { id: 121, info: 'Phải thu khách hàng' },
    object: { id: 6692131, info: 'Đoàn Nguyễn-548 Lê Hồng Phong-SG' },
    document: 875122,
    receive: 29750000,
    spend: 320000,
    creator: 'Long SG',
    note: 'ko có gì',
    file: '',
  },
  {
    id: 3,
    transactionId: 67471,
    date: '2023-02-03T08:32:46.000+00:00',
    type: 4,
    account: { id: 12311, info: 'Tiền mặt 665 Lê Hồng Phong' },
    contraAccount: { id: 121, info: 'Phải thu khách hàng' },
    object: { id: 6692131, info: 'Đoàn Nguyễn-548 Lê Hồng Phong-SG' },
    document: 875122,
    receive: 29750000,
    spend: 320000,
    creator: 'Long SG',
    note: 'ko có gì',
    file: '',
  },
];

const InventoryTable = () => {
  const [, refetch] = useRefresh();
  const [data] = useState<Cash[]>(DATA);
  const [loading] = useState<boolean>(false);
  const [total] = useState<number>(data.length || 0);
  const filtersRef = useRef<FiltersRef>(null);
  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();
  const [rowIds, setRowIds] = useState<number[]>([]);
  const [openConfirmChangeStore, setOpenConfirmChangeStore] =
    useState<boolean>(false);
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

  const handleRowSelectionChange = (rowIds: string[]) => {
    setRowIds(rowIds.map(Number));
  };

  const handleCloseChangeStore = () => {
    setOpenConfirmChangeStore((prev) => !prev);
  };

  const confirmChangeStore = (store: number | null) => {};

  return (
    <Fragment>
      <PageWrapper title="Kế toán">
        <PageBreadcrumbs
          title="Thu chi tiền mặt"
          items={[{ link: '/accounting/transaction/index', text: 'Kế toán' }]}
        />
        <ProTable<Cash>
          title="Danh sách giao dịch"
          loading={loading}
          columns={columns}
          data={data}
          refetch={refetch}
          onSortingChange={onSortingChange}
          onRowSelectionChange={handleRowSelectionChange}
          pagination={{
            page: filters.pageNumber,
            total,
            pageSize: filters.pageSize,
            onPageChange,
            onPageSizeChange,
          }}
          initialstate={{ hiddenColumns: [], hiddenVisibilityColumns: true }}
          filter={<FiltersForm ref={filtersRef} onSearch={onSearch} />}
          toolBar={
            <Fragment>
              <ProMenu<number>
                position="left"
                items={[
                  {
                    label: 'Thêm phiếu thu chi',
                    value: 1,
                    to: '/accounting/addcash',
                    actionType: 'add',

                    // onSelect: handleToggleExportInventory,
                  },
                  {
                    label: 'Import thu chi',
                    value: 2,
                    // onSelect: handleCloseChangeStore,
                    actionType: 'upload',
                  },
                ]}
              >
                <ActionButton color="success">Thêm mới</ActionButton>
              </ProMenu>
              <ProMenu<number>
                position="left"
                items={[
                  {
                    label: 'Xuất Excel',
                    value: 1,
                    // onSelect: handleToggleExportInventory,
                    actionType: 'excel',
                  },
                  {
                    label: 'In phiếu đã chọn',
                    value: 2,
                    onSelect: handleCloseChangeStore,
                    disabled: rowIds.length === 0,
                    actionType: 'print',
                  },
                ]}
              >
                <ActionButton color="info">Thao tác</ActionButton>
              </ProMenu>
            </Fragment>
          }
          hideFooter
        />
      </PageWrapper>
      <ConfirmChangeStore
        open={openConfirmChangeStore}
        onClose={handleCloseChangeStore}
        confirmChange={confirmChangeStore}
      />
      <EditNote
        open={openEditNote}
        onClose={handleCloseEditNote}
        confirmChange={confirmEditNote}
        value={value}
      />
    </Fragment>
  );
};

export default InventoryTable;
