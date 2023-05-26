import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Typography from '@mui/material/Typography';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import useDialog from 'hooks/useDialog';
import { useMemo } from 'react';
import DateTime from 'utils/DateTime';
import { IHistory } from './utils/types';
import dayjs from 'dayjs';
import { Button, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useNotification from 'hooks/useNotification';

const columnHelper = getColumnHelper<any>();

const HEAD_CELLS: HeadCell<any> = {
  code: 'ID Phiếu XNK',
  actionName: 'Kiểu Log',
  billTypeName: 'Loại XNK',
  documentDetailTypeName: 'Kiểu XNK',
  creationTimeXNK: 'Ngày XNK',
  creationTime: 'Ngày tạo',
  lastModificationTime: 'Thời gian tạo',
  actions: 'Hành động',
};

interface Props {
  pageIndex: number;
  pageSize: number;
  open: (data: any) => void;
}

const useTableColumns = (props: Props) => {
  const { pageIndex, pageSize, open: openDialog } = props;
  const dialog = useDialog();
  const navigate = useNavigate();
  const setNotification = useNotification();

  const columns: ProColumn<any> = useMemo(() => {
    return [
      columnHelper.accessor('code', {
        id: 'code',
        size: 80,
        header: () => 'ID Phiếu XNK',
        cell: (context) => {
          const value = context.getValue();
          const actionCheck = context?.row?.original?.action
            ? parseInt(context?.row?.original?.action)
            : null;
          return (
            <LinkButton
              variant="text"
              onClick={() => {
                if (actionCheck === 2) {
                  setNotification({
                    error: 'Phiếu đã bị xóa',
                  });
                  return;
                }
                navigate(`/inventory?value=filter&code=${value}`);
              }}
            >
              {value}
            </LinkButton>
          );
        },
        meta: {
          title: HEAD_CELLS.code,
        },
      }),
      columnHelper.accessor('actionName', {
        id: 'actionName',
        size: 80,
        header: () => 'Kiểu Log',
        cell: (context) => (
          <Typography variant="subtitle2">{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.actionName,
        },
      }),
      columnHelper.accessor('billTypeName', {
        id: 'billTypeName',
        size: 80,
        header: () => 'Loại XNK',
        cell: (context) => (
          <Typography variant="subtitle2">{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.billTypeName,
        },
      }),
      columnHelper.accessor('documentDetailTypeName', {
        id: 'documentDetailTypeName',
        size: 180,
        header: () => 'Kiểu XNK',
        cell: (context) => (
          <Typography variant="subtitle2">{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.documentDetailTypeName,
        },
      }),
      columnHelper.accessor('creationTimeXNK', {
        id: 'creationTimeXNK',
        size: 120,
        // enableSorting: false,
        header: () => HEAD_CELLS.creationTimeXNK,
        cell: (context) => {
          const value = context.getValue();
          return (
            <Typography variant="subtitle2">
              {DateTime.Format(value, 'DD-MM-YYYY')}
            </Typography>
          );
        },
        meta: {
          title: HEAD_CELLS.creationTimeXNK,
        },
      }),
      columnHelper.accessor('creationTime', {
        id: 'creationTime',
        size: 120,
        // enableSorting: false,
        header: () => HEAD_CELLS.creationTime,
        cell: (context) => {
          const value = context.getValue();
          return (
            <Typography variant="subtitle2">
              {DateTime.Format(value, 'DD-MM-YYYY')}
            </Typography>
          );
        },
        meta: {
          title: HEAD_CELLS.creationTime,
        },
      }),

      columnHelper.accessor('lastModificationTime', {
        id: 'lastModificationTime',
        size: 80,
        // enableSorting: false,
        header: () => HEAD_CELLS.lastModificationTime,
        cell: (context) => {
          const value = context?.row?.original?.creationTime;
          const time = dayjs(value).format('HH:mm:ss');

          return <Typography variant="subtitle2">{time}</Typography>;
        },
        meta: {
          title: HEAD_CELLS.lastModificationTime,
        },
      }),
      {
        id: 'actions',
        size: 50,
        // enableSorting: false,
        header: () => <SettingsOutlinedIcon />,
        cell: (context) => {
          const valCheck = context?.row?.original?.action
            ? parseInt(context?.row?.original?.action)
            : 0;

          return (
            <Typography>
              {' '}
              <ActionIconButton
                onClick={() => openDialog(context.row.original)}
                actionType="view"
                disabled={valCheck && valCheck === 2 ? true : false}
              />
            </Typography>
          );
        },
        meta: {
          title: HEAD_CELLS.actions,
          align: 'center',
        },
      },
    ];

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, dialog]);

  return { columns };
};

const LinkButton = styled(Button)`
  background: #fff;
  color: #2196f3;
  -webkit-user-select: text;
  user-select: text;
  &:hover {
    transition: 2s;
    text-decoration: underline;
  }
`;

export default useTableColumns;
