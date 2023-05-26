export interface UpdateOrderTransport {
  toStoreId: IStoreTo[];
  attachment: IAttachment[];
  [key: string]: any;
}

export interface IStoreTo {
  storeId: string | null;
}

export interface IAttachment {
  id: string | null;
  code: string | null;
  customerName: string | null;
}

export interface TableCreateOrder {
  id: string | null;
  code: string | null;
  customerName: string | null;
}

export interface ICustomerOption {
  [key: string]: any;
}
