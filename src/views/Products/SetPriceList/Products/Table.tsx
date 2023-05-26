import { Box } from '@mui/material';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import React, { useCallback, useRef, useState } from 'react';
import { FiltersRef } from 'types/refs';
import ActionButtonComponent from './components/ActionButton';
import CreateCustomerButton from './components/CreateCustomerButton';
import EditPrice from './components/EditPrice';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import { ISettingPriceProduct } from './utils/type';
import ImportProductToPriceList from './components/ImportProductToPriceList';

const DATA = [
  {
    id: 123456,
    code: 'V12PRMTRDE',
    productsName: 'Vỏ 12PRM 5G Trắng - Đẹp',
    invetoryQuantity: 26,
    importPrice: 755000,
    retailPrice: 870000,
    cell500: 777777,
    cell300: 777777,
    cell100: 777777,
    spaPrice: 777777,
    price: 771999,
  },
  {
    id: 123457,
    code: 'V12PRMTRDE',
    productsName: 'Vỏ 12PRM 5G Trắng - Đẹp',
    invetoryQuantity: 26,
    importPrice: 755000,
    retailPrice: 870000,
    cell500: 777777,
    cell300: 777777,
    cell100: 777777,
    spaPrice: 777777,
    price: 771999,
  },
  {
    id: 123458,
    code: 'V12PRMTRDE',
    productsName: 'Vỏ 12PRM 5G Trắng - Đẹp',
    invetoryQuantity: 26,
    importPrice: 755000,
    retailPrice: 870000,
    cell500: 777777,
    cell300: 777777,
    cell100: 777777,
    spaPrice: 777777,
    price: 771999,
  },
  {
    id: 123459,
    code: 'V12PRMTRDE',
    productsName: 'Vỏ 12PRM 5G Trắng - Đẹp',
    invetoryQuantity: 26,
    importPrice: 755000,
    retailPrice: 870000,
    cell500: 777777,
    cell300: 777777,
    cell100: 777777,
    spaPrice: 777777,
    price: 771999,
  },
  {
    id: 123461,
    code: 'V12PRMTRDE',
    productsName: 'Vỏ 12PRM 5G Trắng - Đẹp',
    invetoryQuantity: 26,
    importPrice: 755000,
    retailPrice: 870000,
    cell500: 777777,
    cell300: 777777,
    cell100: 777777,
    spaPrice: 777777,
    price: 771999,
  },
];

const Table = () => {
  const [, refetch] = useRefresh();
  const [banners] = useState<ISettingPriceProduct[]>(DATA);
  const [loading] = useState<boolean>(false);
  const [total] = useState<number>(banners.length || 0);
  const filtersRef = useRef<FiltersRef>(null);
  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();
  const [, setEditRowId] = useState<number | null>(null);
  const [openEditNote, setEditNote] = useState<boolean>(false);
  const [openImportProduct, setOpenImportProduct] = useState<boolean>(false);
  const [value, setValue] = useState<number>(0);
  const [value2, setValue2] = useState<number>(0);


  const handleCloseImportProduct = () => {
    setOpenImportProduct(false);
  };

  const handleResetFilters = () => {
    filtersRef.current?.reset();
  };

  const handleSubmitFilters = () => {
    filtersRef.current?.submit();
  };

  const handleEditPrice = useCallback((rowId: number) => {
    setEditNote(true);
    setEditRowId(rowId);
  }, []);

  const handleOpenImportProduct = useCallback((rowId: number) => {
    setOpenImportProduct(true);
  }, []);

  const handleCloseEditNote = () => {
    setEditNote(false);
    setEditRowId(null);
  };

  // const confirmChangeSubmit = (value: any) => {

  //   console.log('value', value);

  // };

  const confirmEditNote = (price: number) => { };

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
    handleEditPrice,
  });

  return (
    <>
      <ProTable<ISettingPriceProduct>
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
          <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
            <CreateCustomerButton handleOpenImportProduct={handleOpenImportProduct} />
            <ActionButtonComponent />
          </Box>
        }
      />
      <ImportProductToPriceList
        open={openImportProduct}
        onClose={handleCloseImportProduct}
        // confirmChange={confirmChangeSubmit}
        value={value2}
      />
      <EditPrice
        open={openEditNote}
        onClose={handleCloseEditNote}
        confirmChange={confirmEditNote}
        value={value}
      />
    </>
  );
};

export default Table;
