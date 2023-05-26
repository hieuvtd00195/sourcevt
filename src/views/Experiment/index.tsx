import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import flatMap from 'lodash.flatmap';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { FiltersRef } from 'types/refs';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import { getBills } from './utils/services';
import type { FlattenedBill } from './utils/types';

const ProductTable = () => {
  const { t } = useTranslation();
  const [, refetch] = useRefresh();
  const [bills, setBills] = useState<FlattenedBill[]>([]);
  const [loading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const filtersRef = useRef<FiltersRef>(null);
  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();

  useEffect(() => {
    getBills()
      .then((response) => {
        const { data } = response;

        const flattenedBill = flatMap(data, (bill) => {
          const { products, ...rest } = bill;
          return products.map<FlattenedBill>((product) => ({
            product,
            ...rest,
          }));
        });

        setBills(flattenedBill);
        setTotal(flattenedBill.length);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleResetFilters = () => {
    filtersRef.current?.reset();
  };

  const handleSubmitFilters = () => {
    filtersRef.current?.submit();
  };

  const { columns } = useTableColumns();

  return (
    <PageWrapper title={t('Danh sách sản phẩm')}>
      <PageBreadcrumbs
        title={t('Danh sách sản phẩm')}
        items={[{ link: '/products', text: 'Sản phẩm' }]}
      />
      <ProTable<FlattenedBill>
        title="Danh sách sản phẩm"
        loading={loading}
        columns={columns}
        data={bills}
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
            <ProMenu
              position="right"
              items={[
                {
                  label: 'Thêm mới',
                  value: 1,
                  actionType: 'add',
                },
                {
                  label: 'Nhập từ Excel',
                  value: 2,
                  actionType: 'excel',
                },
                {
                  label: 'Nhập từ Excel sản phẩm Combo',
                  value: 3,
                  actionType: 'excel',
                },
              ]}
            >
              <ActionButton
                iconPosition="end"
                actionType="expand"
                color="success"
              >
                {t('Thêm mới')}
              </ActionButton>
            </ProMenu>
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
                  label: 'In mã vạch',
                  value: 2,
                  actionType: 'print',
                },
                { type: 'divider' },
                {
                  label: 'Đổi trạng thái sản phẩm',
                  value: 3,
                  actionType: 'sync',
                },
                {
                  label: 'Set lại SP hot',
                  value: 4,
                },
                {
                  label: 'Set lại SP mới',
                  value: 5,
                },
                {
                  label: 'Set lại cha con',
                  value: 6,
                },
                { type: 'divider' },
                {
                  label: 'Xóa các dòng đã chọn',
                  value: 7,
                  actionType: 'delete',
                  color: 'error.main',
                },
                {
                  label: 'Xem giá sản phẩm theo chi nhánh',
                  value: 8,
                  actionType: 'tree',
                },
              ]}
            >
              <ActionButton iconPosition="end" actionType="expand" color="info">
                {t('Thao tác')}
              </ActionButton>
            </ProMenu>
          </Fragment>
        }
      />
    </PageWrapper>
  );
};

export default ProductTable;
