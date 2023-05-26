import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import type {
  ColumnPinningState,
  ExpandedState,
  OnChangeFn,
  Row,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import ProFormProvider from 'components/ProForm/ProFormProvider';
import useScrollbar from 'hooks/useScrollbar';
import { DispatchWithoutAction, ReactNode, useEffect } from 'react';
import React, {
  ForwardedRef,
  forwardRef,
  Fragment,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { UseFormReturn } from 'react-hook-form';
import TypedObject from 'utils/TypedObject';
import { DENSITY } from './constants';
import EditableCell from './core/EditableCell';
import HeadActions from './core/HeadActions';
import HeaderSortLabel from './core/HeaderSortLabel';
import LoadingOverlay from './core/LoadingOverlay';
import Measurer from './core/Measurer';
import NoRowsOverlay from './core/NoRowsOverlay';
import ToggleFilter from './core/ToggleFilter';
import VisibilityColumns from './core/VisibilityColumns';
import ProTableCell from './ProTableCell';
import type { ProTablePaginationProps } from './ProTablePagination';
import ProTablePagination from './ProTablePagination';
import type { DensitySeverity, ProColumn } from './types';
import type { TableRef } from './types/refs';
import getRowSelections from './utils/getRowSelections';
import { Typography } from '@mui/material';

interface Initialstate<T> {
  hiddenColumns?: (keyof T)[];
  hiddenColumnActions?: boolean;
  hiddenFilterActions?: boolean;
  hiddenVisibilityColumns?: boolean;
}

interface Props<T> {
  pagination?: ProTablePaginationProps;
  data: T[];
  toolBar?: ReactNode;
  rightToolBar?: ReactNode;
  filter?: ReactNode;
  title?: string;
  loading?: boolean;
  columns: ProColumn<T>;
  refetch?: DispatchWithoutAction;
  onSortingChange?: (sortingState: SortingState) => void;
  onRowSelectionChange?: (rowIds: string[]) => void;
  onRowEditableChange?: (rowEditableState: Record<string, boolean>) => void;
  initialstate?: Initialstate<T>;
  expander?: (props: { row: Row<T>; onClose: () => void }) => JSX.Element;
  getRowId?: (row: T, index: number) => string;
  getSubRows?: (row: T, index: number) => T[];
  getRowCanExpand?: (row: Row<T>) => boolean;
  selectValidate?: (oldValue: string[], newValue: string[]) => Promise<boolean>;
  editable?: boolean;
  form?: UseFormReturn<any, any>;
  size?: DensitySeverity;
  totalRow?: React.ReactElement;
  hideFooter?: boolean;
  totalRowBellowFooter?: React.ReactElement;
  titleFunction?: {
    display: boolean;
    title: ReactNode;
  };
}

const ProTable = <T extends object>(
  props: Props<T>,
  tableRef: ForwardedRef<TableRef>
) => {
  const {
    toolBar,
    rightToolBar,
    filter,
    titleFunction,
    data,
    pagination,
    loading,
    columns,
    // refetch,
    onSortingChange,
    onRowSelectionChange,
    onRowEditableChange,
    expander,
    selectValidate,
    getRowId,
    getSubRows,
    getRowCanExpand,
    editable,
    size,
    form,
    initialstate = {
      hiddenColumns: [],
      hiddenColumnActions: true,
      hiddenFilterActions: true,
      hiddenVisibilityColumns: false,
    },
    totalRow,
    totalRowBellowFooter,
    hideFooter,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollbar = useScrollbar();
  const [stickyHeader] = useState<boolean>(true);
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [density] = useState<DensitySeverity>(size || DENSITY.default);
  const [arrayCols, setArrayCols] = useState<any[]>([]);

  const [hiddenFilterActions] = useState<boolean>(() => {
    const { hiddenFilterActions } = initialstate;
    if (typeof hiddenFilterActions === 'boolean') {
      return hiddenFilterActions;
    }
    return true;
  });
  const [hiddenVisibilityColumns] = useState<boolean>(() => {
    const { hiddenVisibilityColumns } = initialstate;
    if (typeof hiddenVisibilityColumns === 'boolean') {
      return hiddenVisibilityColumns;
    }
    return true;
  });

  // Selection state
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Visibility state
  const [columnVisibility, onColumnVisibilityChange] =
    useState<VisibilityState>(() => {
      const hiddenColumns = initialstate.hiddenColumns as string[];
      return hiddenColumns.reduce<VisibilityState>((acc, column) => {
        acc[column] = false;
        return acc;
      }, {});
    });

  const [hiddenColumnActions] = useState<boolean>(() => {
    const { hiddenColumnActions } = initialstate;
    if (typeof hiddenColumnActions === 'boolean') {
      return hiddenColumnActions;
    }
    return true;
  });

  // Sorting state
  const [sorting, setSorting] = useState<SortingState>([]);

  // Pinning state
  const [columnPinning, onColumnPinningChange] = useState<ColumnPinningState>({
    left: [],
    right: [],
  });

  // Expanded state
  const [expanded, setExpanded] = useState<ExpandedState>({});
  

  // Editable state
  const [editableRows, setEditableRows] = useState<Record<string, boolean>>({});

  const refCols = useRef<any>();

  // Handle sorting
  const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    new Promise<SortingState>((resolve) => {
      setSorting((state) => {
        const updatedState =
          typeof updaterOrValue === 'function'
            ? updaterOrValue(state)
            : updaterOrValue;
        resolve(updatedState);
        return updatedState;
      });
    }).then((state) => {
      onSortingChange?.(state);
    });
  };

  // Handle row selection
  // const handleRowSelectionChange: OnChangeFn<RowSelectionState> = (
  //   updaterOrValue
  // ) => {
  //   new Promise<RowSelectionState>((resolve) => {
  //     setRowSelection((state) => {
  //       const updatedState =
  //         typeof updaterOrValue === 'function'
  //           ? updaterOrValue(state)
  //           : updaterOrValue;
  //       resolve(updatedState);
  //       return updatedState;
  //     });
  //   }).then((state) => {
  //     onRowSelectionChange?.(getRowSelections(state));
  //   });
  // };
  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = (
    updaterOrValue
  ) => {
    new Promise<RowSelectionState>(async (resolve) => {
      const update =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(rowSelection)
          : updaterOrValue;

      const validatedState = selectValidate
        ? (await selectValidate(
            getRowSelections(rowSelection),
            getRowSelections(update)
          ))
          ? update
          : rowSelection
        : update;

      setRowSelection((state) => {
        resolve(validatedState);
        return validatedState;
      });
    }).then((state) => {
      onRowSelectionChange?.(getRowSelections(state));
    });
  };

  // Handle edit mode
  const handleToggleEditableRow = (rowId: string) => {
    new Promise<Record<string, boolean>>((resolve) => {
      setEditableRows((state) => {
        if (rowId in editableRows) {
          const { [rowId]: removed, ...updatedState } = state;
          resolve(updatedState);
          return updatedState;
        } else {
          const updatedState = { ...state, [rowId]: true };
          resolve(updatedState);
          return updatedState;
        }
      });
    }).then((state) => {
      onRowEditableChange?.(state);
    });
  };

  const handleStartRowEditMode = (rowId: string) => {
    new Promise<Record<string, boolean>>((resolve) => {
      setEditableRows((state) => {
        const updatedState = { ...state, [rowId]: true };
        resolve(updatedState);
        return updatedState;
      });
    }).then((state) => {
      onRowEditableChange?.(state);
    });
  };

  const handleStopRowEditMode = (rowId: string) => {
    new Promise<Record<string, boolean>>((resolve) => {
      setEditableRows((state) => {
        const { [rowId]: removed, ...updatedState } = state;
        resolve(updatedState);
        return updatedState;
      });
    }).then((state) => {
      onRowEditableChange?.(state);
    });
  };

  const handleGetIsEdited = (rowId: string) => {
    return rowId in editableRows;
  };

  const getIsSomeRowsEdited = () => {
    return TypedObject.isExist(editableRows);
  };

  const table = useReactTable<T>({
    columns,
    data,
    state: {
      sorting,
      expanded,
      columnPinning,
      rowSelection,
      columnVisibility,
    },
    defaultColumn: {
      cell: (context) => <EditableCell<T> context={context} />,
    },
    getRowId,
    onSortingChange: handleSortingChange,
    onRowSelectionChange: handleRowSelectionChange,
    onColumnVisibilityChange,
    onColumnPinningChange,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows,
    getRowCanExpand,
    enablePinning: true,
    enableHiding: true,
    enableSorting: true,
    enableRowSelection: true,
    enableMultiSort: false,
    meta: {
      editableRows,
      toggleEditableRow: handleToggleEditableRow,
      startRowEditMode: handleStartRowEditMode,
      stopRowEditMode: handleStopRowEditMode,
      getIsEdited: handleGetIsEdited,
      getIsSomeRowsEdited: getIsSomeRowsEdited,
    },
  });

  const {
    getHeaderGroups,
    getRowModel,
    getFooterGroups,
    resetRowSelection,
    resetExpanded,
  } = table;

  const handleExpandFilter = () => {
    setCollapsed(!collapsed);
  };

  // const handleChangeDensity = (density: DensitySeverity) => {
  //   setDensity(density);
  // };
  // console.log(table.getRow(), 'expanded');
  const handleAddRowSelection = (index: number) => {
    new Promise<RowSelectionState>((resolve) => {
      setRowSelection((state) => {
        const updatedState = { ...state, [index]: true };
        resolve(updatedState);
        return updatedState;
      });
    }).then((state) => {
      onRowSelectionChange?.(getRowSelections(state));
    });
  };

  const handleResetRowSelection = () => {
    resetRowSelection(true);
    onRowSelectionChange?.([]);
  };

  const handleResetRowExpanded = () => {
    resetExpanded(true);
  };

  const handleResetEditableRow = () => {
    setEditableRows({});
  };

  useEffect(() => {
    if (table) {
      const arrCols: any[] = [];
      table
        .getAllLeafColumns()
        .filter((column) => !['index', 'actions'].includes(column.id))
        .forEach((col) => {
          arrCols.push(col);
        });
      setArrayCols(arrCols);
    }
  }, [table]);

  useImperativeHandle(tableRef, () => ({
    resetRowSelection: handleResetRowSelection,
    resetRowExpanded: handleResetRowExpanded,
    addRowSelection: handleAddRowSelection,
    toggleEditableRow: handleToggleEditableRow,
    startRowEditMode: handleStartRowEditMode,
    stopRowEditMode: handleStopRowEditMode,
    resetEditableRow: handleResetEditableRow,
    getIsSomeRowsEdited: getIsSomeRowsEdited,
    onColumnVisibilityChange: onColumnVisibilityChange,
    arrayCols,
    setExpanded,
  }));

  return (
    <Paper
      elevation={12}
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto auto minmax(0, 1fr) auto',
        height: 1,
      }}
    >
      <Collapse in={collapsed} timeout="auto">
        {filter}
      </Collapse>

      <Box>
        {titleFunction?.display && <Box>{titleFunction.title}</Box>}
        <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Stack direction="row" spacing={1}>
            {toolBar}
          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          {(!hiddenVisibilityColumns || !hiddenFilterActions) && (
            <Stack direction="row" spacing={1}>
              {!hiddenVisibilityColumns && <VisibilityColumns table={table} />}
              {!hiddenFilterActions && (
                <ToggleFilter
                  expanded={collapsed}
                  onExpand={handleExpandFilter}
                />
              )}
            </Stack>
          )}
          <Stack direction="row" spacing={1} sx={{ mr: 7 }}>
            {rightToolBar}
          </Stack>
        </Box>
      </Box>
      <ProFormProvider form={form}>
        <TableContainer
          ref={containerRef}
          sx={{
            height: 1,
            width: 1,
            // overflow: 'auto',
            position: 'relative',
            // ...scrollbar,
          }}
        >
          <LoadingOverlay visible={loading} />
          <NoRowsOverlay visible={!loading && pagination?.total === 0} />
          <Table
            stickyHeader={stickyHeader}
            size={
              [DENSITY.default, DENSITY.dense].includes(density)
                ? 'small'
                : 'medium'
            }
            // sx={{
            //   minWidth: 'max-content',
            //   position: 'absolute',
            //   top: 0,
            //   left: 0,
            //   right: 0,
            //   bottom: 0,
            //   border: 1,
            //   borderBottom: 0,
            //   borderColor: 'divider',
            // }}
          >
            <TableHead>
              {getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const offset = header.getStart();
                    const width = header.getSize();
                    const maxWidth = header.column.columnDef.maxSize;
                    const minWidth = header.column.columnDef.minSize;
                    const align = header.column.columnDef.meta?.align;
                    return (
                      <ProTableCell
                        key={header.id}
                        header
                        colSpan={header.colSpan}
                        fixed={header.column.getIsPinned()}
                        align={align}
                        sortDirection={header.column.getIsSorted()}
                        sx={{ width, maxWidth, minWidth }}
                        offset={offset}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent:
                              align === 'center' ? 'center' : 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <HeaderSortLabel header={header} />
                          <HeadActions
                            hidden={hiddenColumnActions}
                            header={header}
                          />
                        </Box>
                      </ProTableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableHead>
            <TableBody sx={{ border: 1, borderColor: 'divider' }}>
              {getRowModel().rows.map((row) => {
                const selected = editable ? false : row.getIsSelected(); // Remove bground
                const expanded = row.getIsExpanded();

                return (
                    <TableRow key={row.id} hover tabIndex={-1} selected={selected}>
                      {row.getVisibleCells().map((cell, index) => {
                            let keyNameofSubRow: any = [];
                            const subRow = cell.row.subRows;
                        const offset = cell.column.getStart();
                        const fixed = cell.column.getIsPinned();
                        const align = cell.column.columnDef.meta?.align;
                        const rowSpan = cell.column.columnDef.meta?.rowSpan?.(
                          cell.getContext(),
                          getRowModel().rows
                        );
                        for (const element of subRow) {
                          Object.keys(element?.original).forEach(function (
                            key
                          ) {
                            // if (key !== 'priceProduct')
                            keyNameofSubRow[key] = key;
                          });
                        }
                        if (rowSpan === null) {
                          return null;
                        }

                        return (
                          <ProTableCell
                            key={cell.id}
                            fixed={fixed}
                            align={align}
                            selected={selected}
                            offset={offset}
                            rowSpan={rowSpan}
                            // typeMultipe={cell.column.id ===  keyNameofSubRow[cell.column.id] ? true : false}

                            sx={{
                              width: cell.column.getSize(),
                              ...(expanded &&
                                index === 0 && {
                                  '&:after': {
                                    position: 'absolute',
                                    content: '" "',
                                    top: 0,
                                    left: 0,
                                    // backgroundColor: 'primary.main',
                                    width: 3,
                                    height: 'calc(100% + 1px)',
                                  },
                                }),
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </ProTableCell>
                        );
                      })}
                    </TableRow>

                );
              })}
              {totalRow}
            </TableBody>
            {!hideFooter && (
              <TableFooter>
                {getRowModel().rows.length > 0
                  ? getFooterGroups().map((footerGroup) => (
                      <TableRow key={footerGroup.id}>
                        {footerGroup.headers.map((header) => {
                          const align = header.column.columnDef.meta?.align;

                          const colSpan =
                            header.column.columnDef.meta?.colSpan?.(
                              header.getContext(),
                              getRowModel().rows
                            );

                          if (colSpan === null) {
                            return null;
                          }

                          return (
                            <ProTableCell
                              key={header.id}
                              offset={0}
                              align={align}
                              colSpan={colSpan}
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.footer,
                                    header.getContext()
                                  )}
                            </ProTableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  : null}
                {totalRowBellowFooter}
              </TableFooter>
            )}
          </Table>
        </TableContainer>
      </ProFormProvider>
      {pagination && <ProTablePagination {...pagination} />}
    </Paper>
  );
};

export default forwardRef(ProTable);
