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
export interface IImportExport {
  [key: string]: any;
}

export interface IImportTable {
  [key: string]: any;
}
