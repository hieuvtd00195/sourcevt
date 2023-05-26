export interface City {
  city: string;
  district: string;
}

export interface Address {
  phone: string;
  address: string;
}

export interface Creator {
  name: string;
  time: string | null;
}

export interface Expire {
  id: number;
  storeName: string;
  storeCode: string;
  city: City;
  address: Address;
  note: string;
  expireDate: string | null;
  visible: boolean;
  creator: Creator;
}
