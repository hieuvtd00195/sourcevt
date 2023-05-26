import { yupResolver } from '@hookform/resolvers/yup';
import DownloadIcon from '@mui/icons-material/Download';
import { LoadingButton } from '@mui/lab';
import { Typography } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import ActionButton from 'components/ProButton/ActionButton';
import ProTable from 'components/ProTable';
import ProTableCell from 'components/ProTable/ProTableCell';
import useNotification from 'hooks/useNotification';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { APIExportSaleOrderLine } from 'services/saleOrderLine';
import {
  getListSaleOrderLine,
  getSaleOrderLineList,
  getSaleOrderLineTotal,
  updatePriceSaleOrderLine,
} from 'slices/saleOrderLine';
import { AppDispatch } from 'store';
import type { FiltersRef } from 'types/refs';
import Logger from 'utils/Logger';
import Numeral from 'utils/Numeral';
import * as yup from 'yup';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import EditPrice from './components/EditPrice';
import useFilters from './utils/filters';
import type { Product } from './utils/types';

interface ITotalQuantity {
  totalImportQuantity: number;
  totalRequestQuantity: number;
}

const validationSchema = yup.object().shape({});

const OrderSlipProducts = () => {
  const { t } = useTranslation();
  const [, refetch] = useRefresh();
  const filtersRef = useRef<FiltersRef>(null);
  const dispatch = useDispatch<AppDispatch>();
  const setNotification = useNotification();

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingExport, setLoadingExport] = useState<boolean>(false);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalYuan, setTotalYuan] = useState<number>(0);
  const [totalSuggestedPrice, setTotalSuggestedPrice] = useState<number>(0);

  const [value, setValue] = useState<string | null>(null);
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [openEditNote, setEditNote] = useState<boolean>(false);
  const [loadingBTN, setLoadingBTN] = useState<boolean>(false);

  const saleOrderLineList = useSelector(getSaleOrderLineList);
  const saleOrderLineTotal = useSelector(getSaleOrderLineTotal);

  const form = useForm<any>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const { filters, onSortingChange, onPageChange, onPageSizeChange, onSearch } =
    useFilters();

  const handleResetFilters = () => {
    filtersRef.current?.reset();
  };

  const handleSubmitFilters = () => {
    filtersRef.current?.submit();
  };

  const handleEditPrice = useCallback((rowId: string, value: string) => {
    setEditNote(true);
    setEditRowId(rowId);
    setValue(value);
  }, []);

  const { columns } = useTableColumns({
    pageIndex: filters.pageIndex,
    pageSize: filters.pageSize,
    handleEditPrice,
  });

  const handleCloseEditPrice = () => {
    setEditNote(false);
    setEditRowId(null);
    setValue(null);
  };

  const confirmEditPrice = async (price: string | null) => {
    const params = {
      saleOrderLineId: editRowId,
      suggestPrice: parseFloat(price ?? ''),
    };

    setLoadingBTN(true);

    dispatch(updatePriceSaleOrderLine(params))
      .unwrap()
      .then(() => {
        setNotification({
          message: 'Cập nhật giá đề xuất thành công',
          severity: 'success',
        });
      })
      .catch((error) => {
        setNotification({
          error: 'Lỗi khi cập nhật giá đề xuất!',
        });
      })
      .finally(() => {
        setLoadingBTN(false);
        fetchData();
      });
    return;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getListSaleOrderLine(filters));
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

  useEffect(() => {
    setProductsList(
      saleOrderLineList.map((item) => ({
        ...item,
        quantity: {
          importQuantity: item?.importQuantity,
          requestQuantity: item?.requestQuantity,
        },
      }))
    );
    setTotal(saleOrderLineTotal);

    let totalYuan = 0;
    let totalPrice = 0;
    let totalSuggestedPrice = 0;

    saleOrderLineList.forEach((item) => {
      totalYuan += parseFloat(item?.totalYuan);
      totalPrice += parseFloat(item?.totalPrice);
      totalSuggestedPrice += parseFloat(item?.suggestedPrice);
    });

    setTotalPrice(totalPrice);
    setTotalYuan(totalYuan);
    setTotalSuggestedPrice(totalSuggestedPrice);
  }, [saleOrderLineList]);

  const handleExportExcel = async () => {
    setLoadingExport(true);
    try {
      await APIExportSaleOrderLine(filters);
      setLoadingExport(false);
    } catch (error) {
      Logger.log(error);
      setNotification({
        error: 'Lỗi khi xuất dữ liệu!',
      });
      setLoadingExport(false);
    }
  };

  return (
    <>
      <ProTable<any>
        title="Danh sách sản phẩm"
        loading={loading}
        columns={columns}
        data={productsList}
        refetch={refetch}
        onSortingChange={onSortingChange}
        pagination={{
          page: filters.pageIndex,
          total,
          pageSize: filters.pageSize,
          onPageChange,
          onPageSizeChange,
        }}
        initialstate={{
          hiddenVisibilityColumns: true,
          hiddenColumns: [],
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
            <ActionButton variant="text" onClick={filtersRef.current?.reset}>
              Xóa bộ lọc
            </ActionButton>
            <LoadingButton
              loading={loadingExport}
              variant="outlined"
              onClick={handleExportExcel}
            >
              <DownloadIcon /> {t('Xuất file')}
            </LoadingButton>
          </Fragment>
        }
        totalRow={
          <>
            <TableRow hover>
              <ProTableCell offset={0}></ProTableCell>
              <ProTableCell offset={0}></ProTableCell>
              <ProTableCell offset={0}></ProTableCell>
              <ProTableCell offset={0}></ProTableCell>
              <ProTableCell offset={0}></ProTableCell>
              <ProTableCell offset={0}>
                <Typography fontWeight="bold" textAlign={'center'}>
                  Tổng
                </Typography>
              </ProTableCell>
              <ProTableCell offset={0}>
                <Typography fontWeight="bold" textAlign={'center'}>
                  {Numeral.price(totalSuggestedPrice)}
                </Typography>
              </ProTableCell>
              <ProTableCell offset={0}>
                <Typography fontWeight="bold" textAlign={'center'}>
                  {Numeral.price(totalYuan)}
                </Typography>
              </ProTableCell>
              <ProTableCell offset={0}>
                <Typography fontWeight="bold" textAlign={'center'}>
                  {Numeral.price(totalPrice)}
                </Typography>
              </ProTableCell>
              <ProTableCell offset={0}></ProTableCell>
              <ProTableCell offset={0}></ProTableCell>
            </TableRow>
          </>
        }
      />

      <EditPrice
        open={openEditNote}
        onClose={handleCloseEditPrice}
        confirmChange={confirmEditPrice}
        value={value}
        loadingBTN={loadingBTN}
      />
    </>
  );
};

export default OrderSlipProducts;
