export interface IWarehouseTransferBillProducts {
  productId: string;
  quantity: number;
  note?: string | null;
}
export interface IWarehouseTransfer {
  [key: string]: any;
}

export interface IWarehouseTransferBillParams {
  sourceStoreId: string;
  destinationStoreId: string;
  note?: string | null;
  warehouseTransferBillProducts: IWarehouseTransferBillProducts[];
}
