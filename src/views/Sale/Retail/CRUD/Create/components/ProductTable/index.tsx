import Box from '@mui/material/Box';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import {
  DispatchWithoutAction,
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import ActionProductDialog from './Dialog/ActionProductDialog';
import useTableColumns from './TableColumns';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  TableRef,
  TableRefParent,
  UpdateFieldParent,
} from 'components/ProTable/types/refs';
import TypedObject from 'utils/TypedObject';
import {
  Divider,
  Grid,
  Modal,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import ProFormAutocomplete from 'components/ProForm/ProFormAutocomplete';
import { nanoid, unwrapResult } from '@reduxjs/toolkit';
import ProFormAutocompleteSingal from 'components/ProForm/ProFormAutocompleteSingal';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import { PriceDecimalInput, PriceInput } from 'plugins/NumberFormat';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import ProFormMultiAutocomplete from 'components/ProTable/core/EditableCell/ProFormMultiAutocomplete';
import {
  getChildProductById,
  getChildProductByIdList,
  getListPriceTable,
  getListPriceWithPriceTable,
  getListProductDrop,
  getListStoreByUser,
  getPriceTableList,
  getPriceWithTableList,
  getProductDropListStore,
} from 'slices/billCustomerApplicationSlice';
import ActionButton from 'components/ProButton/ActionButton';
import useTableSubColumns from './SubColumn';
import { useParams } from 'react-router-dom';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  minHeight: 500,
  bgcolor: 'background.paper',
  border: '2px solid #ffffff',
  boxShadow: 24,
};
interface TableCreateProducts {
  [key: string]: any;
}
interface Props<T> {
  refetch?: DispatchWithoutAction;
}
const ProductTable = <T extends object>(
  props: Props<T>,
  refParent: ForwardedRef<TableRefParent>
) => {
  const { id } = useParams();
  const form = useFormContext();
  const { fields, append, update, replace, remove } = useFieldArray({
    control: form.control,
    name: 'form',
    keyName: 'rowId',
  });

  const tableRef = useRef<TableRef>(null);
  const tablePriceIdForm = form.watch('tablePriceId');
  const customerType = form.watch('customerType');
  const customerId = form.watch('customerId');

  // console.log(customerType);

  const [, refetch] = useRefresh();
  const [loading] = useState<boolean>(false);
  const [rowIds, setRowIds] = useState<number[]>([]);
  const [filters] = useState<any>({
    pageNumber: 1,
    pageSize: 25,
  });
  const [nameProduct, setNameProduct] = useState('');
  const [listProductId, setListProductId] = useState<string[]>([]);
  const [listBonus, setlistBonus] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const [open, setOpen] = useState(false);
  //Get Data Store
  const storeByUser = useSelector(getListStoreByUser);
  const listDropProducts = useSelector(getProductDropListStore);
  const listPriceTables = useSelector(getPriceTableList);
  const listPriceWithProduct = useSelector(getPriceWithTableList);
  const [listChildProductById, setlistChildProductById] = useState<
    TableCreateProducts[]
  >([]);
  const [productIDAction, setProductIDAction] = useState('');

  const [isShowAmountInput, setShowAmountInput] = useState<boolean>(false);
  const [selectedChildProduct, setSelectedChildProduct] = useState<
    TableCreateProducts[]
  >([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loadingChild, setLoadingChild] = useState<boolean>(false);
  const [openDialogActionProduct, setOpenDialogActionProduct] =
    useState<boolean>(false);
  const [dataSelected, setDataSelected] = useState<any>({});

  const onPageChange = () => {};

  const onPageSizeChange = () => {};

  const handleOpenDialog = (value: any) => {
    setDataSelected(value);
    setOpenDialogActionProduct(!openDialogActionProduct);
  };

  const handleRowEditableChange = (
    rowEditableState: Record<string, boolean>
  ) => {
    const isEditing = TypedObject.isExist(rowEditableState);
    setIsEditing(isEditing);
    refetch();
  };

  const fetchMasterDataProducts = async () => {
    const idStore = form.watch('storeId');
    const customerType = '0';
    
    const body = {
      StoreId: idStore,
      customerType: customerId ? customerType : null,
    };
    try {
      if (form.watch('storeId') !== null) {
        await dispatch(getListProductDrop(body));
      }
    } catch (error) {
    } finally {
    }
  };

  const fetchPriceTable = async () => {
    const idStore = form.watch('storeId');
    try {
      if (form.watch('storeId') !== null) {
        await dispatch(getListPriceTable(idStore));
      }
    } catch (error) {
    } finally {
    }
  };

  const fetchPriceWithTable = async () => {
    const body = {
      productId: listProductId,
      priceTableId: form.watch('tablePriceId'),
    };
    try {
      if (form.watch('tablePriceId') !== null) {
        await dispatch(getListPriceWithPriceTable(body));
      }
    } catch (error) {
    } finally {
    }
  };

  const fetchChildProductById = async (id: string) => {
    const customerType = form.watch('customerType');
    const storeId = form.watch('storeId');
    try {
      setLoadingChild(true);
      const body = {
        parrentId: id,
        customerType: customerId ? customerType : null,
        storeId: storeId,
      };
      const responseD = await dispatch(getChildProductById(body));
      const response = unwrapResult(responseD);

      const tableValues = response.data.map((_item: any, index: any) => ({
        id: _item.productId,
        inventory: _item.inventory,
        productId: _item.productId,
        productName: _item.productName,
        salePrice: _item.salePrice.toString(),
        costPrice: _item.costPrice ? _item.costPrice : null,
        quantity: 1,
      })) as TableCreateProducts[];
      setlistChildProductById(tableValues);
    } catch (error) {
    } finally {
      setLoadingChild(false);
    }
  };
  useEffect(() => {
    fetchMasterDataProducts();
    fetchPriceTable();
  }, [form.watch('storeId'), customerType, customerId]);

  useEffect(() => {
    fetchPriceWithTable();
  }, [form.watch('tablePriceId'), listProductId]);

  const onSelectProduct = (value: string[] | null) => {
    let selected = listDropProducts.filter((item: any) =>
      (value || '').includes(item.productId)
    );

    const rowId = nanoid();
    const rows: TableCreateProducts[] = selected.reduce(
      (acc: TableCreateProducts[], product: TableCreateProducts) => {
        acc.push({
          id: rowId,
          image: 'im',
          productId: product.productId,
          productName: product.productName,
          inventory: product.inventory,
          price: product.salePrice.toString(),
          quantity: '0',
          payment: 0,
          total: 0,
          discountUnit: 0,
          discountValue: 0,
          productChildren: [],
          productBonus: [],
          costPrice: product.costPrice,
        });
        setListProductId([...new Set([...listProductId, product.productId])]);
        return acc;
      },
      []
    );
    append(rows);
    tableRef.current?.startRowEditMode(rowId);
  };
  
  const addListIdPrice = () => {
    let arr: any = [];
    let parentArr: any = [];
    form.watch('form')?.map((item: TableCreateProducts, index: any) => {
      parentArr.push(item.productId);

      item.productChildren.map((chil: any) => {
        arr.push(chil.productId);
      });
    });
    setListProductId([...new Set([...arr, ...parentArr])]);
    fetchPriceWithTable();
  };

  useEffect(() => {
    if (id) {
      addListIdPrice();
    }
  }, [id, listDropProducts]);

  const fetchPriceWithTablePrice = () => {
    if (listPriceWithProduct.length > 0) {
      const formatList: any = [];
      const customerTypeFormatList: any = [];
      let objectKey: any = {};
      listPriceWithProduct.forEach((item: any) => {
        formatList[item.productId] = item;
      });
      if (tablePriceIdForm) {
        form.watch('form')?.map((item: TableCreateProducts, index: any) => {
          const row = form.getValues(`form.${index}`);
          objectKey = {
            ...objectKey,
            [item.id]: true,
          };
          tableRef.current?.setExpanded(objectKey);
          if (item.productChildren && item.productChildren.length > 0) {
            // if (tablePriceIdForm) {
            const checkPrice = formatList[item.productId].salePrice
              ? formatList[item.productId]?.salePrice
              : '0';
            const formatProductChildren = item.productChildren.map(
              (prC: any, childIndex: any) => {
                const priceCheck = formatList[prC.productId]?.salePrice
                  ? formatList[prC.productId]?.salePrice
                  : '0';

                return {
                  ...prC,
                  price: formatList[prC.productId] ? priceCheck : '0',
                };
              }
            );
            update(index, {
              ...row,
              price: formatList[item.productId] ? checkPrice : '0',
              productChildren: formatProductChildren,
            });
            item?.productChildren.map((it: any, id: any) => {
              return form.clearErrors(
                `form[${index}].productChildren[${id}].price`
              );
            });
            form.clearErrors(`form[${index}].price`);
          } else {
            if (formatList[item.productId]) {
              if (tablePriceIdForm) {
                update(index, {
                  ...row,
                  price: formatList[item.productId].salePrice
                    ? formatList[item.productId]?.salePrice
                    : item.price,
                });
              } else {
                update(index, {
                  ...row,
                  price: item.price,
                });
              }
              form.clearErrors(`form[${index}].price`);
            }
          }
        });
      } else {
        form.watch('form')?.map((item: TableCreateProducts, index: any) => {
          const row = form.getValues(`form.${index}`);
          objectKey = {
            ...objectKey,
            [item.id]: true,
          };
          tableRef.current?.setExpanded(objectKey);

          if (item.productChildren && item.productChildren.length > 0) {
            listChildProductById.forEach((item: any) => {
              customerTypeFormatList[item.productId] = item;
            });
            listDropProducts.forEach((item: any) => {
              formatList[item.productId] = item;
            });
            const formatProductChildren = item.productChildren.map(
              (prC: any, childIndex: any) => {
                return {
                  ...prC,
                  price: customerTypeFormatList[prC.productId]?.salePrice
                    ? customerTypeFormatList[prC.productId]?.salePrice
                    : '0',
                };
              }
            );
            update(index, {
              ...row,
              price: formatList[item.productId]?.salePrice
                ? formatList[item.productId]?.salePrice
                : '0',
              productChildren: formatProductChildren,
            });
            item?.productChildren.map((it: any, id: any) => {
              return form.clearErrors(
                `form[${index}].productChildren[${id}].price`
              );
            });
            form.clearErrors(`form[${index}].price`);
          } else {
            listDropProducts.forEach((item: any) => {
              formatList[item.productId] = item;
            });
            if (formatList[item.productId]) {
              update(index, {
                ...row,
                price: formatList[item.productId].salePrice
                  ? formatList[item.productId]?.salePrice
                  : '0',
              });
              form.clearErrors(`form[${index}].price`);
            }
          }
        });
      }
    }
  };

  useEffect(() => {
    const formatList: any = [];
    // const customerTypeFormatList: any = [];
    let objectKey: any = {};
    if (id) {
      form.watch('form')?.map((item: TableCreateProducts, index: any) => {
        const row = form.getValues(`form.${index}`);
        objectKey = {
          ...objectKey,
          [item.id]: true,
        };

        tableRef.current?.setExpanded(objectKey);
      });
    }
  }, [id, fields]);

  useEffect(() => {
    fetchPriceWithTablePrice();
  }, [
    listPriceWithProduct,
    tablePriceIdForm,
    selectedChildProduct,
    customerType,
    listChildProductById,
    listDropProducts,
  ]);

  const handleOpenModalAddProduct = async (id: string, name: string) => {
    setOpen(true);
    fetchChildProductById(id);
    setProductIDAction(id);
    setNameProduct(name);
  };
  const handleCloseModalAddProduct = () => {
    setOpen(false);
  };

  const handleSetValueToField = useCallback(
    (typeField: string) => async () => {
      let formatList: any = [];
      if (typeField === 'discountHeaderSaleValue') {
        const valuePR = form.watch('discountValueHeader');
        const typePR = form.watch('discountTypeHeader');

        form.watch('form')?.map((item: TableCreateProducts, index: any) => {
          const row = form.getValues(`form.${index}`);
          if (item.productChildren && item.productChildren.length > 0) {
            item.productChildren.forEach((item: any) => {
              formatList[item.productId] = item;
            });
            const formatProductChildren = item.productChildren.map(
              (prC: any) => {
                return {
                  ...prC,
                  discountValue: valuePR,
                  discountUnit: typePR,
                };
              }
            );
            update(index, {
              ...row,
              discountValue: valuePR,
              discountUnit: typePR,
              productChildren: formatProductChildren,
            });
          } else {
            update(index, {
              ...row,
              discountUnit: typePR,
              discountValue: valuePR,
            });
          }
          form.trigger(`form[${index}].discountValue`);
        });
      }
    },
    [form, update]
  );

  useEffect(() => {
    form.watch('form')?.map((item: TableCreateProducts, index: any) => {
      if (item.productChildren && item.productChildren.length > 0) {
        fetchChildProductById(item.productId);
      }
    });
  }, [customerType, open,customerId]);

  const handleRemoveRow = useCallback(
    (rowIndex: number, rowId: string, childrenCheck: boolean) => () => {
      let newArr: any = [];
      if (childrenCheck) {
        const row = form.getValues(`form.${rowIndex}`);
        row.productChildren.map((item: any) => {
          if (item.id !== rowId) {
            newArr.push(item);
          }
        });
        update(rowIndex, {
          ...row,
          productChildren: newArr,
        });
      } else {
        remove(rowIndex);
      }
      tableRef.current?.stopRowEditMode(rowId);
    },
    [remove, update, form]
  );

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
    handleOpenDialog,
    onAddChildProduct: handleOpenModalAddProduct,
    onSetAllPrice: handleSetValueToField,
    setValue: form.setValue,
    onDelete: handleRemoveRow,
  });

  const { subColumns } = useTableSubColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
    handleOpenDialog,
    onAddChildProduct: handleOpenModalAddProduct,
  });

  const handleRowSelectionChange = (rowIds: string[]) => {
    const selectID = rowIds.map(String);

    setSelectedChildProduct((state) => {
      return selectID.reduce<TableCreateProducts[]>((acc, subProductId) => {
        const selected = listChildProductById.find(
          (subP) => subP.id === subProductId
        );
        const exist = state.find((subP) => subP.id === subProductId);
        if (exist) {
          acc.push(exist);
        } else if (selected) {
          acc.push(selected);
        }
        return acc;
      }, []);
    });
    setListProductId([...new Set([...listProductId, ...selectID])]);
  };

  const handleAddSubProduct = () => {
    const approveListChild = selectedChildProduct.map((_item: any) => ({
      id: `${_item.productId}`,
      productId: _item.productId,
      productName: _item.productName,
      inventory: _item.inventory,
      price: _item.salePrice,
      quantity: '0',
      payment: 0,
      total: 0,
      discountUnit: 0,
      discountValue: 0,
      costPrice: _item.costPrice,
    })) as TableCreateProducts[];
    fields.forEach((item: TableCreateProducts, index: any) => {
      if (item.productId === productIDAction) {
        const row = form.getValues(`form.${index}`);
        update(index, {
          ...row,
          productChildren: approveListChild.map(
            (proChild: any, idx: number) => ({
              ...proChild,
              parentIndex: index,
              idx,
            })
          ),
        });
      }
    });
    fetchPriceWithTablePrice();

    handleCloseModalAddProduct();
  };

  const handleOpenExpanded = () => {
    const formatList: any = [];
    let objectKey: any = {};
    listPriceWithProduct.forEach((item: any) => {
      formatList[item.productId] = item;
    });

    fields.map((item: TableCreateProducts, index: any) => {
      objectKey = {
        ...objectKey,
        [item.id]: true,
      };
      tableRef.current?.setExpanded(objectKey);
    });
  };

  useImperativeHandle(refParent, () => ({
    onExpandedOpen: handleOpenExpanded,
  }));
