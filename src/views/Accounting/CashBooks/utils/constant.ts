import { Cash } from './type';

export const hiddenColumns: (keyof Cash)[] = [];

export const documentDetailType = [
  {
    id: '0',
    label: 'Nhập - Khách hàng',
  },
  {
    id: '1',
    label: 'Nhập - Nhà cung cấp',
  },
  {
    id: '8',
    label: 'Xuất - Nhà cung cấp',
  },
  {
    id: '23',
    label: 'Bút toán - Phiếu thu',
  },
  {
    id: '24',
    label: 'Bút toán - Phiếu chi',
  },
  {
    id: '21',
    label: 'Bút toán - Báo nợ',
  },
  {
    id: '22',
    label: 'Bút toán - Báo có',
  },
  {
    id: '25',
    label: 'Phiếu bán hàng',
  },
  {
    id: '26',
    label: 'Phiếu trả hàng',
  },
];
