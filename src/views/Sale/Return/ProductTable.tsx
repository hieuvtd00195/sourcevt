import LinkButton from 'components/LinkButton';
import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
// import useDialog from 'hooks/useDialog';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { FiltersRef } from 'types/refs';
import EditNoteDialog from './Dialog/EditNoteDialog';

import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import { getListSaleOrderReturn } from 'slices/saleOrderReturn';
import useNotification from 'hooks/useNotification';
import { listOrderReturn } from 'slices/saleOrderReturn';
import { orderReturnTotal } from 'slices/saleOrderReturn';

const DATA = [
  {
    date: 'Hòa SG 11:47 02/02',
    idBill: 1,
    customer: 'Táo Đen-Cmt8 (SG)',
    product: 'Vỏ 12PRM 5G trắng đẹp',
    price: 1,
    amount: 1,
    // vat: 1,
    discount: 11,
    return: 1,
    fee: 1,
    totalPrice: 111,
    note: 'string;',
    id: '1',
  },
  {
    date: 'Hòa SG 11:47 02/02',
    idBill: 1,
    customer: 'Táo Đen-Cmt8 (SG)',
    product: 'Vỏ 12PRM 5G trắng đẹp 1',
    price: 1,
    amount: 1,
    // vat: 1,
    discount: 11,
    return: 1,
    fee: 1,
    totalPrice: 111,
    note: 'string;',
    id: '1',
  },


];

const fakeData = [
  {
    customerId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    storeId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    employeeCare: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    employeeSell: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    isExchange: 0,
    returnAmount: 0,
    payNote: "string",
    discountValue: 0,
    discountUnit: 0,
    accountCode: "string",
    cash: 0,
    accountCodeBanking: "string",
    banking: 0,
    products: [
      {
        code: "string",
        name: "IPHONE 11",
        productId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        customerReturnId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        price: 0,
        quantity: 0,
        discountValue: 0,
        discountUnit: 0
      },
      {
        code: "string",
        name: "IPHONE 14",
        productId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        customerReturnId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        price: 0,
        quantity: 0,
        discountValue: 0,
        discountUnit: 0
      }
    ]
  }
]

const ProductTable = () => {
  const { t } = useTranslation();
  const [, refetch] = useRefresh();
  // const [data, setData] = useState<any[]>(DATA);
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  console.log('total', total);

  const filtersRef = useRef<FiltersRef>(null);
  const [isOpenDialogInfo, setOpenDialogInfo] = useState<boolean>(false);
  const [isOpenDialogEditNote, setOpenDialogEditNote] =
    useState<boolean>(false);
  const [dataSelected, setDataSelected] = useState<any>({});
  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();
  const dispatch = useDispatch<AppDispatch>();
  const setNotification = useNotification();
  const listOrderReturnData: any = useSelector(listOrderReturn);
  const orderReturnTotalData = useSelector(orderReturnTotal);

  // const dialog = useDialog();

  const handleResetFilters = () => {
    filtersRef.current?.reset();
  };

  const handleSubmitFilters = () => {
    filtersRef.current?.submit();
  };
  const handleOpenDialog = (value: any) => {
    setDataSelected(value?.row?.original ?? {});
    setOpenDialogInfo(!isOpenDialogInfo);
  };

  const handleOpenEditNoteDialog = (value: any) => {
    setDataSelected(value?.row?.original ?? {});
    setOpenDialogEditNote(!isOpenDialogEditNote);
  };

  const { columns } = useTableColumns({
    pageIndex: filters.pageIndex,
    pageSize: filters.pageSize,
    handleOpenDialog,
    handleOpenEditNoteDialog,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getListSaleOrderReturn(filters));
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
  };

  useEffect(() => {
    fetchData();
  }, [filters, refetch]);

  console.log('listOrderReturnData', listOrderReturnData);

  console.log('data', data);

  console.log('orderReturnTotalData', orderReturnTotalData);



  useEffect(() => {
    setData(listOrderReturnData.data);
    setTotal(orderReturnTotalData);
  }, [orderReturnTotalData, listOrderReturnData]);


  // const handleDeleteRow = () => {
  //   dialog({
  //     headline: 'Xác nhận',
  //     supportingText: (
  //       <Fragment>
  //         Bạn muốn xóa các phiếu xuất nhập kho:
  //         <strong>9589804</strong>
  //       </Fragment>
  //     ),
  //     onConfirm: async () => {},
  //   });
  // };

  return (
    <>
      <ProTable<any>
        title="Danh sách"
        loading={loading}
        columns={columns}
        data={data}
        refetch={refetch}
        onSortingChange={onSortingChange}
        pagination={{
          page: filters.pageIndex,
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
              to="/sales/return/create"
              variant="contained"
              type="create"
              color="success"
            >
              {t('Trả hàng không cần hóa đơn')}
            </LinkButton>
            <ProMenu
              position="right"
              items={[
                {
                  label: 'Xuất Excel',
                  value: 1,
                  actionType: 'excel',
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
      <EditNoteDialog
        open={isOpenDialogEditNote}
        onClose={() => {
          setOpenDialogEditNote(!isOpenDialogEditNote);
          setDataSelected({});
        }}
        value={dataSelected}
      />
    </>
  );
};

export default ProductTable;
