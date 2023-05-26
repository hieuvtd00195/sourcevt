import { ExpandedState, OnChangeFn, Updater, VisibilityState } from "@tanstack/react-table";

export interface TableRef {
  resetRowSelection: () => void;
  resetRowExpanded: () => void;
  addRowSelection: (index: number) => void;
  toggleEditableRow: (rowId: string, remove?: boolean) => void;
  startRowEditMode: (rowId: string) => void;
  stopRowEditMode: (rowId: string) => void;
  resetEditableRow: () => void;
  getIsSomeRowsEdited: () => boolean;
  arrayCols: any[]
  setExpanded: (updater: Updater<ExpandedState>) => void;
}

export interface TableRefParent {
  onExpandedOpen: () => void;
}

export interface UpdateFieldParent {
  onUpdateRow: (data: any) => void;
}

export interface DragDropRef {
  onOpenDrop: () => void;
}
