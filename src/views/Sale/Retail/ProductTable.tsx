import LinkButton from 'components/LinkButton';
import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useDialog from 'hooks/useDialog';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { FiltersRef } from 'types/refs';
import { IRetail } from 'types/retail';
import AttackSelectedBillDialog from './Dialog/AttackSelectedBillDialog';
import CreateBillDialog from './Dialog/CreateBillDialog';
import EditNoteDialog from './Dialog/EditNoteDialog';
import InfoDialog from './Dialog/Infomation';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import useNotification from 'hooks/useNotification';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import { isEmpty } from 'lodash';
import {
  getListBillCustomer,
  searchBillCustomer,
} from 'slices/billCustomerApplicationSlice';
import ProTableWithSubCell from 'components/ProTable/ProTableWithSubCell';
import { TableRef } from 'components/ProTable/types/refs';
import { APIDeleteBillCustomerById } from 'services/billCustomerApplication';

interface TableCreateProducts {
  [key: string]: any;
}
const DATA = [
  {
    creator: 'Hòa SG 11:47 02/02',
    idBill: 1,
    store: 'Linh kiện sài gòn',
    customer: 'Táo Đen-Cmt8 (SG)',
    status: 'Trạng thái 1',
    productName: '',
    quantity: '',
    productId: '1232131',
    product: [
      {
        productName:
          'Vỏ 14PRM 5G trắng đẹp 1 Vỏ 14PRM 5G trắng đẹp 1 Vỏ 14PRM 5G trắng đẹp 1',
        priceProduct: 20000,
        quantity: 10,
        stock: 1,
        id: '1.1',
        productId: '0',
      },
      {
        productName: 'Vỏ 14PRM 5G trắng đẹp 1',
        priceProduct: 20000,
        quantity: 10,
        stock: 1,
        id: '1.2',
        productId: '1232131',
      },
    ],
    priceProduct: '0',
    stock: 1,
    amount: 1,
    unit: 'Chiếc',
    vat: 1,
    discount: 11,
    totalPrice: 111,
    payment: 111,
    note: 'string;',
    id: '12-321312',
  },
  {
    creator: 'HDJKSAHDSKJA',
    idBill: 2,
    store: 'Linh kiện sài gòn',
    customer: 'Táo Đen-Cmt8 (SG)',
    status: 'Trạng thái 1',
    productName: '',
    quantity: '',
    productId: '321311',
    product: [
      {
        productName:
          'Vỏ 14PRM 5G trắng đẹp 1 Vỏ 14PRM 5G trắng đẹp 1 Vỏ 14PRM 5G trắng đẹp 1',
        priceProduct: 20000,
        quantity: 10,
        stock: 1,
        id: '2.1',
        productId: '0',
      },
      {
        productName: 'Vỏ 14PRM 5G trắng đẹp 1',
        priceProduct: 20000,
        quantity: 10,
        stock: 1,
        id: '2.2',
        productId: '1232131',
      },
    ],
    priceProduct: '0',
    stock: 1,
    amount: 1,
    unit: 'Chiếc',
    vat: 1,
    discount: 11,
    totalPrice: 111,
    payment: 111,
    note: 'string;',
    id: '3232',
  },
];

