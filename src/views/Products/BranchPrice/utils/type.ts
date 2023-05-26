export interface Price {
  retail: string;
  whole: string;
  spa: string;
}

export interface Branch {
  id: string;
  product: string;
  productPrice: Price | null;
  vinh: Price | null;
  phatdat: Price | null;
  hcm: Price | null;
  dn: Price | null;
  th: Price | null;
}
