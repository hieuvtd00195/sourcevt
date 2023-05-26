import Loadable from 'components/Loadable';
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

// Category
const List = Loadable(lazy(() => import('views/Category')));
const Create = Loadable(lazy(() => import('views/Category/CreateCategory')));
const Edit = Loadable(lazy(() => import('views/Category/EditCategory')));

const Category: RouteObject = {
  path: 'category',
  element: <Outlet />,
  children: [
    { index: true, element: <List /> },
    {
      path: 'add',
      children: [{ index: true, element: <Create /> }],
    },
    {
      path: 'edit',
      children: [{ index: true, element: <Edit /> }],
    },
  ],
};

export default Category;
