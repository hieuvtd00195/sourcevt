export interface TableCreateEntry {
  [key: string]: any;
}

export interface AttachmentList {
  base64: string | null;
  fileName: string | null;
  contentType: string | null;
  extensions: string | null;
}

export interface ParamsCreateEntry {
  [key: string]: any;
}

export interface TableFormValuesObjectEntry<T> {
  form: T[];
  [key: string]: any;
}
