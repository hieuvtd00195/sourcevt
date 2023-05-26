export interface IEditOrderSlip<IDataSaleOrderLines> {
  code: string | null;
  supplierName: string | null;
  storeName: string | null;
  rate: number | null;
  //=====
  id: string | null;
  productId: (string | null)[];
  package: string | null;
  invoiceNumber: string | null;
  orderDate: Date | string | null;
  note: string | null;
  saleOrderLines: IDataSaleOrderLines[];
}

export interface IDataSaleOrderLines {
  id: string | null;
  code: string | null;
  productId: string;
  productName: string | null;
  requestQuantity: string | null;
  importQuantity: number | null;
  requestPrice: string | null;
  suggestedPrice: string | null;
  totalPriceNDT: number | null;
  totalPrice: number | null;
  isDelete: boolean | null;
  isDefault: boolean | null;
}

export interface ISumTotalPrice {
  sumTotalPriceNDT: number;
  sumTotalPrice: number;
}
