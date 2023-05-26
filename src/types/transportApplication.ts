export interface IDataShipperTransport {
  code: string | null;
  id: string;
  name: string | null;
  phone: string | null;
  value: string;
}

export interface IUpdateShipperTransport {
  id: string | null;
  code: string | null;
  name: string | null;
  phone: string | null;
}

export interface ITransportByIdParams {
  id: string | null;
}

export interface IDataTransportById {
  [key: string]: any;
}

export interface IUpdateTransport {
  [key: string]: any;
}
