import type { ColumnDef, SortingState } from '@tanstack/react-table';

export type ProColumn<D, V = any> = ColumnDef<D, V>[];

export type DensitySeverity = 'default' | 'normal' | 'dense';

export type HeadAction =
  | 'hide'
  | 'pinLeft'
  | 'pinRight'
  | 'unpin'
  | 'unsort'
  | 'asc'
  | 'desc';

export type HeadCell<T> = {
  [Key in keyof T]?: string;
} & {
  index?: string;
  actions?: string;
  [key: string]: any;
};

export type ProTableSortingState = SortingState;

export interface TableKeyName {
  index: number;
  name: string;
}

// export interface TableFormValues<T> {
//   form: T[];
// }

export interface TableFormValuesObject<T> {
	transactionDate: Date | null,
	ticketType: number |string | null,
	documentCode:string | null,
	audienceCode: string | null,
	audienceType:number | null,
	note:string | null,
	entryAccounts:T[],
	imageUrls: string| null;
  }
  