import { nanoid } from '@reduxjs/toolkit';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useRef, useState } from 'react';
import type { FiltersRef } from 'types/refs';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import { Account } from './utils/type';

const DATA: Account[] = [
  {
    id: nanoid(),
    code: '',
    name: 'Tổng',
    startBalance: { debit: '929376801', credit: '929376801' },
    ariseBalance: { debit: '929376801', credit: '929376801' },
    endBalance: { debit: '929376801', credit: '929376801' },
  },
  {
    id: nanoid(),
    code: '1112',
    name: 'Tiền mặt',
    startBalance: { debit: '40789000', credit: '' },
    ariseBalance: { debit: '436785000', credit: '429639000' },
    endBalance: { debit: '47935000', credit: '' },
  },
  {
    id: nanoid(),
    code: '1113',
    name: 'Tiền Việt Nam',
    startBalance: { debit: '40789000', credit: '429639000' },
    ariseBalance: { debit: '436785000', credit: '' },
    endBalance: { debit: '47935000', credit: '429639000' },
  },
  {
    id: nanoid(),
    code: '11111',
    name: 'Tiền mặt 665 Lê Hồng Phong',
    startBalance: { debit: '40147000', credit: '' },
    ariseBalance: { debit: '401420000', credit: '394492000' },
    endBalance: { debit: '47075000', credit: '' },
  },
];

const AccountTable = () => {
  const [, refetch] = useRefresh();
  const [data] = useState<Account[]>(DATA);
  const [loading] = useState<boolean>(false);
  // const [total] = useState<number>(data.length || 0);
  const filtersRef = useRef<FiltersRef>(null);
  const { filters, onSortingChange, onSearch } = useFilters();

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
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
        <ProTable<Account>
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
                    label: 'In báo cáo',
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
    </Fragment>
  );
};

export default AccountTable;
