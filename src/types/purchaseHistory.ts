import { PaginationParams } from './common';

export interface IPurchaseHistory {
  id: number | null;
  billCode: string | null;
  date: string | null;
  billLogType: string | null;
  customerName: string | null;
  productName: string | null;
  price: number | null;
  quantity: number | null;
  discountValue: number | null;
  discountUnit: number | null;
  money: number | null;
  preDiscountTotal?: number | null;
  afterDiscountTotal: number | null;
  note: string | null;
}

// {
//   "billId": "b0c9caa7-ae37-d95a-c29a-3a0b30b21e85",
//   "billCode": "0000000096",
//   "billLogType": 0,
//   "storeId": "05300d0e-82c8-46ef-b1eb-b376593c8427",
//   "storeCode": "800001",
//   "storeName": "Cửa hàng A",
//   "customerId": "b818b32d-036f-1c04-901d-3a0b2fd0fb14",
//   "customerCode": "0000000058",
//   "customerName": "Vương Trung Hiếu 3",
//   "customerPhone": "0965342312",
//   "productId": "7ba676a7-7f0e-4703-8b5f-a91bc9379b8a",
//   "productCode": "CKIC11",
//   "productName": "Cảm ĐB Ko IC 11",
//   "price": 230000,
//   "quantity": 1,
//   "discountValue": 0,
//   "discountUnit": 0,
//   "preDiscountTotal": 230000,
//   "afterDiscountTotal": 230000,
//   "creationTime": "2023-04-26T08:27:10.854"
// }

export interface IParamsSearchPurchaseHistory extends PaginationParams {
  customerId: string | null;
  from: string | null;
  to: string | null;
  billLogType: number | null;
  productName: number | null;
}
