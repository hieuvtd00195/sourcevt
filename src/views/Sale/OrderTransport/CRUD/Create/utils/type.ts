export interface CreateOrderTransport {
  fromStoreId: string | null;
  toStoreId: CreateStoreTo[];
  customerId: string | null;
  customerName: string;
  isWarehouseTransfer: boolean;
  transportForm: number | null;
  status?: number | null;
  transportId?: string | null;
  transportName: string;
  transportPhoneNumber: string | null;
  carrierWay: number;
  attachment: any;
  note: string;
  idOrder?: string | null;
  customerNameOrders: string | null;
}

export interface CreateStoreTo {
  storeId?: string | null;
}

export interface TableCreateOrder {
  [key: string]: any;
}
