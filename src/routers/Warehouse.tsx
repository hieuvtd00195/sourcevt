import Loadable from 'components/Loadable';
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

// Products
const List = Loadable(lazy(() => import('views/Warehouse')));
const WarehouseTable = Loadable(
  lazy(() => import('views/Warehouse/CreateWarehouse'))
);

const DetailWarehouse = Loadable(
  lazy(() => import('views/Warehouse/DetailWarehouse'))
);

const DetailMoving = Loadable(
  lazy(() => import('views/Warehouse/Moving/DetailMoving'))
);

const AcceptWarehouse = Loadable(
  lazy(() => import('views/Warehouse/Moving/AcceptWarehouse'))
);

const AddTicket = Loadable(lazy(() => import('views/Warehouse/AddTicket')));
const CheckBroser = Loadable(
  lazy(() => import('views/Warehouse/DraftTicket/Browserss'))
);
const ConfirmDraft = Loadable(
  lazy(() => import('views/Warehouse/DraftTicket/Confirms'))
);
const CreareDraft = Loadable(
  lazy(() => import('views/Warehouse/DraftTicket/CreateDraft'))
);
const FormDelivering = Loadable(
  lazy(() => import('views/Warehouse/Delivering/FormDelivering'))
);

const Warehouse: RouteObject = {
  path: 'warehouse',
  element: <Outlet />,
  children: [
    { index: true, element: <List /> },
    { path: 'create', element: <WarehouseTable /> },
    { path: 'detail/:id', element: <DetailWarehouse /> },
    { path: 'moving-detail/:id', element: <DetailMoving /> },
    { path: 'accept-moving/:id', element: <AcceptWarehouse /> },
    { path: 'add', element: <AddTicket /> },
    { path: 'browser', element: <CheckBroser /> },
    { path: 'confirm', element: <ConfirmDraft /> },
    { path: 'draft', element: <CreareDraft /> },
    { path: 'delivering/:id', element: <FormDelivering /> },
  ],
};

export default Warehouse;
