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
import type { ByProduct } from './utils/type';

const DATA: ByProduct[] = [
  {
    id: 2312,
    customer: { name: 'Tổng', phone: '' },
    product: '',
    price: '',
    sellNumber: '5016',
    return: '15',
    discount: '69588',
    revenue: '792145412',
    costPrice: '',
    profit: '129458713',
    purchaseDate: null,
  },
  {
    id: 1,
    customer: { name: 'A Cường Lap-Q10 (SG)', phone: '0906682666' },
    product: 'Vỏ 11PRM Vàng',
    price: '630000',
    sellNumber: '25',
    return: '',
    discount: '',
    revenue: '14500000',
    costPrice: '14139050',
    profit: '360950',
    purchaseDate: '2023-02-07T00:00:00.000+00:00',
  },
  {
    id: 3,
    customer: { name: 'A Cường Lap-Q10 (SG)', phone: '0906682666' },
    product: 'Vỏ 11PRM Vàng',
    price: '630000',
    sellNumber: '25',
    return: '',
    discount: '',
    revenue: '14500000',
    costPrice: '14139050',
    profit: '360950',
    purchaseDate: '2023-02-07T00:00:00.000+00:00',
  },
  {
    id: 2,
    customer: { name: 'A Cường Lap-Q10 (SG)', phone: '0906682666' },
    product: 'Vỏ 11PRM Vàng',
    price: '630000',
    sellNumber: '25',
    return: '5',
    discount: '',
    revenue: '14500000',
    costPrice: '14139050',
    profit: '360950',
    purchaseDate: '2023-02-07T00:00:00.000+00:00',
  },
];

const ByProductTable = () => {
  const [, refetch] = useRefresh();
  const [data] = useState<ByProduct[]>(DATA);
  const [loading] = useState<boolean>(false);
  const filtersRef = useRef<FiltersRef>(null);
  const { filters, onSortingChange, onSearch } = useFilters();
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

  const handleCloseChangeStore = () => {
    setOpenConfirmChangeStore((prev) => !prev);
  };

  const confirmChangeStore = (store: number | null) => {};

  return (
    <Fragment>
      <PageWrapper title="Theo sản phẩm">
        <PageBreadcrumbs
          title="Theo sản phẩm"
          items={[{ link: '/report/customer', text: 'Báo cáo' }]}
        />
        <ProTable<ByProduct>
          title="Danh sách giao dịch"
          loading={loading}
          columns={columns}
          data={data}
          refetch={refetch}
          onSortingChange={onSortingChange}
          filter={<FiltersForm ref={filtersRef} onSearch={onSearch} />}
          toolBar={
            <ProMenu<number>
              position="left"
              items={[
                {
                  label: 'Xuất Excel',
                  value: 1,
                  // onSelect: handleToggleExportInventory,
                  actionType: 'excel',
                },
              ]}
            >
              <ActionButton color="info">Thao tác</ActionButton>
            </ProMenu>
          }
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

export default ByProductTable;
