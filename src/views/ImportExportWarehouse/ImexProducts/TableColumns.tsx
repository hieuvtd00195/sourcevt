import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Box, Button, styled } from '@mui/material';
import Typography from '@mui/material/Typography';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProMenu from 'components/ProMenu';
import Selection from 'components/ProTable/components/Selection';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Numeral from 'utils/Numeral';
import { IImportExport } from './utils/types';
import DateTime from 'utils/DateTime';
import useDialog from 'hooks/useDialog';
import SelectionCheckbox from 'components/ProTable/components/SelectionCheckbox';
import {
  WareHousingBill,
  WareHousingBillResponse,
  setSelected,
} from 'slices/warehousingslice';
import { useTypedSelector } from 'store';
import { useDispatch } from 'react-redux';

const columnHelper = getColumnHelper<IImportExport>();

const HEAD_CELLS: HeadCell<IImportExport> = {
  code: 'ID',
  creationTime: 'Ngày',
  storeName: 'Cửa hàng',
  productCode: ' Mã sản phẩm',
  productName: 'Sản phẩm',
  quantity: 'SL',
  unit: 'ĐVT',
  inventory: 'Tồn',
  price: 'Giá',
  costPrice: 'Giá vốn',
  money: 'Tiền',
  totalMoney: 'Tổng tiền',
  discountAmount: 'Icon',
  // creatorName: 'Người tạo',
  // note: 'Ghi chú',
  actions: 'Hành động',
};

interface Props {
  pageNumber: number;
  pageSize: number;
  handleDelete: (id: string) => void;
}

