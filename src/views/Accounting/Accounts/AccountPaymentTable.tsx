import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { FiltersRef } from 'types/refs';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import type { TKKT } from './utils/types';
import Dialog from '@mui/material/Dialog';
import DialogHeader from 'components/ProDialog/DialogHeader';
import DialogForm from 'components/ProDialog/DialogForm';
import DialogContent from 'components/ProDialog/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Grid, TextField } from '@mui/material';
import DialogFooter from 'components/ProDialog/DialogFooter';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import ProFormLabel from 'components/ProForm/ProFormLabel';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import {
  getListMasterDataPaymentAccount,
  getListMasterDataTKKT,
  getMasterDataListTKKT,
} from 'slices/masterData';
import useNotification from 'hooks/useNotification';
import { downloadBase64File } from 'utils/downloadBase64File';
import Logger from 'utils/Logger';
import { APIExportPaymentAccount } from 'services/masterdata';
import DownloadFile from 'utils/downloadFiles';

const AccountTable = () => {
  const { t } = useTranslation();
  const [, refetch] = useRefresh();
  const setNotification = useNotification();
  const ListTKKT = useSelector(getMasterDataListTKKT);
  const dispatch = useDispatch<AppDispatch>();
  const [loading] = useState<boolean>(false);
  const [open, setDialogs] = useState<boolean>(false);
  const [checkReset, setCheckReset] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const filtersRef = useRef<FiltersRef>(null);
  const {
    filters,
    onSortingChange,
    onPageChange,
    onPageSizeChange,
    onSearch,
    onClearFilter,
  } = useFilters();

  const handleResetFilters = () => {
    filtersRef.current?.reset();
  };

  const handleSubmitFilters = () => {
    filtersRef.current?.submit();
  };
  const handleSelect = () => {
    setDialogs(!open);
  };
  const handleReset = () => {
    setDialogs(false);
  };

  const fetchDataStoreApplication = async () => {
    const body = {
      searchText: filters.searchText,
      status: filters.status,
      sortBy: filters.sortBy,
      sortDirection: filters.sortDirection,
      pageIndex: filters.pageNumber,
      pageSize: filters.pageSize,
      accountType: filters.accountType,
      code: filters.code,
    };
    try {
      const response: any = await dispatch(getListMasterDataTKKT(body));
      setTotal(response.payload.total);
    } catch (error) {
    } finally {
    }
  };
  useEffect(() => {
    fetchDataStoreApplication();
  }, [filters]);

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
  });

  const handleExportExcel = async () => {
    if (!total) {
      setNotification({
        error: 'Không có dữ liệu để xuất file Excel',
      });

      return;
    }

    try {
      const res = await APIExportPaymentAccount({
        code: filters.code,
        name: filters.name,
        storeName: filters.storeName,
        accountType: filters.accountType,
      });
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
  const clearFilter = (value: boolean) => {
    setCheckReset(value);
    onClearFilter();
  };

  return (
    <ProTable<any>
      title="Danh sách sản phẩm"
      loading={loading}
      columns={columns}
      data={ListTKKT}
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
          checkReset={checkReset}
        />
      }
      toolBar={
        <Fragment>
          <ActionButton variant="text" onClick={() => clearFilter(!checkReset)}>
            Xóa bộ lọc
          </ActionButton>
          <ActionButton
            onClick={handleSelect}
            iconPosition="end"
            actionType="expand"
            color="success"
          >
            {t('Thêm mới')}
          </ActionButton>

          <ProMenu
            position="right"
            items={[
              {
                label: 'Xuất Excel',
                value: 1,
                actionType: 'excel',
                onSelect: () => handleExportExcel(),
              },
              {
                label: 'Thiết lập tài khoản mặc định',
                value: 2,
                actionType: 'edit',
              },
            ]}
          >
            <ActionButton iconPosition="end" actionType="expand" color="info">
              {t('Thao tác')}
            </ActionButton>
          </ProMenu>
          <Dialog open={open} scroll="body" fullWidth>
            <DialogHeader title={t('Thêm tài khoản kế toán')} />
            <DialogForm>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <ProFormLabel
                      required
                      title={t('Loại tài khoản')}
                      name="name"
                      gutterBottom
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={9}>
                    <TextField
                      placeholder="-Loại tài khoản-"
                      id="outlined-basic"
                      variant="outlined"
                    />{' '}
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <ProFormLabel
                      required
                      title={t('Cửa hàng')}
                      name="name"
                      gutterBottom
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={9}>
                    <TextField
                      placeholder="-Cửa hàng-"
                      id="outlined-basic"
                      variant="outlined"
                    />{' '}
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <ProFormLabel
                      required
                      title={t('Tài khoản cha')}
                      name="name"
                      gutterBottom
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={9}>
                    <TextField id="outlined-basic" variant="outlined" />{' '}
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <ProFormLabel
                      required
                      title={t('Mã tài khoản')}
                      name="name"
                      gutterBottom
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={9}>
                    <TextField id="outlined-basic" variant="outlined" />{' '}
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <ProFormLabel
                      required
                      title={t('Tên')}
                      name="name"
                      gutterBottom
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={9}>
                    <TextField id="outlined-basic" variant="outlined" />{' '}
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <ProFormLabel
                      required
                      title={t('Trạng thái')}
                      name="name"
                      gutterBottom
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={9}>
                    <TextField
                      placeholder="Kích Hoạt"
                      id="outlined-basic"
                      variant="outlined"
                    />{' '}
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogFooter>
                <LoadingButton startIcon={<SaveIcon />} onClick={handleReset}>
                  {t('Lưu')}
                </LoadingButton>
                <Button
                  variant="outlined"
                  startIcon={<CloseIcon />}
                  onClick={handleReset}
                >
                  {t('Đóng')}
                </Button>
              </DialogFooter>
            </DialogForm>
          </Dialog>
        </Fragment>
      }
    />
  );
};

export default AccountTable;
