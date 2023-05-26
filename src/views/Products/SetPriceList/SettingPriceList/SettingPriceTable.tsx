import ActionButton from 'components/ProButton/ActionButton';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiltersRef } from 'types/refs';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import { ISettingPriceListType } from './utils/type';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import useNotification from 'hooks/useNotification';
import { getAllListPriceTable, getListPriceTable } from 'slices/priceTable';

const Data = [
  {
    id: 127693,
    priceName: 'Cell 500/đơn',
    timeApplication: null,
    status: true,
    creator: 'Luân',
    createTime: '2022-02-17 14:10:55',
    category: null,
  },
  {
    id: 127692,
    priceName: 'Cell 500/đơn',
    timeApplication: null,
    status: false,
    creator: 'Luân',
    createTime: null,
    category: null,
  },
];

const SettingPriceTable = () => {
  const [refresh, refetch] = useRefresh();
  const [banners] = useState<ISettingPriceListType[]>(Data);
  const [data, setData] = useState<ISettingPriceListType[]>(Data);
  const [loading, setLoading] = useState<boolean>(false);
  const [total] = useState<number>(banners.length || 0);
  const filtersRef = useRef<FiltersRef>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();
  const listPriceTable = useSelector(getAllListPriceTable)

  const navigate = useNavigate();
  const setNotification = useNotification();
  const handleResetFilters = () => {
    filtersRef.current?.reset();
  };

  const handleSubmitFilters = () => {
    filtersRef.current?.submit();
  };


  console.log('listPriceTable', listPriceTable);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getListPriceTable(filters))
      if (!response.payload) {
        setNotification({
          error: 'Lỗi khi lấy dữ liệu!',
        });
      }
    } catch (error) {
      setNotification({
        error: 'Lỗi khi lấy dữ liệu!',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [filters, refresh])

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
  });
  return (
    <ProTable<ISettingPriceListType>
      title="Danh sách sản phẩm"
      loading={loading}
      columns={columns}
      data={banners}
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
        <ActionButton
          variant="contained"
          color="info"
          actionType="add"
          onClick={() => navigate('/products/setting-price-list/add')}
        >
          Thêm mới
        </ActionButton>
      }
    />
  );
};

export default SettingPriceTable;
