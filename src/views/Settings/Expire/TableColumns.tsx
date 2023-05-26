import type { HeadCell, ProColumn } from 'components/ProTable/types';
import { getColumnHelper } from 'components/ProTable/utils/getColumnHelper';
import { useMemo } from 'react';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { Address, City, Creator, Expire } from './utils/type';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import DateTime from 'utils/DateTime';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ProMenu from 'components/ProMenu';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import { useNavigate } from 'react-router-dom';

const columnHelper = getColumnHelper<Expire>();

const HEAD_CELLS: HeadCell<Expire> = {
  index: 'STT',
  id: 'ID',
  storeName: 'Tên kho',
  storeCode: 'Mã kho',
  city: 'Thành phố Quận huyện',
  address: 'Địa chỉ',
  note: 'Lưu ý',
  expireDate: 'Ngày hết hạn',
  creator: 'Người tạo',
};

interface Props {
  pageNumber: number;
  pageSize: number;
  handleEditNote: (id: number, note: string) => void;
}

const useTableColumns = (props: Props) => {
  const { handleEditNote } = props;
  const navigate = useNavigate();

  const columns: ProColumn<Expire> = useMemo(() => {
    return [
      columnHelper.accessor('id', {
        id: 'id',
        size: 50,
        enableSorting: false,
        header: () => HEAD_CELLS.id,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.id,
        },
      }),
      columnHelper.accessor('storeName', {
        id: 'storeName',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.storeName,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.storeName,
        },
      }),
      columnHelper.accessor('storeCode', {
        id: 'storeCode',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.storeCode,
        cell: (context) => context.getValue(),
        meta: {
          title: HEAD_CELLS.storeCode,
        },
      }),
      columnHelper.accessor('city', {
        id: 'city',
        size: 150,
        enableSorting: false,
        header: () => HEAD_CELLS.city,
        cell: (context) => {
          return (
            <Stack direction="column">
              <Box>{context.getValue<City>().city}</Box>
              <Box>{context.getValue<City>().district}</Box>
            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.city,
        },
      }),
      columnHelper.accessor('address', {
        id: 'address',
        size: 150,
        enableSorting: false,
        header: () => HEAD_CELLS.address,
        cell: (context) => {
          return (
            <Stack direction="column">
              {context.getValue<Address>().phone && (
                <Stack alignItems={'center'}>
                  <LocalPhoneIcon />
                  {context.getValue<Address>().phone}
                </Stack>
              )}
              {context.getValue<Address>().address && (
                <Stack alignItems={'center'}>
                  <LocationOnIcon />
                  {context.getValue<Address>().address}
                </Stack>
              )}
            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.city,
        },
      }),
      columnHelper.accessor('note', {
        id: 'note',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.note,
        cell: (context) => {
          const { note, id } = context.row.original;
          return (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {note}
              <IconButton onClick={() => handleEditNote(id, note)}>
                <EditIcon sx={{ color: 'text.secondary', ml: 1 }} />
              </IconButton>
            </Box>
          );
        },
        meta: {
          title: HEAD_CELLS.note,
        },
      }),
      columnHelper.accessor('expireDate', {
        id: 'expireDate',
        size: 100,
        enableSorting: false,
        header: () => HEAD_CELLS.expireDate,
        cell: (context) => DateTime.Format(context.getValue(), 'DD/MM/YYYY'),
        meta: {
          title: HEAD_CELLS.expireDate,
        },
      }),
      columnHelper.accessor('visible', {
        id: 'visible',
        size: 50,
        enableSorting: false,
        header: () => <CheckIcon />,
        cell: (context) => {
          if (context.getValue()) {
            return (
              <Tooltip title="Hiện" placement="top">
                <CheckIcon color="success" />
              </Tooltip>
            );
          }
          return (
            <Tooltip title="Ẩn" placement="top">
              <CloseIcon color="error" />
            </Tooltip>
          );
        },
        meta: {
          title: HEAD_CELLS.visible,
        },
      }),
      columnHelper.accessor('creator', {
        id: 'creator',
        size: 150,
        enableSorting: false,
        header: () => HEAD_CELLS.creator,
        cell: (context) => {
          return (
            <Stack direction="column">
              <Box>{context.getValue<Creator>().name}</Box>
              <Typography variant="caption">
                {DateTime.Format(
                  context.getValue<Creator>().time,
                  'HH:MM DD/MM'
                )}
              </Typography>
            </Stack>
          );
        },
        meta: {
          title: HEAD_CELLS.creator,
        },
      }),
      {
        id: 'actions',
        size: 65,
        enableSorting: false,
        header: () => <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />,
        cell: (context) => {
          const handleEdit = () => {
            navigate('/setting/addexpire');
          };
          return (
            <ProMenu
              position="left"
              items={[
                {
                  label: 'Sửa',
                  value: 2,
                  actionType: 'edit',
                  onSelect: handleEdit,
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
  }, [handleEditNote, navigate]);

  return { columns };
};

export default useTableColumns;
