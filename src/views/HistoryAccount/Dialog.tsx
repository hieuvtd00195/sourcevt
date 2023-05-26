import CloseIcon from '@mui/icons-material/Close';
import { Box, Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import DialogContainer from 'components/ProDialog/DialogContainer';
import DialogContent from 'components/ProDialog/DialogContent';
import DialogFooter from 'components/ProDialog/DialogFooter';
import DialogHeader from 'components/ProDialog/DialogHeader';
import useNotification from 'hooks/useNotification';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getWarehousingBillLogById,
  getWarehousingBillLogsById,
} from 'slices/warehousingBillLogsAppication';
import { AppDispatch } from 'store';
import { DialogRef } from 'types/refs';
import { IHistory, IHistoryDetail, Products } from './utils/types';
import DateTime from 'utils/DateTime';

interface Props {
  dataSelect: IHistory;
}

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#ccc',
//   padding: theme.spacing(0.3, 5),
//   //   textAlign: 'center',
//   color: theme.palette.text.primary,
// }));

const Dialog = forwardRef<DialogRef, Props>((props, ref) => {
  const { dataSelect } = props;
  const dispatch = useDispatch<AppDispatch>();
  const setNotification = useNotification();

  const warehousingBillLogsById = useSelector(getWarehousingBillLogsById);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataHistory, setDataHistory] = useState<IHistoryDetail>({
    fromValue: {},
    toValue: {},
  });

  const fetchData = async () => {
    if (!dataSelect.id) {
      return;
    }
    try {
      setLoading(true);
      const response = await dispatch(
        getWarehousingBillLogById({ id: dataSelect?.id })
      );
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
  }, [dataSelect]);

  useEffect(() => {
    if (!warehousingBillLogsById) {
      return;
    }
    const toValue = warehousingBillLogsById?.toValue ?? '{}';
    const fromValue = warehousingBillLogsById?.fromValue ?? '{}';

    // data clone
    const jsonToValue = JSON.parse(toValue);
    const jsonFromValue = JSON.parse(fromValue);

    setDataHistory({
      toValue: { ...jsonToValue },
      fromValue: { ...jsonFromValue },
    });
  }, [warehousingBillLogsById]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  useImperativeHandle(ref, () => ({
    close: () => {},
    open: handleOpen,
  }));

  return (
    <DialogContainer maxWidth="xl" open={open} fullWidth={true}>
      <DialogHeader title={'Chi Tiết Log'} sx={{ alignItems: 'flex-start' }} />
      <DialogContent>
        <BoxTable>
          <table>
            <tr>
              <th style={{ width: '16%' }}>Nội dung</th>
              <th>Trước</th>
              <th>Sau</th>
            </tr>
            <tr>
              <td className="title-child">Danh sách sản phẩm</td>
              <td className="table-child">
                <table>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>SL</th>
                    <th>Giá</th>
                    <th>CK</th>
                    <th>VAT</th>
                    <th>Mô tả</th>
                  </tr>
                  {dataHistory &&
                    dataHistory.fromValue &&
                    dataHistory.fromValue.Products &&
                    dataHistory.fromValue.Products.length > 0 &&
                    dataHistory.fromValue.Products.map((item: Products) => {
                      return (
                        <tr key={item.ProductId}>
                          <td>{item.ProductName}</td>
                          <td>{item.Quantity}</td>
                          <td>{item.Price}</td>
                          <td>{item.DiscountAmount}</td>
                          <td>{`${item?.VatAmount ?? ''} ${
                            item.VatAmount &&
                            item.VatType &&
                            item.VatAmount === 1
                              ? 'VND'
                              : item.VatAmount &&
                                item.VatType &&
                                item.VatAmount === 0
                              ? '%'
                              : ''
                          }`}</td>
                          <td>{item.Note}</td>
                        </tr>
                      );
                    })}
                </table>
              </td>
              <td className="table-child">
                <table>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>SL</th>
                    <th>Giá</th>
                    <th>CK</th>
                    <th>VAT</th>
                    <th>Mô tả</th>
                  </tr>
                  {dataHistory &&
                    dataHistory.toValue &&
                    dataHistory.toValue.Products &&
                    dataHistory.toValue.Products.length > 0 &&
                    dataHistory.toValue.Products.map((item: Products) => {
                      return (
                        <tr key={item.ProductId}>
                          <td>{item.ProductName}</td>
                          <td>{item.Quantity}</td>
                          <td>{item.Price}</td>
                          <td>{item.DiscountAmount}</td>
                          <td>{`${item?.VatAmount ?? ''} ${
                            item.VatAmount &&
                            item.VatType &&
                            item.VatAmount === 1
                              ? 'VND'
                              : item.VatAmount &&
                                item.VatType &&
                                item.VatAmount === 0
                              ? '%'
                              : ''
                          }`}</td>
                          <td>{item.Note}</td>
                        </tr>
                      );
                    })}
                </table>
              </td>
            </tr>

            <tr>
              <td className="title-child">Tên đối tượng</td>
              <td>{dataHistory?.fromValue?.AudienceName ?? ''}</td>
              <td>{dataHistory?.toValue?.AudienceName ?? ''}</td>
            </tr>

            <tr>
              <td className="title-child">Số điện thoại đối tượng</td>
              <td>{dataHistory?.fromValue?.AudiencePhone ?? ''}</td>
              <td>{dataHistory?.toValue?.AudiencePhone ?? ''}</td>
            </tr>

            <tr>
              <td className="title-child">Ghi chú</td>
              <td>{dataHistory?.fromValue?.Note ?? ''}</td>
              <td>{dataHistory?.toValue?.Note ?? ''}</td>
            </tr>

            <tr>
              <td className="title-child">Chiết khấu</td>
              <td>{dataHistory?.fromValue?.BillDiscountAmount ?? ''}</td>
              <td>{dataHistory?.toValue?.BillDiscountAmount ?? ''}</td>
            </tr>

            <tr>
              <td className="title-child">VAT</td>
              <td>{`${dataHistory.fromValue.VATAmount ?? ''} ${
                dataHistory.fromValue.VATAmount &&
                dataHistory.fromValue.VATType &&
                dataHistory.fromValue.VATType === 1
                  ? 'VND'
                  : dataHistory.fromValue.VATAmount &&
                    dataHistory.fromValue.VATType &&
                    dataHistory.fromValue.VATType === 0
                  ? '%'
                  : ''
              }`}</td>
              <td>{`${dataHistory.toValue.VATAmount ?? ''} ${
                dataHistory.toValue.VATAmount &&
                dataHistory.toValue.VATType &&
                dataHistory.toValue.VATType === 1
                  ? 'VND'
                  : dataHistory.toValue.VATAmount &&
                    dataHistory.toValue.VATType &&
                    dataHistory.toValue.VATType === 0
                  ? '%'
                  : ''
              }`}</td>
            </tr>

            <tr>
              <td className="title-child">Số hóa đơn VAT</td>
              <td>{dataHistory?.fromValue?.VATBillCode}</td>
              <td>{dataHistory?.toValue?.VATBillCode}</td>
            </tr>

            <tr>
              <td className="title-child">Ngày xuất VAT</td>
              <td>
                {DateTime.Format(
                  dataHistory?.fromValue?.VATBillDate,
                  'DD-MM-YYYY'
                )}
              </td>
              <td>
                {DateTime.Format(
                  dataHistory?.toValue?.VATBillDate,
                  'DD-MM-YYYY'
                )}
              </td>
            </tr>

            <tr>
              <td className="title-child">ID tài khoản chuyển khoản</td>
              <td>{dataHistory?.fromValue?.BankPaymentAccountCode ?? ''}</td>
              <td>{dataHistory?.toValue?.BankPaymentAccountCode ?? ''}</td>
            </tr>
            <tr>
              <td className="title-child">Số tiền chuyển khoản</td>
              <td>{dataHistory?.fromValue?.BankPaymentAmount ?? ''}</td>
              <td>{dataHistory?.toValue?.BankPaymentAmount ?? ''}</td>
            </tr>

            <tr>
              <td className="title-child">ID tài khoản tiền mặt</td>
              <td>{dataHistory?.fromValue?.CashPaymentAccountCode ?? ''}</td>
              <td>{dataHistory?.toValue?.CashPaymentAccountCode ?? ''}</td>
            </tr>
            <tr>
              <td className="title-child">Số tiền mặt</td>
              <td>{dataHistory?.fromValue?.CashPaymentAmount ?? ''}</td>
              <td>{dataHistory?.toValue?.CashPaymentAmount ?? ''}</td>
            </tr>

            <tr>
              <td className="title-child">ID tài khoản quẹt thẻ</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td className="title-child">Số tiền quẹt thẻ</td>
              <td></td>
              <td></td>
            </tr>

            <tr>
              <td className="title-child">ID NV bán hàng</td>
              <td>{dataHistory?.fromValue?.SalerId ?? ''}</td>
              <td>{dataHistory?.toValue?.SalerId ?? ''}</td>
            </tr>
          </table>
        </BoxTable>
      </DialogContent>
      <DialogFooter>
        <Button
          variant="outlined"
          startIcon={<CloseIcon />}
          onClick={handleClose}
        >
          {'Hủy bỏ'}
        </Button>
      </DialogFooter>
    </DialogContainer>
  );
});

export default Dialog;

const BoxTable = styled(Box)`
  table {
    width: 100%;
  }

  table,
  th,
  td {
    border: 1px solid rgba(217, 217, 217, 0.5);
    border-collapse: collapse;
  }

  th {
    background: #ececec;
  }

  td {
    text-align: center;
  }

  .table-child {
    padding: 4px;
    /* display: flex; */
  }

  .title-child {
    font-weight: 500;
  }

  .row-total,
  .title-child {
    text-align: left;
    padding: 4px 0 4px 12px;
  }
`;
