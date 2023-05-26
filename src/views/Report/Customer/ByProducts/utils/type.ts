export interface Customer {
  name: string;
  phone: string;
}

export interface ByProduct {
  id: number;
  customer?: Customer;
  product: string;
  price: string;
  sellNumber: string;
  return: string;
  discount: string;
  revenue: string;
  costPrice: string;
  profit: string;
  purchaseDate: string | null;
}
