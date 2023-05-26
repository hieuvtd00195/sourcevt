import { Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ProTable from 'components/ProTable';
import React, { Fragment, useState } from 'react';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import useTableColumns from './TableColumns';

export interface Inventorys {
  storage: string;
  inventory: string;
  defective: string;
  shipping: string;
  inventoryStorage: string;
  changeStore: string;
  pending: string;
  custody: string;
  custodyComponents: string;
  warranty: string;
  sellable: string;
  pendingImport: string;
  reserve: string;
}

const fakeData: Inventorys[] = [
  {
    storage: 'Linh kiện sài gòn',
    inventory: '5',
    defective: '',
    shipping: '',
    inventoryStorage: '5',
    changeStore: '',
    pending: '',
    custody: '',
    custodyComponents: '',
    warranty: '',
    sellable: '5',
    pendingImport: '',
    reserve: '',
  },
];

const Inventory = () => {
  const [data] = useState<Inventorys[]>(fakeData);
  const { columns } = useTableColumns({});
  return (
    <Fragment>
      <Box sx={{ height: '300px' }}>
        <ProTable<Inventorys>
          title="Danh sách giao dịch"
          columns={columns}
          data={data}
          initialstate={{ hiddenColumns: [] }}
          hideFooter
        />
      </Box>
      <Stack sx={{ justifyContent: 'center', mt: 1 }} spacing={2}>
        <Box>
          <LightbulbIcon sx={{ fontSize: '40px' }} />
        </Box>
        <Box>
          <Typography variant="subtitle1">Chú ý:</Typography>
          <Typography variant="subtitle1">
            - Số "Đang giao hàng" là số sản phẩm trong các đơn hàng đang vận
            chuyển.
          </Typography>
          <Typography variant="subtitle1">
            - Số "Tạm giữ" là số sản phẩm trong các đơn hàng chưa xử lý trạng
            thái.
          </Typography>
          <Typography variant="subtitle1">
            - Số "Đang xuất chuyển kho" là số lượng chuyển kho mới duyệt, chưa
            xác nhận ở kho đi.
          </Typography>
          <Typography variant="subtitle1">
            - Số "Chờ nhập chuyển kho" là số lượng chuyển kho mới duyệt, chưa
            xác nhận ở kho đến.
          </Typography>
          <Typography variant="subtitle1">
            - Số "Có thể bán" = Tồn - Lỗi - Đang giao hàng - Tạm giữ - Tạm giữ
            linh kiện.
          </Typography>
          <Typography variant="subtitle1">
            - Số "Chờ nhập hàng" là số sản phẩm yêu cầu nhập nhà cung cấp đã
            được duyệt nhưng chưa nhập về cửa hàng.
          </Typography>
          <Typography variant="subtitle1">
            - Số "Đặt trước" là số sản phẩm ở đơn hàng loại đặt trước.
          </Typography>
        </Box>
      </Stack>
    </Fragment>
  );
};

export default Inventory;