console.log(storeByUser);

  return (
    <Paper sx={{ p: 3 }}>
      <Box>
        <Grid item container xs={12} md={12} spacing={2}>
          <Grid item xs={3} md={2}>
            <ProFormAutocompleteSingal
              name="storeId"
              options={storeByUser ? storeByUser : []}
              renderLabel={(option) => option?.name}
              renderValue={(option) => option?.id}
              placeholder={'Cửa hàng'}
              onSelect={(e) => {
                form.reset({ ...form.watch(), form: [], storeId: e });
              }}
            />
          </Grid>
          <Grid item xs={3} md={2}>
            <ProFormAutocompleteSingal
              name="productId"
              placeholder={'Sản phẩm'}
              options={[
                { id: '1', label: 'TM' },
                { id: '2', label: 'HN-1' },
                { id: '3', label: 'HN-2' },
                { id: '4', label: 'Sài Gòn' },
                { id: '5', label: 'VTech Thanh Hóa' },
              ]}
              renderLabel={(option) => option.label}
              renderValue={(option) => option.id}
            />
          </Grid>
          <Grid item xs={7} md={8} container spacing={1}>
            <Grid item xs={5} md={isShowAmountInput ? 5 : 5}>
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
            {isShowAmountInput && (
              <Grid item xs={2} md={2}>
                <ProFormTextField
                  name="bankPaymentAmount"
                  placeholder="Số tiền"
                  InputProps={{
                    inputComponent: PriceDecimalInput,
                    sx: {
                      '& .MuiInputBase-input': {
                        padding: '8.5px 14px !important',
                      },
                    },
                  }}
                />
              </Grid>
            )}
            <ActionIconButton
              actionType="scan"
              onClick={() => setShowAmountInput(!isShowAmountInput)}
            />
            <Grid item xs={4} md={3}>
              <ProFormAutocompleteSingal
                name="tablePriceId"
                placeholder="Bảng giá"
                options={listPriceTables}
                renderLabel={(option) => option.name}
                renderValue={(option) => option.id}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid sx={{ minHeight: 300 }}>
          <ProTable<TableCreateProducts>
            loading={loading}
            columns={columns}
            ref={tableRef}
            data={fields}
            refetch={refetch}
            form={form}
            initialstate={{
              hiddenColumns: [],
              hiddenVisibilityColumns: true,
            }}
            onRowEditableChange={handleRowEditableChange}
            getRowId={(row) => row.id}
            getSubRows={(row) => row.productChildren}
            editable
            hideFooter
          />
        </Grid>
      </Box>
      <ActionProductDialog
        open={openDialogActionProduct}
        onClose={() => {
          setOpenDialogActionProduct(!openDialogActionProduct);
          setDataSelected({});
        }}
        value={dataSelected}
      />
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ outline: 'none' }}
        onClose={handleCloseModalAddProduct}
      >
        <Box sx={style} style={{ outline: 'none' }}>
          <Grid sx={{ pl: 2, pr: 2, pt: 1.5, pb: 1.5 }}>
            <Typography style={{ fontSize: 18, fontWeight: 500 }}>
              {' '}
              Thao tác với sản phẩm: {nameProduct}
            </Typography>
          </Grid>
          <Divider />
          <Box sx={{ p: 2 }}>
            <ProTable<TableCreateProducts>
              loading={loadingChild}
              columns={subColumns}
              ref={tableRef}
              data={listChildProductById}
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
          </Box>
          <Grid
            container
            item
            xs={12}
            md={12}
            sx={{ p: 3, pr: 4 }}
            justifyContent={'flex-end'}
          >
            <ActionButton onClick={() => handleAddSubProduct()}>
              Chọn
            </ActionButton>
          </Grid>
        </Box>
      </Modal>
    </Paper>
  );
};

export default forwardRef(ProductTable);
