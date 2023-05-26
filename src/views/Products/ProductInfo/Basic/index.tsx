import { Box, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Tag } from 'components/Tags';
import Numeral from 'utils/Numeral';
import DateTime from 'utils/DateTime';

interface Basics {
  code: string;
  barCode: string;
  category: string;
  creator: string;
  createDate: string | null;
  importPrice: string;
  costPrice: string;
  sellPrice: string;
  manyPrice: string;
  oldPrice: string;
  spaPrice: string;
  unit: string;
}
const fakeData: Basics = {
  code: 'KL14PRLV',
  barCode: '2000007866065',
  category: '',
  creator: 'Hiệp SG',
  createDate: null,
  importPrice: '210000',
  costPrice: '210000',
  sellPrice: '210000',
  manyPrice: '210000',
  oldPrice: '',
  spaPrice: '',
  unit: '',
};

const Basic = () => {
  const [data] = useState<Basics>(fakeData);

  return (
    <Paper sx={{ p: 2, mt: 1 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          mb: 1,
        }}
      >
        <Stack sx={{ alignItems: 'center' }}>
          <ErrorOutlineIcon />
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            {'Thông tin'}
          </Typography>
        </Stack>
        <Box>
          <Typography pl={2}>
            Trạng thái: <Tag color="info">Mới</Tag>
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={6} sm={3} lg={3}>
          <Typography>{`Mã: ${data.code}`}</Typography>
        </Grid>
        <Grid item xs={6} sm={3} lg={3}>
          {/* hệ thống tự sinh sau khi tạo sản phẩm theo quy tắc EAN-13 */}
          <Typography>{`Mã vạch: ${data.barCode}`}</Typography>
        </Grid>
        <Grid item xs={6} sm={3} lg={3}>
          {/* cập nhật theo phiếu nhập sản phẩm từ khách hàng và nhà cung cấp gần nhất */}
          <Typography>{`Giá nhập: ${Numeral.price(
            data.importPrice
          )}`}</Typography>
        </Grid>
        <Grid item xs={6} sm={3} lg={3}>
          {/* tính theo phương pháp bình quân gia quyền */}
          {/* backend trả về */}
          <Typography>{`Giá vốn: ${Numeral.price(data.costPrice)}`}</Typography>
        </Grid>
        <Grid item xs={6} sm={3} lg={3}>
          <Typography>{`Danh mục: ${data.category}`}</Typography>
        </Grid>
        <Grid item xs={6} sm={3} lg={3}>
          <Typography>{`Người tạo: ${data.creator}`}</Typography>
        </Grid>
        <Grid item xs={6} sm={3} lg={3}>
          {/* Được khai báo ở màn tạo mới */}
          <Typography>{`Giá bán: ${Numeral.price(data.sellPrice)}`}</Typography>
        </Grid>
        <Grid item xs={6} sm={3} lg={3}>
          {/* Được khai báo ở màn tạo mới */}
          <Typography>{`Giá sỉ: ${Numeral.price(data.manyPrice)}`}</Typography>
        </Grid>
        <Grid item xs={6} sm={3} lg={3}>
          <Typography>{`Ngày tạo: ${DateTime.Format(
            data.createDate,
            'YYYY-MM-DD'
          )}`}</Typography>
        </Grid>
        <Grid item xs={6} sm={3} lg={3}>
          {/* Người dùng tự nhập (Có thể là cái, hộp, chiếc, lon)  */}
          <Typography>{`Đơn vị tính: ${Numeral.price(data.unit)}`}</Typography>
        </Grid>
        <Grid item xs={6} sm={3} lg={3}>
          {/* Được khai báo ở màn tạo mới */}
          <Typography>{`Giá spa: ${Numeral.price(data.spaPrice)}`}</Typography>
        </Grid>
        <Grid item xs={6} sm={3} lg={3}>
          {/* Được khai báo khi thêm mới sản phẩm (Giá cước/ 1 sản phẩm) */}
          <Typography>{`Giá cước: ${Numeral.price(data.oldPrice)}`}</Typography>
        </Grid>

        <Grid item xs={6} sm={3} lg={3}>
          <Typography>{`Tên khác: KL14PRLV`}</Typography>
        </Grid>
        {/* (giá bán trừ giá vốn)/giá bán   */}
        <Grid item xs={6} sm={3} lg={3}>
          <Typography>{`Lãi giá bán: ${Numeral.price(
            data.oldPrice
          )}`}</Typography>
        </Grid>
        {/* (giá sỉ trừ giá vốn)/ giá bán   */}
        <Grid item xs={6} sm={3} lg={3}>
          <Typography>{`Lãi giá sỉ: ${Numeral.price(
            data.oldPrice
          )}`}</Typography>
        </Grid>
        {/* (giá spa trừ giá vốn)/ giá bán   */}
        <Grid item xs={6} sm={3} lg={3}>
          <Typography>{`Lãi giá spa: ${Numeral.price(
            data.oldPrice
          )}`}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Basic;
