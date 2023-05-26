import { nanoid } from '@reduxjs/toolkit';
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
import { Branch } from './utils/type';

const DATA: Branch[] = [
  {
    id: nanoid(),
    product: 'Kính ĐB 14Pro',
    productPrice: {
      retail: '2000000',
      whole: '1800000',
      spa: '1500000',
    },
    vinh: null,
    hcm: {
      retail: '2000000',
      whole: '1800000',
      spa: '1500000',
    },
    th: {
      retail: '2000000',
      whole: '1800000',
      spa: '1500000',
    },
    phatdat: {
      retail: '2000000',
      whole: '1800000',
      spa: '1500000',
    },
    dn: null,
  },
  {
    id: nanoid(),
    product: 'Kính ĐB 14Pro',
    productPrice: {
      retail: '3000000',
      whole: '2400000',
      spa: '100000',
    },
    vinh: {
      retail: '3000000',
      whole: '2400000',
      spa: '100000',
    },
    hcm: null,
    th: null,
    phatdat: null,
    dn: {
      retail: '3000000',
      whole: '2400000',
      spa: '100000',
    },
  },
];

const BranchTable = () => {
  const [, refetch] = useRefresh();
  const [data] = useState<Branch[]>(DATA);
  const [loading] = useState<boolean>(false);
  const [total] = useState<number>(data.length || 0);
  const filtersRef = useRef<FiltersRef>(null);
  const { filters, onSortingChange, onSearch, onPageChange, onPageSizeChange } =
    useFilters();
  const [, setEditRowId] = useState<string | null>(null);
  const [value, setValue] = useState<string>('');
  const [openEditNote, setEditNote] = useState<boolean>(false);

  // edit note
  const handleEditNote = useCallback((rowId: string, note: string) => {
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
      <PageWrapper title="Báo cáo tổng hợp theo tài khoản">
        <PageBreadcrumbs
          title="Báo cáo tổng hợp theo tài khoản"
          items={[
            { link: '#', text: 'Báo cáo' },
            { link: '#', text: 'Kế toán' },
          ]}
        />
        <ProTable<Branch>
          title="Danh sách sản phẩm"
          loading={loading}
          columns={columns}
          data={data}
          refetch={refetch}
          onSortingChange={onSortingChange}
          initialstate={{
            hiddenColumnActions: true,
            hiddenColumns: [],
          }}
          pagination={{
            page: filters.pageNumber,
            total,
            pageSize: filters.pageSize,
            onPageChange,
            onPageSizeChange,
          }}
          filter={<FiltersForm ref={filtersRef} onSearch={onSearch} />}
          toolBar={
            <Fragment>
              <ProMenu<number>
                position="left"
                items={[
                  {
                    label: 'Xuất Excel',
                    value: 1,
                    actionType: 'excel',
                  },
                  {
                    label: 'Import từ excel',
                    value: 2,
                    actionType: 'print',
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

export default BranchTable;
