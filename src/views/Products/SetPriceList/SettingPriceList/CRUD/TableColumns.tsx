import { Typography } from '@mui/material';
import { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import React, { useMemo } from 'react';
import { ISettingPriceListType } from './utils/type';
import CheckIcon from '@mui/icons-material/Check';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ProMenu from 'components/ProMenu';
import ActionIconButton from 'components/ProButton/ActionIconButton';
interface Props {
  pageNumber: number;
  pageSize: number;
}

const columnHelper = getColumnHelper<ISettingPriceListType>();

const HEAD_CELLS: HeadCell<ISettingPriceListType> = {
  id: 'ID',
  priceName: 'Tên bảng giá',
  timeApplication: 'Thời gian áp dụng',
  status: 'Trạng thái',
  creator: 'Người tạo',
  createTime: 'Thời gian tạo',
  category: 'Danh mục',
};

const useTableColumns = (props: Props) => {
  const columns: ProColumn<ISettingPriceListType> = useMemo(() => {
    return [
      columnHelper.accessor('id', {
        id: 'id',
        size: 100,
        header: () => HEAD_CELLS.id,
        cell: (context) => (
          <Typography variant="subtitle2">{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.id,
        },
      }),
      columnHelper.accessor('priceName', {
        id: 'priceName',
        size: 100,
        header: () => HEAD_CELLS.priceName,
        cell: (context) => (
          <Typography variant="subtitle2" sx={{ color: '#007bff' }}>
            {context.getValue()}
          </Typography>
        ),
        meta: {
          title: HEAD_CELLS.priceName,
        },
      }),
      columnHelper.accessor('timeApplication', {
        id: 'timeApplication',
        size: 100,
        header: () => HEAD_CELLS.timeApplication,
        cell: (context) => (
          <Typography variant="subtitle2">{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.timeApplication,
        },
      }),
      columnHelper.accessor('category', {
        id: 'category',
        size: 100,
        header: () => HEAD_CELLS.category,
        cell: (context) => (
          <Typography variant="subtitle2">{context.getValue()}</Typography>
        ),
        meta: {
          title: HEAD_CELLS.category,
        },
      }),
      columnHelper.accessor('status', {
        id: 'status',
        size: 50,
        header: () => HEAD_CELLS.status,
        cell: (context) =>
          context.getValue() === true ? (
            <CheckIcon color="success" />
          ) : (
            <RemoveCircleOutlineIcon color="error" />
          ),
        meta: {
          title: HEAD_CELLS.status,
        },
      }),
      columnHelper.accessor('creator', {
        id: 'creator',
        size: 100,
        header: () => HEAD_CELLS.creator,
        cell: (context) => (
          <>
            <Typography variant="subtitle2">{context.getValue()}</Typography>
            <Typography variant="subtitle2" mt={2}>
              {context.row.original.createTime}
            </Typography>
          </>
        ),
        meta: {
          title: HEAD_CELLS.creator,
        },
      }),
      {
        id: 'actions',
        size: 65,
        enableSorting: false,
        header: () => <BorderColorIcon sx={{ color: 'text.secondary' }} />,
        cell: (context) => {
          return (
            <ProMenu
              position="left"
              items={[
                {
                  label: 'Sửa',
                  value: 1,
                  actionType: 'edit',
                },
              ]}
            >
              <ActionIconButton actionType="more" />
            </ProMenu>
          );
        },
        meta: {
          title: HEAD_CELLS.actions,
          align: 'center',
        },
      },
    ];
  }, []);
  return { columns };
};

export default useTableColumns;
