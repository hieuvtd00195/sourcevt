export interface IInventoryByProductsType {
  code: string;
  barcode: string;
  product: string;
  currentInventory: number;
  totalInventory: number;
  quantityBeginningInventory: number;
  costBeginningInventory: number;
  priceBeginningInventory: number;
  quantityImport: number;
  costImport: number;
  priceImport: number;
  quantityExport: number;
  costExport: number;
  priceExport: number;
  quantityEndingInventory: number;
  costEndingInventory: number;
  priceEndingInventory: number;
}
