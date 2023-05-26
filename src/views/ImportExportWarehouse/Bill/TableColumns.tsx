import EditIcon from '@mui/icons-material/Edit';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Box, IconButton, Link } from '@mui/material';
import Typography from '@mui/material/Typography';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import Selection from 'components/ProTable/components/Selection';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { Fragment, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IImportExport } from './utils/types';
import DateTime from 'utils/DateTime';
import Numeral from 'utils/Numeral';
import useDialog from 'hooks/useDialog';
const columnHelper = getColumnHelper<IImportExport>();

const HEAD_CELLS: HeadCell<IImportExport> = {
  index: 'ID',
  code: 'ID ',
  creationTime: 'Ngày',
  storeName: 'Cửa hàng',
  numberOfProduct: 'SP',
  totalProductAmount: 'SL',
  totalPrice: 'Tổng tiền sau chiết khấu',
  billDiscountRate: 'Chiết khấu',
  creatorName: 'Người tạo',
  audienceName: 'Đối tượng',
  note: 'Ghi chú',
  billDiscountType: 'Loại chiết khấu',
  isEditable: 'checkTypeEdit',
};
const CaseEntryAudiences = (value: number) => {
  switch (value) {
    case 0:
      return <>KH</>;
    case 1:
      return <>NCC VN</>;
    case 2:
      return <>NCC TQ</>;
    case 3:
      return <>NV</>;
    case 4:
      return <>Khác</>;
    default:
      return null;
  }
};
interface Props {
  pageNumber: number;
  pageSize: number;
  handleEditNote: (id: number, note: string) => void;
  onDelete: (rowIndex: number, rowId: string) => () => Promise<void>;
}

const boxSX = {
  color: 'rgb(0, 123, 255)',
  fontWeight: 500,
  '&:hover': {
    color: 'rgb(0, 123, 255)',
  },
};

