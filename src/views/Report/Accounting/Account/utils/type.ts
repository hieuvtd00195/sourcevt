export interface Balance {
  debit: string;
  credit: string;
}

export interface Account {
  id: string;
  code: string;
  name: string;
  startBalance: Balance | null;
  ariseBalance: Balance | null;
  endBalance: Balance | null;
  startBalance1?: any;
  ariseBalance1?: any;
  endBalance1?: any;
}
