export interface Product {
  id: string;
  hasPicture: string;
  barCode: string;
  proudctCode: string;
  proudctName: string;
  costPrice: string;
  spaPrice: string;
  salePrice: string;
  entryPrice: string;
  inventory: string;
  totalInventory: string;
  delivery: string;
  inStock: string;
  temporarilyHold: string;
  sellNumber: string;
  sellStatus: string;
}

export interface ProductParams {
  [key: string]: any;
}