const ProductTable = () => {
  const { t } = useTranslation();
  const [refresh, refetch] = useRefresh();
  const setNotification = useNotification();
  const dispatch = useDispatch<AppDispatch>();
  const ListBillCustomer = useSelector(getListBillCustomer);
  const [idBillSelect, setIdBillSelect] = useState('');
  const tableRef = useRef<TableRef>(null);
  const [banners] = useState<any[]>(DATA);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const filtersRef = useRef<FiltersRef>(null);
  const [isOpenDialogInfo, setOpenDialogInfo] = useState<boolean>(false);
  const [isOpenDialogEditNote, setOpenDialogEditNote] =
    useState<boolean>(false);
  const [dataSelected, setDataSelected] = useState<any>({});
  const [isOpenCreateBillDialog, setOpenCreateBillDialog] =
    useState<boolean>(false);
  const [isOpenAttackSelectedBillDialog, setOpenAttackSelectedBillDialog] =
    useState<boolean>(false);
  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();
  const dialog = useDialog();

  const handleResetFilters = () => {
    filtersRef.current?.reset();
  };

  const handleSubmitFilters = () => {
    filtersRef.current?.submit();
  };
  const handleOpenDialog = (value: any) => {
    setIdBillSelect(value?.row?.original?.billCustomerId);
    setDataSelected(value?.row?.original ?? {});
    setOpenDialogInfo(!isOpenDialogInfo);
  };

  const handleOpenEditNoteDialog = (value: any) => {
    setDataSelected(value?.row?.original ?? {});
    setOpenDialogEditNote(!isOpenDialogEditNote);
  };

  const handleRemoveRow = useCallback(
    (rowIndex: number, rowId: string) => async () => {
      try {
        const response : any = await APIDeleteBillCustomerById(rowId);
        console.log(response);
        
        if(response.httpStatusCode === 200){
          setNotification({
            message: response.message,
            severity: 'success',
          });
  
        }else{
          setNotification({
            error: 'Xóa hóa đơn bán hàng thất bại',
          });
        }
      
        tableRef.current?.stopRowEditMode(rowId);
        refetch();
      } catch (error) {
        // Logger.log(error);
      }
    },
    [refetch, setNotification]
  );

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
    handleOpenDialog,
    handleOpenEditNoteDialog,
    onDelete: handleRemoveRow,
  });

  const handleDeleteRow = () => {
    dialog({
      headline: 'Xác nhận',
      supportingText: (
        <Fragment>
          Bạn muốn xóa các phiếu xuất nhập kho:
          <strong>9589804</strong>
        </Fragment>
      ),
      onConfirm: async () => {},
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const body = {
        iMei: !isEmpty(filters.iMei) ? filters.iMei : null,
        employeeTech: !isEmpty(filters.employeeTech)
          ? filters.employeeTech
          : null,
        description: !isEmpty(filters.description) ? filters.description : null,
        employeeSell: !isEmpty(filters.employeeSell)
          ? filters.employeeSell
          : null,
        productCategory: !isEmpty(filters.productCategory)
          ? filters.productCategory
          : null,
        couponCode: !isEmpty(filters.couponCode) ? filters.couponCode : null,
        employeeCashier: !isEmpty(filters.employeeCashier)
          ? filters.employeeCashier
          : null,
        productName: !isEmpty(filters.productName) ? filters.productName : null,
        customerName: !isEmpty(filters.customerName)
          ? filters.customerName
          : null,
        createTimeTo: !isEmpty(filters.createTimeTo)
          ? filters.createTimeTo
          : null,
        createTimeFrom: !isEmpty(filters.createTimeFrom)
          ? filters.createTimeFrom
          : null,
        billCustomerCode: !isEmpty(filters.billCustomerCode)
          ? filters.billCustomerCode
          : null,
        ...filters,
      };
      // log
      const response: any = await dispatch(searchBillCustomer(body));
      if (response) {
        setTotal(response.payload.objCount.total);
      }

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
  }, [filters, refresh]);

  return (
    <>
      <ProTableWithSubCell<any>
        title="Danh sách"
        loading={loading}
        columns={columns}
        data={ListBillCustomer}
        ref={tableRef}
        refetch={refetch}
        onSortingChange={onSortingChange}
        getSubRows={(row) => row.billCustomerProducts}
        getRowId={(row) => row.id}
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
              to="/sales/retail/create/0"
              variant="contained"
              type="create"
              color="success"
            >
              {t('Thêm mới')}
            </LinkButton>
            <ProMenu
              position="right"
              items={[
                {
                  label: 'Xuất Excel',
                  value: 2,
                  actionType: 'excel',
                },
                { type: 'divider' },
                {
                  label: 'Xóa các dòng được chọn',
                  value: 3,
                  actionType: 'delete',
                  color: 'error.main',
                  onSelect: handleDeleteRow,
                },
              ]}
            >
              <ActionButton iconPosition="end" actionType="expand" color="info">
                {t('Thao tác')}
              </ActionButton>
            </ProMenu>
            <LinkButton
              to="/sales/return"
              variant="contained"
              type="create"
              color="error"
            >
              {t('Trả hàng')}
            </LinkButton>
          </Fragment>
        }
      />
      <InfoDialog
        open={isOpenDialogInfo}
        idBill={idBillSelect}
        onClose={() => {
          setOpenDialogInfo(false);
          setDataSelected({});
        }}
        dataSelected={dataSelected}
      />
      <CreateBillDialog
        open={isOpenCreateBillDialog}
        onClose={() => {
          setOpenCreateBillDialog(!isOpenCreateBillDialog);
        }}
      />
      <AttackSelectedBillDialog
        open={isOpenAttackSelectedBillDialog}
        onClose={() => {
          setOpenAttackSelectedBillDialog(!isOpenAttackSelectedBillDialog);
        }}
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
