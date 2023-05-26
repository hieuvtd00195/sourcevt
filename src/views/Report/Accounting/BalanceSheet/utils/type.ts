export interface Value {
  value: string;
  type: 'positive' | 'negative';
}

export interface BalanceSheet {
  id: string;
  assets: string;
  code: string;
  thisPeriod: Value | null;
  lastPeriod: Value | null;
}
