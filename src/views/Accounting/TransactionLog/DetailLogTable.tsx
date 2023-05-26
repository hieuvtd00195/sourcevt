import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import DialogContainer from 'components/ProDialog/DialogContainer';
import DialogHeader from 'components/ProDialog/DialogHeader';
import DialogContent from 'components/ProDialog/DialogContent';
import { Box, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styled from '@emotion/styled';
import { DialogRef } from 'types/refs';
import { IHistory } from 'views/HistoryAccount/utils/types';
import DialogFooter from 'components/ProDialog/DialogFooter';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import useNotification from 'hooks/useNotification';
import { getEntryLogDetailApi, getEntryLogDetailList } from 'slices/entry';
import Numeral from 'utils/Numeral';

interface Props {
  dataSelect: IHistory;
}

const DetailLogTable = forwardRef<DialogRef, Props>((props, ref) => {
  const { dataSelect } = props;
  const dispatch = useDispatch<AppDispatch>();
  const setNotification = useNotification();

  const [loading, setLoading] = useState<boolean>(false);

  const listEntryLogDetail = useSelector(getEntryLogDetailList);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const [dataHistory, setDataHistory] = useState<any>({
    fromValue: {},
    toValue: {},
  });

  useEffect(() => {
    if (!listEntryLogDetail) {
      return;
    }
    const toValue = listEntryLogDetail?.toValue ?? '{}';
    const fromValue = listEntryLogDetail?.fromValue ?? '{}';

    // data clone
    const jsonToValue = JSON.parse(toValue);
    const jsonFromValue = JSON.parse(fromValue);

    setDataHistory({
      toValue: { ...jsonToValue },
      fromValue: { ...jsonFromValue },
    });
  }, [listEntryLogDetail]);

  const fetchData = async () => {
    if (!dataSelect.id) {
      return;
    }
    try {
      setLoading(true);

      const response = await dispatch(
        getEntryLogDetailApi(dataSelect?.id)
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
  }, [dataSelect])

  const handleClose = () => {
    setOpen(false);
  };
  useImperativeHandle(ref, () => ({
    close: handleClose,
    open: handleOpen,
  }));
  return (
    <DialogContainer maxWidth="xl" open={open} fullWidth={true}>
      <DialogHeader title={'Chi tiết lịch sử'} sx={{ alignItems: 'flex-start' }} />
      <DialogContent>
        <BoxTable>
          <table>
            <tr>
              <th style={{ width: '16%' }}>Nội dung</th>
              <th>Trước</th>
              <th>Sau</th>
            </tr>
            <tr>
              <td className="title-child">Tài khoản bút toán</td>
              <td className="table-child">
                <table>
                  <tr>
                    <th>NDT</th>
                    <th>VND</th>
                    <th>Ghi có</th>
                    <th>Ghi nợ</th>
                    <th>Ghi chú</th>
                  </tr>
                  {
                    dataHistory?.fromValue?.Accounts?.length > 0 &&
                    dataHistory.fromValue.Accounts.map((item: any) => {
                      return (
                        <tr>
                          <td>{Numeral.price(item.AmountCny)}</td>
                          <td>{Numeral.price(item.AmountVnd)}</td>
                          <td>{item.CreditAccountCode}</td>
                          <td>{item.DebtAccountCode}</td>
                          <td>{item.Note}</td>
                        </tr>
                      );
                    })}
                </table>
              </td>
              <td className="table-child">
                <table>
                  <tr>
                    <th>NDT</th>
                    <th>VND</th>
                    <th>Ghi có</th>
                    <th>Ghi nợ</th>
                    <th>Ghi chú</th>
                  </tr>
                  {
                    dataHistory?.toValue?.Accounts?.length > 0 &&
                    dataHistory.toValue.Accounts.map((item: any) => {
                      return (
                        <tr>
                          <td>{Numeral.price(item.AmountCny)}</td>
                          <td>{Numeral.price(item.AmountVnd)}</td>
                          <td>{item.CreditAccountCode}</td>
                          <td>{item.DebtAccountCode}</td>
                          <td>{item.Note}</td>
                        </tr>
                      );
                    })}
                </table>
              </td>
            </tr>
          </table>
        </BoxTable>
        <DialogFooter>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={handleClose}
          >
            {'Hủy bỏ'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogContainer>
  )
});

export default DetailLogTable;

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
