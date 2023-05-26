import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import Numeral from 'utils/Numeral';
import { ISellingByStoreTable } from './utils/types';

const columnHelper = getColumnHelper<ISellingByStoreTable>();

const HEAD_CELLS: HeadCell<ISellingByStoreTable> = {
  index: 'ID',
  product: 'Sản phẩm',
  price: 'Giá vốn/ Giá bán',
  sell: 'Bán',
  pay: 'Trả',
};

interface Props {
  pageNumber: number;
  pageSize: number;
  dataDynamicCol: string[];
}

const useTableColumns = (props: Props) => {
  const { dataDynamicCol } = props;
  const columnsDynamic: ProColumn<ISellingByStoreTable> = dataDynamicCol.map(
    (item: string) => {
      return columnHelper.group({
        id: `${item}`,
        header: `${item}`,
        columns: [
          columnHelper.accessor('sell', {
            id: 'sell',
            size: 100,
            header: () => HEAD_CELLS.sell,
            cell: (context) => (
              <Typography variant="body1" sx={{ color: 'blue' }}>
                {Numeral.price(context.getValue())}
              </Typography>
            ),
            meta: {
              title: HEAD_CELLS.sell,
              align: 'center',
            },
          }),
          columnHelper.accessor('pay', {
            id: 'pay',
            size: 100,
            header: () => HEAD_CELLS.pay,
            cell: (context) => (
              <Typography variant="body1" sx={{ color: 'red' }}>
                {Numeral.price(context.getValue())}
              </Typography>
            ),
            meta: {
              title: HEAD_CELLS.pay,
              align: 'center',
            },
          }),
        ],
        meta: {
          align: 'center',
        },
      });
    }
  );
  const columns: ProColumn<ISellingByStoreTable> = useMemo(() => {
    return [
      columnHelper.accessor('product', {
        id: 'product',
        size: 400,
        header: () => HEAD_CELLS.product,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: 'blue' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.product,
        },
      }),
      columnHelper.accessor('price', {
        id: 'price',
        size: 200,
        header: () => HEAD_CELLS.price,
        cell: (context) => (
          <Box>
            <Typography variant="body2" sx={{ color: 'green' }}>
              {Numeral.price(context.getValue().sell)}
            </Typography>
            <Typography variant="body2" sx={{ color: 'red' }}>
              {Numeral.price(context.getValue().pay)}
            </Typography>
          </Box>
        ),
        meta: {
          title: HEAD_CELLS.price,
          align: 'center',
        },
      }),
      columnHelper.group({
        id: 'dp142',
        header: 'DP-142482-1',
        columns: [
          columnHelper.accessor('sell', {
            id: 'sell',
            size: 100,
            header: () => HEAD_CELLS.sell,
            cell: (context) => (
              <Typography variant="body1" sx={{ color: 'blue' }}>
                {Numeral.price(context.getValue())}
              </Typography>
            ),
            meta: {
              title: HEAD_CELLS.sell,
              align: 'center',
            },
          }),
          columnHelper.accessor('pay', {
            id: 'pay',
            size: 100,
            header: () => HEAD_CELLS.pay,
            cell: (context) => (
              <Typography variant="body1" sx={{ color: 'red' }}>
                {Numeral.price(context.getValue())}
              </Typography>
            ),
            meta: {
              title: HEAD_CELLS.pay,
              align: 'center',
            },
          }),
        ],
        meta: {
          align: 'center',
        },
      }),
    ];
  }, []);
  const totalColumns = columns.concat(columnsDynamic);
  return { totalColumns };
};

export default useTableColumns;
