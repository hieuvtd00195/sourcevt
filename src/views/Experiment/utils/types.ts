export interface Bill {
  id: string;
  createdBy: string;
  store: string;
  customer: string;
  products: string[];
  price: string;
}

export interface FlattenedBill {
  id: string;
  createdBy: string;
  store: string;
  customer: string;
  product: string;
  price: string;
}
