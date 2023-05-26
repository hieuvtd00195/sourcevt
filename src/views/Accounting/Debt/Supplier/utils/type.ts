export interface DebtSupplier {
  id: number;
  supplier: string;
  collectOpeningBalance: number;
  giveOpeningBalance: number;
  collectArising: number;
  giveArising: number;
  collectEndingBalance: number;
  giveEndingBalance: number;
}