const useTableColumns = (props: Props) => {
  const { handleDelete } = props;

  const dialog = useDialog();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selected } = useTypedSelector((state) => state.wareHousing);

  const onSelect = (value: WareHousingBill[]) => {
    dispatch(setSelected(value));
  };

  const columns: ProColumn<IImportExport> = useMemo(() => {
    return [
      SelectionCheckbox<WareHousingBill>({
        fieldName: 'id',
        selected,
        setSelected: onSelect,
      }),

      columnHelper.accessor('code', {
        id: 'code',
        size: 50,
        header: () => HEAD_CELLS.code,
        cell: (context) => {
          const value = context.getValue();
          return (
            <>
              <LinkButton
                variant="text"
                onClick={() => {
                  navigate(`/inventory?value=filter&code=${value}`);
                }}
              >
                {value}
              </LinkButton>
            </>
          );
        },
        meta: {
          title: HEAD_CELLS.code,
          align: 'center',
        },
      }),
      columnHelper.accessor('creationTime', {
        id: 'creationTime',
        size: 120,
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
          align: 'center',
        },
      }),
      columnHelper.accessor('storeName', {
        id: 'storeName',
        size: 200,
        header: () => HEAD_CELLS.storeName,
        cell: (context) => (
          <Box>
            <Typography variant="body1">{context.getValue()}</Typography>
            {/* <Typography variant="body1" sx={{ color: 'red' }}>
              {context.getValue().type}
            </Typography> */}
          </Box>
        ),
        meta: {
          title: HEAD_CELLS.storeName,
          align: 'center',
        },
      }),
      columnHelper.accessor('productCode', {
        id: 'productCode',
        size: 180,
        enableSorting: false,
        header: () => HEAD_CELLS.productCode,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.productCode,
          align: 'center',
        },
      }),
      columnHelper.accessor('productName', {
        id: 'productName',
        size: 220,
        enableSorting: false,
        header: () => HEAD_CELLS.productName,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.productName,
          align: 'center',
        },
      }),
      columnHelper.accessor('unit', {
        id: 'unit',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.unit,
        cell: (context) => {
          const value = context.getValue();
          return value === 1 ? 'Cái' : 'Lô';
        },
        meta: {
          title: HEAD_CELLS.unit,
          align: 'center',
        },
      }),
      columnHelper.accessor('quantity', {
        id: 'quantity',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.quantity,
        cell: (context) => {
          const billType = context?.row?.original?.billType;

          return (
            <Typography
              variant="body1"
              sx={{ color: billType === 1 ? 'red' : 'blue' }}
            >
              {context.getValue()}
            </Typography>
          );
        },
        meta: {
          title: HEAD_CELLS.quantity,
          align: 'center',
        },
      }),
      columnHelper.accessor('inventory', {
        id: 'inventory',
        size: 120,
        enableSorting: false,
        header: () => HEAD_CELLS.inventory,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.inventory,
          align: 'center',
        },
      }),
      columnHelper.accessor('price', {
        id: 'price',
        size: 150,
        enableSorting: false,
        header: () => HEAD_CELLS.price,
        cell: (context) => Numeral.price(context.getValue()),
        meta: {
          title: HEAD_CELLS.price,
          align: 'center',
        },
      }),
      columnHelper.accessor('costPrice', {
        id: 'costPrice',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.costPrice,
        cell: (context) => Numeral.price(context.getValue()),
        meta: {
          title: HEAD_CELLS.costPrice,
          align: 'center',
        },
      }),
      columnHelper.accessor('money', {
        id: 'money',
        size: 150,
        enableSorting: false,
        header: () => HEAD_CELLS.money,
        cell: (context) => Numeral.price(context.getValue()),
        meta: {
          title: HEAD_CELLS.money,
          align: 'center',
        },
      }),
      columnHelper.accessor('totalMoney', {
        id: 'totalMoney',
        size: 150,
        header: () => HEAD_CELLS.totalMoney,
        cell: (context) => (
          <Typography variant="body1" sx={{ color: 'red' }}>
            {Numeral.price(context.getValue())}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.totalMoney,
          align: 'center',
        },
      }),
      columnHelper.accessor('discountAmount', {
        id: 'discountAmount',
        size: 50,
        header: () => HEAD_CELLS.discountAmount,
        cell: (context) => Numeral.price(context.getValue()),
        meta: {
          title: HEAD_CELLS.discountAmount,
          align: 'center',
        },
      }),
      // columnHelper.accessor('creatorName', {
      //   id: 'creatorName',
      //   size: 100,
      //   header: () => HEAD_CELLS.creatorName,
      //   cell: (context) => context.getValue(),
      //   meta: {
      //     title: HEAD_CELLS.creatorName,
      //     align: 'center',
      //   },
      // }),
      // columnHelper.accessor('note', {
      //   id: 'note',
      //   size: 100,
      //   header: () => HEAD_CELLS.note,
      //   cell: (context) => context.getValue(),
      //   meta: {
      //     title: HEAD_CELLS.note,
      //   },
      // }),
      {
        id: 'actions',
        size: 65,
        enableSorting: false,
        header: () => <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />,
        cell: (context) => {
          const handleDeleteRow = () => {
            const { id, code } = context.row.original;
            dialog({
              headline: 'Xác nhận xóa?',
              supportingText: (
                <>
                  Bạn có chắc chắn muốn xóa: <strong>{code}</strong>
                </>
              ),
              onConfirm: () => {
                if (id) {
                  handleDelete(id);
                }
              },
            });
          };

          return (
            <ProMenu
              position="left"
              items={[
                {
                  label: 'Sửa',
                  value: 1,
                  actionType: 'edit',
                  onSelect: () =>
                    navigate('imex/edit/' + context?.row?.original?.id),
                },
                {
                  label: 'Xóa',
                  value: 6,
                  actionType: 'delete',
                  onSelect: handleDeleteRow,
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
    ];
  }, [dialog, handleDelete, navigate]);

  return { columns };
};

const LinkButton = styled(Button)`
  color: #007bff;
  -webkit-user-select: text;
  user-select: text;
  &:hover {
    text-decoration: underline;
  }
`;

export default useTableColumns;
