export interface DialogRef<> {
  open: () => void;
  close: () => void;
}

export interface FiltersRef<T = any> {
  reset: () => void;
  submit: () => void;
}
