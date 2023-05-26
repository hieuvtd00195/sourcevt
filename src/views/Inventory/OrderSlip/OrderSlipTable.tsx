import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import ProTable from 'components/ProTable';
import ProTableCell from 'components/ProTable/ProTableCell';
import useNotification from 'hooks/useNotification';
import useRefresh from 'hooks/useRefresh';
import { isEmpty } from 'lodash';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  CompleteSaleOrderByIdApi,
  deleteSaleOrder,
  getListSaleOrderApi,
  getSaleOrderList,
  getSaleOrderListTotal,
} from 'slices/saleOrder';
import { getListStoreApplication } from 'slices/storeApplication';
import { AppDispatch } from 'store';
import type { FiltersRef } from 'types/refs';
import { SaleOrder } from 'types/saleorder';
import ConfirmDialog from './components/ConfirmDialog';
import EditNote from './components/EditNote';
import FiltersForm from './components/FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import ProMenu from 'components/ProMenu';
import ActionButton from 'components/ProButton/ActionButton';
import { postCreateOrderTransport } from 'slices/orderTransport';
import FormConfirmOrderSlip from './ConfirmOrderSlip';
import Numeral from 'utils/Numeral';
import { APIExportSaleOrder } from 'services/saleOrder';
import DownloadFile from 'utils/downloadFiles';
import Logger from 'utils/Logger';

