import { TableRow, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import ProTable from 'components/ProTable';
import ProTableCell from 'components/ProTable/ProTableCell';
import useRefresh from 'hooks/useRefresh';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import Numeral from 'utils/Numeral';
import { IDataSaleOrderLines, ISumTotalPrice } from '../utils/types';
import useTableColumns from './TableColumns';
interface Props {
  dataProductTable: IDataSaleOrderLines[];
  handleDeleteRow: (index: number, value: any) => void;
  handleChangeTotal: () => void;
  saleOrderLineDefault: IDataSaleOrderLines[];
  sumTotalPrice: ISumTotalPrice;
}

const ProductTable = (props: Props) => {
  const {
    dataProductTable,
    handleDeleteRow,
    handleChangeTotal,
    saleOrderLineDefault,
    sumTotalPrice,
  } = props;

  const [, refetch] = useRefresh();
  const [loading] = useState<boolean>(false);

  const { columns } = useTableColumns({
    handleDeleteRow,
    handleChangeTotal,
    saleOrderLineDefault,
  });

  return (
    <>
      <Box sx={{ height: '400px' }}>
        <ProTable<any>
          title="Danh sách"
          loading={loading}
          columns={columns}
          data={dataProductTable.map((item, index) => {
            return { ...item, ordinal: index + 1 };
          })}
          refetch={refetch}
          initialstate={{
            hiddenColumns: [],
            hiddenVisibilityColumns: true,
          }}
          totalRow={
            <>
              {!isEmpty(dataProductTable) && (
                <TableRow hover>
                  <ProTableCell offset={0}></ProTableCell>
                  <ProTableCell offset={0}></ProTableCell>
                  <ProTableCell offset={0}></ProTableCell>
                  <ProTableCell offset={0}></ProTableCell>
                  <ProTableCell offset={0}></ProTableCell>
                  <ProTableCell offset={0}></ProTableCell>
                  <ProTableCell offset={0}>
                    <Typography fontWeight="bold" textAlign="center">
                      Tổng
                    </Typography>
                  </ProTableCell>
                  <ProTableCell offset={0}>
                    <Typography fontWeight="bold" textAlign="center">
                      {Numeral.price(sumTotalPrice.sumTotalPriceNDT)}
                    </Typography>
                  </ProTableCell>
                  <ProTableCell offset={0}>
                    <Typography fontWeight="bold" textAlign="center">
                      {Numeral.price(sumTotalPrice.sumTotalPrice)}
                    </Typography>
                  </ProTableCell>
                  <ProTableCell offset={0}></ProTableCell>
                </TableRow>
              )}
            </>
          }
        />
      </Box>
    </>
  );
};

export default ProductTable;
