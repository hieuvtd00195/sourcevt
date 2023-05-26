export interface IInternalDirectoryTable {
  id: number;
  code: string;
  name: string;
  status: string;
  parentId: string;
  creator: string;
  total: string;
  [key: string]: any;
}

export interface IProductPortfolioTable {
  id: number;
  code: string;
  name: string;
  ttbh: string;
  iconUrl: string;
  status: string;
  order: string;
  total: string;
  [key: string]: any;
}
