export interface IHistory {
  [key: string]: any;
}

export interface IStoreOptions {
  value: string;
  label: string;
}

export interface IHistoryDetail {
  fromValue: IValue;
  toValue: IValue;
}

interface IValue {
  BillDiscountAmount?: number | null;
  LastModificationTime?: Date | string | null;
  LastModifierId?: string | null;
  Note?: string | null;
  TotalPrice?: number | null;
  TotalPriceBeforeTax?: number | null;
  TotalPriceProduct?: number | null;
  VATAmount?: number | null;
  VATBillCode?: string | null;
  VATType?: number | null;
  Products?: Products[];
  BankPaymentAccountCode?: string | null;
  CashPaymentAccountCode?: string | null;
  AudienceName?: string | null;
  AudiencePhone?: string | null;
  BankPaymentAmount?: string | null;
  CashPaymentAmount?: string | null;
  VATBillDate?: string | null;
  SalerId?: string | null;
}

export interface Products {
  DiscountAmount: number | null;
  DiscountType: number | null;
  Note: string | null;
  Price: number | null;
  ProductCode: string | null;
  ProductId: string | null;
  ProductName: string | null;
  ProductStockQuantity: number | null;
  Quantity: number | null;
  TotalPrice: number | null;
  TotalPriceBeforeDiscount: number | null;
  Unit: number | null;
  UnitName: string | null;
  UpdatedStockQuantity: number | null;
  WarehousingBillId: string | null;
  VatType?: number | null;
  VatAmount?: number | null;
}