const OrderSlipTable = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [, refetch] = useRefresh();
  const filtersRef = useRef<FiltersRef>(null);
  const dispatch = useDispatch<AppDispatch>();
  const setNotification = useNotification();
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<SaleOrder[]>([]);
  const [value, setValue] = useState<string>('');
  const [total, setTotal] = useState<number>(0);
  const [openEditNote, setEditNote] = useState<boolean>(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [rowIds, setRowIds] = useState<number[]>([]);
  const [openFormConfirm, setOpenFormConfirm] = useState<boolean>(false);
  const [idConfirm, setIdConFirm] = useState<any>('');

  const saleOrderList = useSelector(getSaleOrderList);
  const totalSaleOrderList = useSelector(getSaleOrderListTotal);

  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();
  const [, setEditRowId] = useState<number | null>(null);

  const handleResetFilters = () => {
    filtersRef.current?.reset();
  };

  const confirmEditNote = (price: string) => {};

  const handleCloseEditNote = () => {
    setEditNote(false);
    setEditRowId(null);
  };

  const handleSubmitFilters = () => {
    filtersRef.current?.submit();
  };
  const handleOpenFormConfirm = (id: any) => {
    setIdConFirm(id);
    setOpenFormConfirm(true);
  };
  const handleCloseFormConfirm = () => {
    setOpenFormConfirm(false);
    fetchData();
  };
  const handleEditNote = useCallback((rowId: number, note: string) => {
    setEditNote(true);
    setEditRowId(rowId);
    setValue(note);
  }, []);
  const handleDelete = async (id: string) => {
    try {
      const res = await dispatch(deleteSaleOrder(id));      
      if (!res.payload) {
        setNotification({
          message: 'Xóa đơn hàng NCC TQ Thành công',
          severity: 'success',
        });
        fetchData();
      } else {
        setNotification({
          error:
            'Không cho phép xóa với đơn hàng đã hoàn thành hoặc số lượng nhập > 0 ',
        });
      }
    } catch {
      setNotification({
        error: 'Lỗi khi xóa đơn hàng NCC TQ',
      });
    }

    // .then(() => {
    //   setNotification({
    //     message: 'Xóa đơn hàng NCC TQ Thành công',
    //     severity: 'success',
    //   });
    //   fetchData();
    // })
    // .catch(() =>
    //   setNotification({
    //     error: 'Lỗi khi xóa đơn hàng NCC TQ',
    //   })
    // );
  };

  const [searchParams] = useSearchParams();
  const codeQueryURL = searchParams.get('code') || null;
  const supplierNameQueryURL = searchParams.get('supplierName') || null;

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getListSaleOrderApi(filters));
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
  const handleExportExcel = async () => {
    if (!total) {
      setNotification({
        error: 'Không có dữ liệu để xuất file Excel',
      });

      return;
    }

    try {
      const res = await APIExportSaleOrder(filters);
      const { headers, data } = res;
      DownloadFile.getDownloadBinaryFile(data, headers);
      if (!data) {
        setNotification({
          error: 'Đã xảy ra lỗi, vui lòng thử lại sau',
        });

        return;
      }
      // const { base64Data, fileName, fileType } = data;
      // downloadBase64File(base64Data, fileName, fileType);
    } catch (error) {
      Logger.log(error);
    }
  };
  const handleComplete = async (id: string) => {
    try {
      setLoading(true);
      const response = await dispatch(CompleteSaleOrderByIdApi(id));
      if (response.payload === true) {
        setNotification({
          message: 'Hoàn thành phiếu đặt hàng thành công',
          severity: 'success',
        });
      } else {
        setNotification({
          error: 'Lỗi khi hoàn thành phiếu đặt hàng!',
        });
      }
    } catch (error) {
      setNotification({
        error: 'Lỗi khi hoàn thành phiếu đặt hàng!',
      });
    } finally {
      setLoading(false);
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, refetch]);

  useEffect(() => {
    setProducts(saleOrderList);
    setTotal(totalSaleOrderList);
  }, [saleOrderList]);

  const handleRowSelection = (rowIds: string[]) => {
    setRowIds(rowIds.map(Number));
  };

  const handleAddOrderTransport = () => {
    if (rowIds.length === 0) {
      setNotification({
        error: 'Vui lòng chọn ít nhất 1 phiếu đặt hàng để tạo đơn vận chuyển',
      });
      return;
    }

    let arrIds: any[] = [];
    rowIds.forEach((item) => {
      arrIds.push(products[item].id ?? null);
    });
    const params = arrIds;

    dispatch(postCreateOrderTransport(params))
      .unwrap()
      .then(() => {
        setNotification({
          message: 'Tạo mới đơn vận chuyển thành công',
          severity: 'success',
        });
        navigate('/inventory/order-slip?value=filter2');
      })
      .catch((error) => {
        setNotification({
          error: 'Lỗi khi tạo mới đơn vận chuyển!',
        });
      })
      .finally(() => {});
    return;
  };
  const { columns } = useTableColumns({
    pageNumber: filters.pageIndex,
    pageSize: filters.pageSize,
    handleConfirm: () => setOpenConfirmDialog(true),
    handleEditNote,
    handleDelete,
    handleOpenFormConfirm,
    handleComplete,
  });

  const totalSLSP = () => {
    let totalSLSP = 0;
    products.map((item) => {
      totalSLSP += item.totalProduct;
    });
    return Numeral.price(totalSLSP);
  };
  const totalSL = () => {
    let totalSL = 0;
    products.map((item) => {
      totalSL += item.totalQuantity;
    });
    return Numeral.price(totalSL);
  };

  const totalTT = () => {
    let totalTT = 0;
    products.map((item) => {
      totalTT += item.totalPriceNDT;
    });
    return Numeral.price(totalTT);
  };
  const totalPrice = () => {
    let totalPr = 0;
    products.map((item) => {
      totalPr += item.totalPrice;
    });
    return Numeral.price(totalPr);
  };
  return (
    <>
      <ProTable<any>
        title="Danh sách sản phẩm"
        loading={loading}
        columns={columns}
        data={products}
        refetch={refetch}
        onSortingChange={onSortingChange}
        onRowSelectionChange={handleRowSelection}
        pagination={{
          page: filters.pageIndex,
          total,
          pageSize: filters.pageSize,
          onPageChange,
          onPageSizeChange,
        }}
        initialstate={{ hiddenVisibilityColumns: true, hiddenColumns: [] }}
        filter={
          <FiltersForm
            ref={filtersRef}
            onSearch={onSearch}
            onSubmit={handleSubmitFilters}
            onClear={handleResetFilters}
            codeQueryURL={codeQueryURL}
            supplierNameQueryURL={supplierNameQueryURL}
          />
        }
        toolBar={
          <Fragment>
            <Button onClick={() => navigate('add')}>
              <AddIcon /> {t('Thêm mới')}
            </Button>
            <Button variant="outlined" onClick={handleExportExcel}>
              <DownloadIcon /> {t('Xuất file')}
            </Button>
            <ProMenu
              items={[
                {
                  label: 'Thêm mới đơn vận chuyển',
                  value: 1,
                  onSelect: handleAddOrderTransport,
                  actionType: 'add',
                },
              ]}
            >
              <ActionButton iconPosition="end" actionType="expand" color="info">
                {t('Thao tác')}
              </ActionButton>
            </ProMenu>
          </Fragment>
        }
        totalRow={
          <>
            {!isEmpty(products) && (
              <TableRow hover>
                <ProTableCell offset={0}></ProTableCell>
                <ProTableCell offset={0}></ProTableCell>
                <ProTableCell offset={0}></ProTableCell>
                <ProTableCell offset={0} align="center">
                  <Typography fontWeight="bold">Tổng</Typography>
                </ProTableCell>
                <ProTableCell offset={0}></ProTableCell>

                <ProTableCell offset={0}></ProTableCell>
                <ProTableCell offset={0} align="center">
                  <Typography fontWeight="bold">{totalSLSP()}</Typography>
                </ProTableCell>
                <ProTableCell offset={0} align="center">
                  <Typography fontWeight="bold">{totalSL()}</Typography>
                </ProTableCell>
                <ProTableCell offset={0} align="center">
                  <Typography fontWeight="bold">{totalTT()}</Typography>
                </ProTableCell>
                <ProTableCell offset={0} align="center">
                  <Typography fontWeight="bold">{totalPrice()}</Typography>
                </ProTableCell>
                <ProTableCell offset={0}></ProTableCell>
                <ProTableCell offset={0}></ProTableCell>
                <ProTableCell offset={0}></ProTableCell>
                <ProTableCell offset={0}></ProTableCell>
              </TableRow>
            )}
          </>
        }
      />
      <ConfirmDialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      />
      <EditNote
        open={openEditNote}
        onClose={handleCloseEditNote}
        confirmChange={confirmEditNote}
        value={value}
      />
      <FormConfirmOrderSlip
        open={openFormConfirm}
        handleClose={handleCloseFormConfirm}
        idConfirm={idConfirm}
      />
    </>
  );
};

export default OrderSlipTable;
