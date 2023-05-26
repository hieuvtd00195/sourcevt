export interface AddCash {
  date: Date | null;
  objectType: number | null;
  cashAccount: number | null;
  billType: number | null;
  object: string;
  documentType: number | null;
  documentId: string;
  amount: string;
  note: string;
}
export interface TableCreateOrder {
  id: string,
  productId: string,
  requestQuantity: number | null,
  requestPrice: number | null,
  suggestedPrice: number | null,
  rate?: number | null,
  total?: number | null,
  code?: string,
  name?: string,
}

export interface IProduct {
  id: string;
  name: string;
  code: string;
}

export interface IStore {
  id?: string,
  value: string;
  label: string;
}
export interface ISupplier {
  id?: string,
  value: string;
  label: string;
}


export interface IResponseStore {
  id: string,
  code: string;
  name: string;
}

export interface IResponseSupplier {
  id: string,
  code: string;
  name: string;
}

export interface Accumulator {
  [key: string]: IProduct;
}


export interface AddOrder<TableCreateOrder> {
  supplierId: number,
  storeId: number,
  invoiceNumber: number,
  orderDate: Date | null,
  rate: number,
  note: string | null,
  form: TableCreateOrder[],
}

export interface DataAddOrder<TableCreateOrder> {
  form: TableCreateOrder[],
  invoiceNumber: string,
  note: string,
  orderDate: Date,
  productId?: string[],
  rate: number,
  storeId: string,
  supplierId: string,
}

export interface ProductList {
  id: number;
  productId: string,
  image: string;
  requestQuantity: number;
  requestPrice: number;
  suggestedPrice: number;
  rate: number;
  total: number;
}