const useTableColumns = (props: Props) => {
  const { handleEditNote, onDelete } = props;
  const navigate = useNavigate();
  const dialog = useDialog();
  const columns: ProColumn<IImportExport> = useMemo(() => {
    return [
        Selection<IImportExport>(),
      columnHelper.accessor('code', {
        id: 'code',
        enableSorting: false,
        size: 50,
        header: () => HEAD_CELLS.code,
        cell: (context) => {
          const { id, billType } = context.row.original;
          return (
            <Box>
              <Link
                href={`/inventory/bill/detail/${id}/${billType}`}
                sx={boxSX}
              >
                {context.getValue()}
              </Link>
              <Typography
                variant="subtitle2"
                sx={{ color: '#007bff' }}
              ></Typography>
              <Link href="#" color="orange">
                {`(Log sửa)`}
              </Link>
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.code,
        },
      }),
      columnHelper.accessor('creationTime', {
        id: 'creationTime',
        size: 150,
        enableSorting: false,
        header: () => HEAD_CELLS.creationTime,
        cell: (context) => {
          const value = context.getValue();
          if (!value) return;
          return (
            <Box>
              <Typography variant="body2">
                {DateTime.Format(value, 'DD-MM-YYYY')}
              </Typography>
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.creationTime,
        },
      }),
      columnHelper.accessor('storeName', {
        id: 'storeName',
        enableSorting: false,
        size: 200,
        header: () => HEAD_CELLS.storeName,
        cell: (context) => {
          const { billType, documentDetailTypeName } = context.row.original;
          return (
            <Box>
              <Typography variant="body1">{context.getValue()}</Typography>
              <Typography
                variant="body1"
                sx={{ color: billType === 0 ? 'blue' : 'red' }}
              >
                {documentDetailTypeName}
              </Typography>
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.storeName,
        },
      }),
      columnHelper.accessor('numberOfProduct', {
        id: 'numberOfProduct',
        size: 50,
        enableSorting: false,
        header: () => HEAD_CELLS.numberOfProduct,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.numberOfProduct,
        },
      }),
      columnHelper.accessor('totalProductAmount', {
        id: 'totalProductAmount',
        size: 50,
        enableSorting: false,
        header: () => HEAD_CELLS.totalProductAmount,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.totalProductAmount,
        },
      }),
      columnHelper.accessor('totalPrice', {
        id: 'totalPrice',
        enableSorting: false,
        size: 80,
        header: () => HEAD_CELLS.totalPrice,
        cell: (context) => Numeral.price(context.getValue()),
        meta: {
          title: HEAD_CELLS.totalPrice,
        },
      }),
      columnHelper.accessor('billDiscountRate', {
        id: 'billDiscountRate',
        enableSorting: false,
        size: 50,
        header: () => HEAD_CELLS.billDiscountRate,
        cell: (context) => {
          const { billDiscountType, billDiscountRate, billDiscountAmount,totalDiscountAmount } =
            context.row.original;
          return (
            <>
              {/* {billDiscountType === 0 ? (
                <Typography>
                  {billDiscountRate ? `${billDiscountRate} %` : 0}
                </Typography>
              ) : ( */}
              <Typography>{Numeral.price(totalDiscountAmount)}</Typography>
              {/* )} */}
            </>
          );
        },
        meta: {
          title: HEAD_CELLS.billDiscountRate,
        },
      }),
      columnHelper.accessor('creatorName', {
        id: 'creatorName',
        enableSorting: false,
        size: 100,
        header: () => HEAD_CELLS.creatorName,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.creatorName,
        },
      }),
      columnHelper.accessor('audienceName', {
        id: 'audienceName',
        enableSorting: false,
        size: 150,
        header: () => HEAD_CELLS.audienceName,
        cell: (context) => {
          const { audienceName, audienceCode, audiencePhone, audienceType } =
            context.row.original;
          return (
            <>
              {audienceType === 4 ? (
                <>
                  <Typography>Khác</Typography>
                </>
              ) : (
                <>
                  <Box>
                    <Typography>
                      {CaseEntryAudiences(audienceType)} - {audienceCode}
                    </Typography>
                    <Typography>{audienceName}</Typography>
                    <Typography>{audiencePhone}</Typography>
                  </Box>
                </>
              )}
            </>
          );
        },
        meta: {
          title: HEAD_CELLS.audienceName,
        },
      }),
      columnHelper.accessor('note', {
        id: 'note',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.note,
        cell: (context) => {
          const { note, id } = context.row.original;
          return <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {note}
            <IconButton onClick={() => handleEditNote(id, note)}>
              <EditIcon sx={{ color: 'text.secondary', ml: 1 }} />
            </IconButton>
          </Box>;
        },
        meta: {
          title: HEAD_CELLS.note,
        },
      }),
      {
        id: 'actions',
        size: 65,
        enableSorting: false,
        header: () => <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />,
        cell: (context) => {
          const { id, billType,isEditable } = context.row.original;
          const rowId = context.row.id;
          const rowIndex = context.row.index;
          const handleDeleteRow = () => {
            dialog({
              supportingText: 'Bạn có chắc chắn muốn xóa phiếu này không?',
              onConfirm: onDelete(rowIndex, id),
            });
          };

          return (
            <ProMenu
              position="left"
              items={[
                // {
                //   label: 'In phiếu',
                //   value: 1,
                //   actionType: 'print',
                // },
                {
                  label: 'Upload file',
                  value: 2,
                  actionType: 'upload',
                  onSelect: () => navigate('/sales/retail/edit/1'),
                },
                {
                  label: billType === 0 ? 'Sửa phiếu nhập' : 'Sửa phiếu xuất',
                  value: 2,
                  disabled: isEditable ? false : true,
                  actionType: 'edit',
                  onSelect: () =>
                    navigate(`/inventory/bill/edit/${id}/${billType}`),
                },

                // {
                //   label: 'Sửa phiếu XNK khác',
                //   value: 2,
                //   actionType: 'edit',
                //   onSelect: () => navigate('/inventory/bill/edit'),
                // },
                // {
                //   label: 'In mã vạch sản phẩm trong phiếu',
                //   value: 3,
                //   actionType: 'add',
                // },
                // {
                //   label: 'In IMEI sản phẩm phiếu XNK',
                //   value: 4,
                //   actionType: 'add',
                // },
                // {
                //   label: 'Xuất Excel in mã vạch bằng Bartender',
                //   value: 5,
                //   actionType: 'arrowRight',
                // },
                {
                  label: 'Xóa phiếu',
                  value: 3,
                  actionType: 'delete',
                  onSelect: () => {
                    handleDeleteRow()
                  }
                },
              ]}
            >
              <ActionIconButton actionType="more" />
            </ProMenu>
          );
        },
        meta: {
          title: HEAD_CELLS.actions,
          align: 'center',
        },
      },
      //   columnHelper.accessor('note', {
      //     id: 'note',
      //     size: 100,
      //     enableSorting: false,
      //     header: () => HEAD_CELLS.note,
      //     cell: (context) => {
      //       const { note, id } = context.row.original;
      //       return (
      //         <Box
      //           sx={{
      //             display: 'flex',
      //             justifyContent: 'center',
      //             alignItems: 'center',
      //           }}
      //         >
      //           {note}
      //           <IconButton onClick={() => handleEditNote(id, note)}>
      //             <EditIcon sx={{ color: 'text.secondary', ml: 1 }} />
      //           </IconButton>
      //         </Box>
      //       );
      //     },
      //     meta: {
      //       title: HEAD_CELLS.note,
      //     },
      //   }),
    ];
  }, [navigate, handleEditNote, onDelete]);

  return { columns };
};

export default useTableColumns;
