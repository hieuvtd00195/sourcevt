import { yupResolver } from '@hookform/resolvers/yup';
import LoopIcon from '@mui/icons-material/Loop';
import { Grid, InputAdornment, Typography } from '@mui/material';
import ActionButton from 'components/ProButton/ActionButton';
import DialogContainer from 'components/ProDialog/DialogContainer';
import DialogContent from 'components/ProDialog/DialogContent';
import DialogFooter from 'components/ProDialog/DialogFooter';
import ProForm from 'components/ProForm';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { ForwardedRef, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { UseFieldArrayUpdate, useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import sleep from 'utils/sleep';
import TypedObject from 'utils/TypedObject';
import Validation from 'utils/Validation';
import useTableColumns from './TableColumns';
import { useSelector } from 'react-redux';
import { getProductDropListStore } from 'slices/billCustomerApplicationSlice';
import ProFormMultiAutocomplete from 'components/ProTable/core/EditableCell/ProFormMultiAutocomplete';
import { nanoid } from '@reduxjs/toolkit';
import { TableRef, UpdateFieldParent } from 'components/ProTable/types/refs';

interface FormValues {
  note: string;
  search: string;
}
interface TableCreateProducts {
  [key: string]: any;
}
const DATA = [
  {
    id: 1,
    inDebt: false,
    product: 'Sản phẩm',
    amount: 1,
    price: 20000,
  },
  {
    id: 2,
    inDebt: false,
    product: 'Sản phẩm',
    amount: 1,
    price: 20000,
  },
  {
    id: 3,
    inDebt: false,
    product: 'Sản phẩm',
    amount: 1,
    price: 20000,
  },
];

const schema = Validation.shape({
  // note: Validation.string(),
});

interface Props {
  open: boolean;
  onClose: () => void;
  value: any;
}

const ActionProductDialog = (
  props: Props,
) => {
  const [, refetch] = useRefresh();
  const { open, onClose, value } = props;
  const productName = value?.row?.original?.productName;
  const productId = value?.row?.original?.productId;
  const rowIndex = value?.row?.index;

  const tableRef = useRef<TableRef>(null);
  const listDropProducts = useSelector(getProductDropListStore);
  const [selectedChildProduct, setSelectedChildProduct] = useState<
    TableCreateProducts[]
  >([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { t } = useTranslation();
  const [banners] = useState<any>(DATA);
  const [loading] = useState<boolean>(false);
  const [total] = useState<number>(banners.length || 0);
  const [filters] = useState<any>({
    pageNumber: 1,
    pageSize: 25,
  });

  const form = useFormContext();
  const { fields, append, update, replace, remove } = useFieldArray({
    control: form.control,
    name: 'productBonus',
    keyName: 'rowsubId',
  });

  const handleReset = async () => {
    onClose();
    remove();
  };

  const handleAddSubProduct = () => {
    const formatList: any = [];
    let arr: any = [];
    const finishArr: any = [];
    let newArrAppend: any = [];
    const row = form.getValues(`form.${rowIndex}`);
    const formData = form.watch('form');
    selectedChildProduct.forEach((item: any) => {
      formatList[item.productId] = item;
    });
    fields.map((item: TableCreateProducts, index: any) => {
      if (formatList[item.productId] && item.productId === formatList[item.productId].productId) {
        arr.push({
          productId: item.productId,
          quantity: Number(item.quantity),
          isDebt: true,
        });
      } else {
        arr.push({
          productId: item.productId,
          quantity: Number(item.quantity),
          isDebt: false,
        });
      }
    });
    for (const key in formData) {
      if (Object.prototype.hasOwnProperty.call(formData, key)) {
        const element = formData[key];
        if(element.productId === productId){
          newArrAppend.push({
           ...element,
           productBonus: arr,
          });
         
        }else{
          newArrAppend.push({
            ...element
           });
        }
      }
    }
    form.reset({...form.watch(),form: newArrAppend})
    refetch();
    onClose();
  };

  const handleRemoveRow = useCallback(
    (rowIndex: number, rowId: string) => () => {
      remove(rowIndex);

      tableRef.current?.stopRowEditMode(rowId);
    },
    [remove]
  );

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
    onDelete: handleRemoveRow,
  });
  const handleRowEditableChange = (
    rowEditableState: Record<string, boolean>
  ) => {
    const isEditing = TypedObject.isExist(rowEditableState);
    setIsEditing(isEditing);
    refetch();
  };

  const onSelectProduct = (value: string[] | null) => {
    let selected = listDropProducts.filter((item: any) =>
      (value || '').includes(item.productId)
    );

    const rowId = nanoid();
    const rows: TableCreateProducts[] = selected.reduce(
      (acc: TableCreateProducts[], product: TableCreateProducts) => {
        acc.push({
          id: rowId,
          productId: product.productId,
          productName: product.productName,
          inventory: product.inventory,
          price: product.salePrice,
          isDebt: false,
          quantity: '1',
        });
        return acc;
      },
      []
    );
    append(rows);
    tableRef.current?.startRowEditMode(rowId);
  };
  const handleRowSelectionChange = (rowIds: string[]) => {
    const selectID = rowIds.map(String);
    setSelectedChildProduct((state) => {
      return selectID.reduce<TableCreateProducts[]>((acc, subProductId) => {
        const selected = fields.find((subP: any) => subP.id === subProductId);
        const exist = state.find((subP) => subP.id === subProductId);
        if (exist) {
          acc.push(exist);
        } else if (selected) {
          acc.push(selected);
        }
        return acc;
      }, []);
    });
    // setListProductId([...new Set([...listProductId, ...selectID])]);
  };


  return (
    <DialogContainer open={open} onClose={handleReset} maxWidth="xl">
      <DialogContent>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 'medium',
            mb: 2,
            padding: '10px',
          }}
        >
          Thao tác với sản phẩm: {productName}
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            Thêm quà tặng
          </Grid>
          <Grid item xs={9}>
            <ProFormMultiAutocomplete
              name="productId"
              options={listDropProducts}
              renderValue={(item) => item.productId}
              renderLabel={(item) => `${item.productName}`}
              placeholder={'Tên sản phẩm(*)'}
              onSelect={onSelectProduct}
              sx={{
                '.MuiInputBase-input': { fontSize: 14, cursor: 'pointer' },
              }}
            />
          </Grid>
          <Grid item xs={12} minHeight={300}>
            <ProTable<any>
              title="Danh sách"
              loading={loading}
              columns={columns}
              ref={tableRef}
              data={fields}
              refetch={refetch}
              initialstate={{
                hiddenColumns: [],
                hiddenVisibilityColumns: true,
              }}
              onRowEditableChange={handleRowEditableChange}
              onRowSelectionChange={handleRowSelectionChange}
              getRowId={(row) => row.id}
              editable
              hideFooter
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 'medium',
              }}
            >
              Ghi chú
            </Typography>
            <ProFormTextField name="noteForProductBonus" placeholder="" multiline rows={6} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogFooter>
        <ActionButton actionType="cancel" onClick={handleReset}>
          {t('Đóng')}
        </ActionButton>
        <ActionButton onClick={() => handleAddSubProduct()}>Chọn</ActionButton>
      </DialogFooter>
    </DialogContainer>
  );
};

export default  ActionProductDialog;
