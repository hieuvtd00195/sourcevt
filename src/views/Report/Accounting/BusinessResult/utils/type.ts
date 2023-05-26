export interface Value {
  value: string;
  type: 'positive' | 'negative';
}

export interface BusinessResult {
  id: string;
  target: string;
  value: Value;
  revenue: Value;
  description: string;
}
