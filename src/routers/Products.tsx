import Loadable from 'components/Loadable';
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

// Products
const List = Loadable(lazy(() => import('views/Products')));
const Inventory = Loadable(lazy(() => import('views/InventoryProduct')));
const Supplier = Loadable(lazy(() => import('views/Supplier')));
const AddSupplier = Loadable(lazy(() => import('views/Supplier/AddSuplier')));
const AddSupplierProduct = Loadable(
  lazy(() => import('views/Supplier/AddSupplierProduct'))
);
const CreateProducts = Loadable(
  lazy(() => import('views/Products/CreateProducts/index'))
);

const ProductInfo = Loadable(lazy(() => import('views/Products/ProductInfo')));
const SetPriceProduct = Loadable(
  lazy(() => import('views/Products/SetPriceList'))
);
const CreatePrice = Loadable(
  lazy(() => import('views/Products/SetPriceList/SettingPriceList/CRUD/Create/index'))
);
const Products: RouteObject = {
  path: 'products',
  element: <Outlet />,
  children: [
    { index: true, element: <List /> },
    { path: 'create', element: <CreateProducts /> },
    { path: 'inventory', element: <Inventory /> },
    { path: 'supplier', element: <Supplier /> },
    { path: 'addsupplier', element: <AddSupplier /> },
    { path: 'addsupplierproduct', element: <AddSupplierProduct /> },
    { path: 'detail', element: <ProductInfo /> },
    {
      path: 'setting-price-list', 
      element: < Outlet/>,
      children: [
        { index: true, element: <SetPriceProduct /> },
        { path: 'add', element: <CreatePrice /> },
      ],
    },
  ],
};

export default Products;
