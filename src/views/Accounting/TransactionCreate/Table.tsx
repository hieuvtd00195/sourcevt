import { Box } from '@mui/system';
import CancelIcon from '@mui/icons-material/Cancel';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import EditableCell from 'components/ProTable/core/EditableCell';
import Validation from 'utils/Validation';
import { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { Fragment, useMemo } from 'react';
import { TableCreateEntry } from './utils/entryCreate';
import useDialog from 'hooks/useDialog';
import Regexs from 'utils/Regexs';
import { Stack } from '@mui/material';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProInputAdornment from 'components/ProForm/ProInputAdornment';
import { PriceDecimalInput, PriceInput } from 'plugins/NumberFormat';
import ProFormDependency from 'components/ProForm/ProFormDependency';
import Selection from 'components/ProTable/components/Selection';
import ProFormAutocompleteSingal from 'components/ProForm/ProFormAutocompleteSingal';
import { FieldValues } from 'react-hook-form';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import EditTableCellValueInput from 'components/ProTable/core/EditTableCellValueInput';
import EditableCellNotSubRows from 'components/ProTable/core/EditTableCellValueInput/EditableCellNotSubRows';

const columnHelper = getColumnHelper<TableCreateEntry>();

const HEAD_CELLS: HeadCell<TableCreateEntry> = {
  debtAccountCode: 'TK Nợ',
  creditAccountCode: 'TK Có',
  amountVnd: 'Tiền VND',
  amountCny: 'Tiền NDT',
  documentCode: 'Chứng từ',
  note: 'Ghi chú',
  selection: 'selection',
};

interface Props {
  pageNumber: number;
  pageSize: number;
  onDelete: (rowIndex: number, rowId: string) => () => void;
  onUpdate: (rowIndex: number, rowId: string) => () => Promise<void>;
  onCancel: (rowIndex: number, rowId: string) => () => void;
  disabled: string[];
  checkTypeCurrency: number | null;
  hiddenColumns: string[];
  dataPaymentAccount: any[];
}

const useTable = (props: Props) => {
  const {
    pageNumber,
    pageSize,
    onDelete,
    onUpdate,
    onCancel,
    disabled,
    checkTypeCurrency,
    hiddenColumns,
    dataPaymentAccount,
  } = props;
  const dialog = useDialog();
  const columns: ProColumn<TableCreateEntry> = useMemo(() => {
    return [
      // Index<TableCreateEntry>(pageNumber, pageSize),
      // Selection<any>(pageNumber,),
      columnHelper.accessor('debtAccountCode', {
        id: 'debtAccountCode',
        enableSorting: false,
        header: () => HEAD_CELLS.debtAccountCode,
        cell: (context) => {
          const value = context.getValue<string>();
          return (
            <EditableCell
              context={context}
              typeAutoComplete={true}
              FormAutocompleteProps={{
                // placeholder: 'Tài khoản Nợ'}
                options: dataPaymentAccount,
                renderLabel: (option) => `${option?.name} - ${option?.code}`,
                renderValue: (option) => option?.code,
              }}
            />
            // <ProFormAutocompleteSingal<FieldValues, string>
            //   name="debtAccountCode"
            //   placeholder={'Tài khoản Nợ'}
            //   options={dataPaymentAccount}
            //   renderLabel={(option) => `${option?.name} - ${option?.code}`}
            //   renderValue={(option) => option?.code}
            // />
          );
        },
        meta: {
          title: HEAD_CELLS.debtAccountCode,
          editable: (order) => !disabled.includes(order.id),
          type: 'select',
        },
      }),
      columnHelper.accessor('creditAccountCode', {
        id: 'creditAccountCode',
        header: () => HEAD_CELLS.creditAccountCode,
        cell: (context) => {
          const value = context.getValue<string>();
          return (
            <EditableCell
              context={context}
              typeAutoComplete={true}
              FormAutocompleteProps={{
                // placeholder: 'Tài khoản Nợ'}
                options: dataPaymentAccount,
                renderLabel: (option) => `${option?.name} - ${option?.code}`,
                renderValue: (option) => option?.code,
              }}
            />
          );
        },
        meta: {
          title: HEAD_CELLS.creditAccountCode,
          editable: true,
          type: 'select',
        },
      }),

      columnHelper.accessor('amountVnd', {
        id: 'amountVnd',
        header: () => HEAD_CELLS.amountVnd,
        cell: (context) => {
          const rowIndex = context.row.index;
          const CNY = `form.${rowIndex}.amountCny`;

          return (
            <ProFormDependency fields={[CNY]}>
              {(values) => {
                const { [CNY]: amountCny } = values;
                const amountCnyasNumber = Number(amountCny);
                return (
                  <EditableCellNotSubRows
                    context={context}
                    disable={amountCnyasNumber ? true : false}
                    FormTextFieldProps={{
                      InputProps: {
                        endAdornment: (
                          <ProInputAdornment>VND</ProInputAdornment>
                        ),
                        inputComponent: PriceDecimalInput,
                      },
                    }}
                  />
                );
              }}
            </ProFormDependency>
          );
        },
        meta: {
          title: HEAD_CELLS.amountVnd,
          editable: true,
          type: 'text',
        },
      }),

      columnHelper.accessor('amountCny', {
        id: 'amountCny',
        header: (context) => {
          return HEAD_CELLS.amountCny;
        },
        cell: (context) => {
          const rowIndex = context.row.index;
          const VND = `form.${rowIndex}.amountVnd`;

          return (
            <ProFormDependency fields={[VND]}>
              {(values) => {
                const { [VND]: amountVnd } = values;
                const amountVndasNumber = Number(amountVnd);
                return (
                  <EditableCellNotSubRows
                    context={context}
                    disable={amountVndasNumber ? true : false}
                    FormTextFieldProps={{
                      InputProps: {
                        endAdornment: (
                          <ProInputAdornment>CNY</ProInputAdornment>
                        ),
                        inputComponent: PriceDecimalInput,
                      },
                    }}
                  />
                );
              }}
            </ProFormDependency>
          );
        },
        meta: {
          title: HEAD_CELLS.amountCny,
          editable: true,
          type: 'text',
        },
      }),

      //   columnHelper.accessor('documentCode', {
      //     id: 'documentCode',
      //     header: () => HEAD_CELLS.documentCode,
      //     cell: (context) => {
      //       const value = context.getValue<string>() || '';
      //       return <EditableCell context={context} FormTextFieldProps={{}} />;
      //     },
      //     meta: {
      //       title: HEAD_CELLS.documentCode,
      //       editable: true,
      //       type: 'text',
      //     },
      //   }),

      columnHelper.accessor('note', {
        id: 'note',
        header: () => HEAD_CELLS.note,
        cell: (context) => {
          const value = context.getValue<string>() || '';
          return <EditableCell context={context} FormTextFieldProps={{}} />;
        },
        meta: {
          title: HEAD_CELLS.note,
          editable: true,
          type: 'text',
        },
      }),
      {
        id: 'actions',
        size: 65,
        enableSorting: false,
        header: () => <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />,
        cell: (context) => {
          const handleClickShowPopup = () => {
            onDelete(context.row.index, context.row.original.id);
          };

          return (
            <CancelIcon
              onClick={onDelete(context.row.index, context.row.original.id)}
            />
          );
        },
        meta: {
          title: HEAD_CELLS.actions,
          align: 'center',
        },
      },
    ];
  }, [
    pageNumber,
    pageSize,
    onDelete,
    onUpdate,
    onCancel,
    dialog,
    disabled,
    checkTypeCurrency,
    hiddenColumns,
    dataPaymentAccount,
  ]);
  return { columns };
};
export default useTable;
