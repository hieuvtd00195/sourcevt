export interface ISettingPriceProduct {
  id : number ;
  code: string;
  productsName: string;
  invetoryQuantity: number;
  importPrice: number;
  retailPrice: number;
  cell500: number | null;
  cell300: number | null;
  cell100: number | null;
  spaPrice: number | null;
  price: number;
}
