export interface DebtAccount {
  code: string | null;
  amount: number | null;
}
export interface TableCreateOrder {
  id: string | null;
  code: string | null;
  productId: string;
  productName: string | null;
  requestQuantity: string | null;
  importQuantity: number | null;
  requestPrice: string | null;
  suggestedPrice: string | null;
  totalYuan: number | null;
  note: string | null;
  rate?: string | null;
  total?: string | null;
  name?: string | null;
}
export interface SaleOrder {
  id: string | null;
  code: string | null;
  storeId: string | null;
  storeName: string | null;
  supplierId: string | null;
  supplierName: string | null;
  invoiceNumber: string | null;
  orderDate: Date | string | null;
  totalProduct: number;
  totalQuantity: number ;
  totalPriceNDT: number ;
  totalPrice: number;
  creatorId: string | null;
  creatorName: string | null;
  status: number | null;
  isConfirm: boolean;
  note: string | null;
  totalApprove: number | null;
  rate: number | null;
  packageRes: string | null;
  saleOrderLineDetailDtos: saleOrderLineDetail[];

}
interface saleOrderLineDetail {
  id: string | null;
  code: string | null;
  productId: string;
  productName: string | null;
  requestQuantity: string | null;
  importQuantity: number | null;
  requestPrice: string | null;
  suggestedPrice: string | null;
  totalYuan: number | null;
  note: string | null;
}

export interface ResponseTypeSaleOrder {
  total: number;
  data: SaleOrder[];
}

export interface ISaleOrderlines {
  productId: string;
  requestQuantity: number;
  requestPrice: number;
  suggestedPrice: number;
}
export interface ISaleOrderParams {
  supplierId: string;
  storeId: string;
  invoiceNumber: string;
  orderDate: Date;
  rate: number;
  note: string;
  saleOrderlines: ISaleOrderlines[];
}

export interface IResponseSaleOrder {
  id: string | null;
  code: string | null;
  storeId: string | null;
  storeName: string | null;
  supplierId: string | null;
  supplierName: string | null;
  invoiceNumber: string | null;
  orderDate: Date | string | null;
  totalProduct: number;
  totalQuantity: number;
  totalPriceNDT: number;
  totalPrice: number;
  creatorId: string | null;
  creatorName: string | null;
  status: number | null;
  isConfirm: boolean;
  note: string | null;
  rate: number | null;
  totalApprove: number | null;
  packageRes: string | null;
  saleOrderLineDetailDtos: TableCreateOrder[];
}

export interface IUpdateSaleOrder {
  id: string | null;
  package: number | null;
  invoiceNumber: string | null;
  orderDate: Date | string | null;
  note: string | null;
  saleOrderLines: SaleOrderLines[];
}

export interface SaleOrderLines {
  id: string | null;
  productId: string;
  requestQuantity: number;
  requestPrice: number;
  suggestedPrice: number;
  isDelete: boolean;
}

export interface ConfirmSaleOrderDetail {
  [key: string]: any;
}