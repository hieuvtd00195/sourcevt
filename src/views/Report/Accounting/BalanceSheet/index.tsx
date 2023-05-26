import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { Box, Link, Stack, Typography } from '@mui/material';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProMenu from 'components/ProMenu';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { Fragment, useRef, useState } from 'react';
import type { FiltersRef } from 'types/refs';
import FiltersForm from './FiltersForm';
import useTableColumns from './TableColumns';
import useFilters from './utils/filters';
import { BalanceSheet } from './utils/type';

const DATA: BalanceSheet[] = [
  {
    id: '1',
    assets: 'A - TÀI SẢN NGẮN HẠN(100)',
    code: '',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '2',
    assets: 'I - Tiền và các khoản tương đương tiền',
    code: '110 = 111 + 112',
    thisPeriod: { value: '1178504078', type: 'positive' },
    lastPeriod: { value: '481481075', type: 'positive' },
  },
  {
    id: '3',
    assets: '1.Tiền',
    code: '111',
    thisPeriod: { value: '1178504078', type: 'positive' },
    lastPeriod: { value: '481481075', type: 'positive' },
  },
  {
    id: '4',
    assets: 'II - Đầu tư tài chính ngắn hạn',
    code: '120 = 121 + 122 + 123',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '5',
    assets: '1.Chứng khoán kinh doanh',
    code: '121',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '6',
    assets: '2.Dự phòng giảm giá chứng khoán kinh doanh',
    code: '122',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '7',
    assets: '3.Đầu tư nắm giữ đến ngày đáo hạn',
    code: '123',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '8',
    assets: 'III - Các khoản phải thu ngắn hạn',
    code: '130 = 131 +132 + 133 +134 +135 +139',
    thisPeriod: { value: '2523587632', type: 'positive' },
    lastPeriod: { value: '727985000', type: 'positive' },
  },
  {
    id: '9',
    assets: '1.Phải thu ngắn hạn của khách hàng',
    code: '131',
    thisPeriod: { value: '2109829500', type: 'positive' },
    lastPeriod: { value: '727985000', type: 'positive' },
  },
  {
    id: '10',
    assets: '2.Trả trước cho người bán',
    code: '132',
    thisPeriod: { value: '413758132	', type: 'positive' },
    lastPeriod: null,
  },
  {
    id: '11',
    assets: '3.Phải thu nội bộ ngắn hạn',
    code: '133',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '12',
    assets: '4.Phải thu theo tiến độ kế hoạch hợp đồng xây dựng',
    code: '134',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '13',
    assets: '5.Phải thu về cho vay ngắn hạn',
    code: '135',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '14',
    assets: '6.Phải thu ngắn hạn khác',
    code: '136',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '15',
    assets: '7.Dự phòng phải thu ngắn hạn khó đòi',
    code: '137',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '16',
    assets: '8.Tài sản thiếu chờ xử lý',
    code: '139',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '17',
    assets: 'IV - Hàng tồn kho',
    code: '140 = 141 +149',
    thisPeriod: { value: '6400297596', type: 'positive' },
    lastPeriod: { value: '8216002381', type: 'positive' },
  },
  {
    id: '18',
    assets: '1.Hàng tồn kho',
    code: '141',
    thisPeriod: { value: '6400297596', type: 'positive' },
    lastPeriod: { value: '8216002381', type: 'positive' },
  },
  {
    id: '19',
    assets: '2.Dự phòng giảm giá hàng tồn kho',
    code: '149',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '20',
    assets: 'V - Tài sản ngắn hạn khác',
    code: '150 = 151 +152 +153 +155',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '21',
    assets: '1.Chi phí trả trước ngắn hạn',
    code: '151',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '22',
    assets: '2.Thuế GTGT được khấu trừ',
    code: '152',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '23',
    assets: '3.Thuế và các khoản khác phải thu Nhà nước',
    code: '153',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '24',
    assets: '4.Giao dịch mua bán lại trái phiếu chính phủ',
    code: '154',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '25',
    assets: '5.Tài sản ngắn hạn khác',
    code: '155',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '26',
    assets: 'B - TÀI SẢN DÀI HẠN (200)',
    code: '',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '27',
    assets: 'I - Các khoản phải thu dài hạn',
    code: '210 = 211 +212 +213 +214 +215 +216 +219	',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '28',
    assets: '1.Phải thu dài hạn của khách hàng	',
    code: '211',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '29',
    assets: '1.Phải thu dài hạn của khách hàng',
    code: '211',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '30',
    assets: '2.Trả trước cho người bán dài hạn',
    code: '212',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '31',
    assets: '3.Vốn kinh doanh ở đơn vị trực thuộc',
    code: '213',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '32',
    assets: '4.Phải thu nội bộ dài hạn',
    code: '214',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '33',
    assets: '5.Phải thu về cho vay dài hạn',
    code: '215',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '34',
    assets: '6.Phải thu dài hạn khác',
    code: '216',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '35',
    assets: '7.Dự phòng phải thu dài hạn khó đòi',
    code: '219',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '36',
    assets: 'II - Tài sản cố định',
    code: '220 = 221 +224 +227',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '37',
    assets: '1.Tài sản cố định hữu hình',
    code: '221 = 222 +223	',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '38',
    assets: '-- Nguyên giá',
    code: '222',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '39',
    assets: '-- Giá trị hao mòn luỹ kế',
    code: '223',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '40',
    assets: '2.Tài sản cố định thuê tài chính',
    code: '224 = 225 +226	',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '41',
    assets: '-- Nguyên giá',
    code: '225',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '42',
    assets: '-- Giá trị hao mòn luỹ kế',
    code: '226',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '43',
    assets: '3.Tài sản cố định vô hình',
    code: '228',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '44',
    assets: '-- Nguyên giá',
    code: '229',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '45',
    assets: 'III - Bất động sản đầu tư',
    code: '230 = 231 +232',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '46',
    assets: '-- Nguyên giá',
    code: '231',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '47',
    assets: '-- Giá trị hao mòn luỹ kế',
    code: '232',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '48',
    assets: 'IV - Đầu tư tài chính dài hạn',
    code: '250 = 251 +252 +253 +254 +255',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '49',
    assets: '1.Đầu tư vào công ty con',
    code: '251',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '50',
    assets: '2.Đầu tư vào công ty liên doanh, liên kết',
    code: '252',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '51',
    assets: '3.Đầu tư dài hạn khác',
    code: '253',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '52',
    assets: '-- Nguyên giá',
    code: '225',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '53',
    assets: '4.Dự phòng đầu tư tài chính dài hạn',
    code: '254',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '54',
    assets: '5.Đầu tư nắm giữ đến ngày đáo hạn',
    code: '255',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '56',
    assets: 'V - Tài sản dài hạn khác',
    code: '260 = 261 +262 +268',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '57',
    assets: '1.Chi phí trả trước dài hạn',
    code: '261',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '58',
    assets: '2.Tài sản thuế thu nhập hoãn lại',
    code: '262',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '59',
    assets: '3.Tài sản dài hạn khác',
    code: '268',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '60',
    assets: 'Tổng cộng tài sản (270 = 100 + 200)',
    code: '',
    thisPeriod: { value: '10102389306', type: 'positive' },
    lastPeriod: { value: '9425468456', type: 'positive' },
  },
  {
    id: '61',
    assets: 'C - Nợ phải trả (300)',
    code: '',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '62',
    assets: 'I - Nợ ngắn hạn',
    code: '310 = 311 +312 +313 +314 +315 +316 +317 +318 +319 +320 +321 +322 +323 +324',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '63',
    assets: '1.Phải trả người bán ngắn hạn',
    code: '311',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '64',
    assets: '2.Vay và nợ thuê tài chính ngắn hạn',
    code: '312',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '65',
    assets: '3.Thuế và các khoản phải nộp Nhà nước',
    code: '313',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '66',
    assets: '4.Phải trả người lao động',
    code: '314',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '67',
    assets: '4.Phải trả người lao động',
    code: '314',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '68',
    assets: '5.Chi phí phải trả ngắn hạn',
    code: '315',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '69',
    assets: '6.Phải trả nội bộ ngắn hạn',
    code: '316',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '70',
    assets: '7.Phải trả theo tiến độ kế hoạch hợp đồng xây dựng',
    code: '317',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '71',
    assets: '8.Doanh thu chưa thực hiện ngắn hạn',
    code: '318',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '72',
    assets: '9.Phải trả ngắn hạn khác	',
    code: '319',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '73',
    assets: '10.Vay và nợ thuê tài chính ngắn hạn',
    code: '320',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '73',
    assets: '11.Dự phòng phải trả ngắn hạn',
    code: '321',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '74',
    assets: '12.Quỹ khen thưởng phúc lợi',
    code: '322',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '75',
    assets: '13.Quỹ bình ổn giá',
    code: '323',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '76',
    assets: '14.Quỹ bình ổn giá',
    code: '324',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '77',
    assets: 'II - Nợ dài hạn',
    code: '330 = 331 +332 +333 +334 +335 +336 +337 +338 +339 +340 +341 +342',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '78',
    assets: '1.Phải trả người bán dài hạn',
    code: '331',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '79',
    assets: '2.Người mua trả tiền trước dài hạn',
    code: '332',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '80',
    assets: '3.Chi phí trả dài hạn',
    code: '333',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '81',
    assets: '4.Phải trả nội bộ về kinh doanh',
    code: '334',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '82',
    assets: '5.Phải trả nội bộ dài hạn',
    code: '335',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '83',
    assets: '6.Doanh thu chưa thực hiện dài hạn',
    code: '336',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '84',
    assets: '7.Phải trả dài hạn khác',
    code: '337',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '85',
    assets: '8.Vay và nợ thuê tài chính dài hạn',
    code: '338',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '86',
    assets: '9.Trái phiếu chuyển đổi',
    code: '339',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '87',
    assets: '10.Cổ phiếu ưu đãi',
    code: '340',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '86',
    assets: '11.Thuế thu nhập hoãn lại phải trả',
    code: '341',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '87',
    assets: '12.Thuế thu nhập hoãn lại phải trả',
    code: '339',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '88',
    assets: 'D - Vốn chủ sở hữu (400)',
    code: '',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '89',
    assets: 'I - Vốn chủ sở hữu',
    code: '410 = 411 + 412 +413 +414 +415 +416 +417 +418 +419 +420 +421 +422',
    thisPeriod: { value: '8983276801', type: 'positive' },
    lastPeriod: { value: '8983276801', type: 'positive' },
  },
  {
    id: '90',
    assets: '1.Vốn góp của chủ sở hữu',
    code: '4111',
    thisPeriod: { value: '8983276801', type: 'positive' },
    lastPeriod: { value: '8983276801', type: 'positive' },
  },
  {
    id: '91',
    assets: '2.Thặng dư vốn cổ phần',
    code: '4112',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '91',
    assets: '3.Vốn khác của chủ sở hữu',
    code: '4118',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '92',
    assets: '4.Cổ phiếu quỹ',
    code: '419',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '93',
    assets: '5.Chênh lệch đánh giá lại tài sản',
    code: '412',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '94',
    assets: '6.Chênh lệch tỷ giá hối đoái',
    code: '413',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '95',
    assets: '7.Quỹ đầu tư phát triển',
    code: '414',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '96',
    assets: '8.Quỹ hỗ trợ sắp xếp doanh nghiệp',
    code: '417',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '97',
    assets: '9.Quỹ khác thuộc vốn chủ sở hữu',
    code: '417',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '98',
    assets: '10.Lợi nhuận sau thuế chưa phân phối',
    code: '421 = 421a +421b	',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '99',
    assets: '11.Nguồn kinh phí và quỹ khác',
    code: '441',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '100',
    assets: 'II - Nguồn kinh phí và quỹ khác	',
    code: '430 = 431 +432	',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '101',
    assets: '1.Quỹ khen thưởng, phúc lợi',
    code: '431',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '102',
    assets: '2.Nguồn kinh phí	',
    code: '466',
    thisPeriod: null,
    lastPeriod: null,
  },
  {
    id: '103',
    assets: 'Tổng tài sản - nguồn vốn (270 - 440)',
    code: '',
    thisPeriod: { value: '1119112505', type: 'positive' },
    lastPeriod: { value: '442191655', type: 'positive' },
  },
  {
    id: '104',
    assets: 'Tổng cộng nguồn vốn (440 = 300 + 400)',
    code: '',
    thisPeriod: { value: '8983276801', type: 'negative' },
    lastPeriod: { value: '8983276801', type: 'negative' },
  },
];

