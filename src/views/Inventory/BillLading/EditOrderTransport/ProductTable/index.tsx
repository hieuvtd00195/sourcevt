import { TableRow, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import ProTable from 'components/ProTable';
import ProTableCell from 'components/ProTable/ProTableCell';
import useRefresh from 'hooks/useRefresh';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import Numeral from 'utils/Numeral';
import useTableColumns from './TableColumns';
interface Props {
  dataProductTable: any[];
  handleDeleteRow:(index: number, value: any) => void;
}

const ProductTable = (props: Props) => {
  const { dataProductTable, handleDeleteRow } = props;

  const [, refetch] = useRefresh();
  const [loading] = useState<boolean>(false);

  const { columns } = useTableColumns({
    handleDeleteRow,
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
        />
      </Box>
    </>
  );
};

export default ProductTable;
