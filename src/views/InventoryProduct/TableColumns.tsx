import Index from 'components/ProTable/components/Index';
import Selection from 'components/ProTable/components/Selection';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import { Inventory, Product } from './utils/type';
import Numeral from 'utils/Numeral';
import ProductImage from 'components/ProductImage';
import { Link, Stack, Tooltip, Typography } from '@mui/material';
import { ColumnDef, DisplayColumnDef } from '@tanstack/react-table';
import { useSelector } from 'react-redux';
import { storeInventory } from 'slices/inventory';

const columnHelper = getColumnHelper<Inventory>();

const HEAD_CELLS: HeadCell<Inventory> = {
  index: 'ID',
  code: 'Mã sản phẩm',
  name: 'Sản phẩm',
  tm: 'TM',
  hn: 'HN-1',
  th: 'Thái Hà',
  sg: 'Sài Gòn',
  commingProduct: 'Hàng trên đường',
  tn: 'Thái Nguyên',
  vinh: 'Vinh',
  screen: 'Màn hình',
  product: 'Sản phẩm',
  thanhhoa: 'VTech Thanh Hóa',
  danang: 'VTech Đà Nẵng',
  xeth: 'Xe TH',
  mrV: 'Anh Vương',
  actions: 'Hành động',
};

interface IItem {
  [key: string]: any
}
interface Props {
  pageNumber: number;
  pageSize: number;
}

const useTableColumns = (props: Props) => {
  const { pageNumber, pageSize } = props;
  const storeData = useSelector(storeInventory);

  const columns: ProColumn<Inventory> = useMemo(() => {
    const rows: ColumnDef<Inventory>[] = [];
    storeData.forEach((item: IItem) => {
      rows.push(
        columnHelper.accessor(item.name, {
          id: item.name,
          size: 50,
          enableSorting: false,
          header: () => item.name,
          cell: (context) => {
            const { stocks } = context.row.original;
            const result = stocks?.filter((obj: any) => obj.storeId === item.id);
            if (result) {
              return (
                <Typography>{result[0]?.quantity}</Typography>
              )
            }
          },
          meta: {
            title: item.name,
          },
        }))
    })

    return [
      Selection<Inventory>(),
      Index<Inventory>(pageNumber, pageSize),

      columnHelper.accessor('code', {
        id: 'code',
        size: 50,
        enableSorting: false,
        header: () => HEAD_CELLS.code,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.code,
        },
      }),
      columnHelper.accessor('name', {
        id: 'name',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.name,
        cell: (context) => {
          return (
            <Stack direction="column" spacing={0}>
              <Tooltip title="Đang phát triển">
                <Link
                  href="https://www.google.com.vn/?hl=vi"
                  underline="none"
                  target="_blank"
                  color={'#007bff'}
                >
                  {context.getValue()}
                </Link>
              </Tooltip>

            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.name,
        },
      }),
      ...rows,
    ];
  }, [pageNumber, pageSize, storeData]);

  return { columns };
};

export default useTableColumns;