const InventoryTable = () => {
  const [, refetch] = useRefresh();
  const [data] = useState<BalanceSheet[]>(DATA);
  const [loading] = useState<boolean>(false);
  const filtersRef = useRef<FiltersRef>(null);
  const { filters, onSortingChange, onSearch } = useFilters();

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
  });

  return (
    <PageWrapper title="Báo cáo cân đối kế toán của doanh nghiệp">
      <PageBreadcrumbs
        title="Báo cáo cân đối kế toán của doanh nghiệp"
        items={[
          { text: 'Kế toán', link: '#' },
          { link: '/report/revenue/depot', text: 'Báo cáo' },
        ]}
      />
      <Fragment>
        <Box sx={{ height: '5000px' }}>
          <ProTable<BalanceSheet>
            title="Danh sách giao dịch"
            loading={loading}
            columns={columns}
            data={data}
            refetch={refetch}
            onSortingChange={onSortingChange}
            initialstate={{ hiddenColumns: [] }}
            filter={<FiltersForm ref={filtersRef} onSearch={onSearch} />}
            toolBar={
              <Fragment>
                <ProMenu<number>
                  position="left"
                  items={[
                    {
                      label: 'Xuất Excel',
                      value: 1,
                      // onSelect: handleToggleExportInventory,
                      actionType: 'excel',
                    },
                    {
                      label: 'In Báo Cáo',
                      value: 2,
                      // onSelect: handleCloseChangeStore,
                      // disabled: rowIds.length === 0,
                      actionType: 'print',
                    },
                  ]}
                >
                  <ActionButton color="info">Thao tác</ActionButton>
                </ProMenu>
              </Fragment>
            }
          />
        </Box>
        <Stack sx={{ justifyContent: 'center', mt: 1 }} spacing={2}>
          <Box>
            <LightbulbIcon sx={{ fontSize: '40px' }} />
          </Box>
          <Box>
            <Typography variant="subtitle1">Chú ý:</Typography>
            <Typography variant="subtitle1">
              - Tham khảo cách lập bảng cân đối kế toán
              <span>
                {' '}
                <Link href="#" color="red">
                  Tại đây
                </Link>
              </span>
            </Typography>
            <Typography variant="subtitle1">
              - Mặc định hệ thống sẽ tính hoạt động kinh doanh trong khoảng thời
              gian lọc
            </Typography>
            <Typography variant="subtitle1">
              - Nếu tổng tài sản - tổng nguồn vốn ra số chênh lệch nghĩa là chưa
              kết chuyển lại các tài khoản, tham khảo kết chuyển kế toán và cách
              lập bảng cân đối kế toán.
            </Typography>
          </Box>
        </Stack>
      </Fragment>
    </PageWrapper>
  );
};

export default InventoryTable;
