import { styled } from '@mui/material/styles';
import type { TableCellProps } from '@mui/material/TableCell';
import TableCell from '@mui/material/TableCell';

interface Props extends TableCellProps {
  fixed?: 'left' | 'right' | false;
  header?: boolean;
  selected?: boolean;
  offset: number;
  typeMultipe?: boolean;
  subRowBorder?: boolean;
}

const ProTableCell = styled(TableCell, {
  shouldForwardProp: (prop: string) =>
    !['fixed', 'header', 'selected', 'offset'].includes(prop),
})<Props>(({ theme, fixed, header, selected, offset,typeMultipe,subRowBorder }) => ({
  borderBottom: '1px solid',
  borderRight: subRowBorder ? '0px' : '1px solid',
  borderColor: theme.palette.divider,
  // wordBreak: 'break-all',
  whiteSpace: 'normal',
  overflowWrap: 'break-word',
  padding: typeMultipe ? '0px !important' : '6px 16px',
  ...(fixed && {
    position: 'sticky',
    ...(fixed === 'left' && {
      left: offset,
      boxShadow: '2px 0px 4px -2px rgb(0 0 0 / 21%)',
      zIndex: theme.zIndex.appBar + 1,
    }),
    ...(fixed === 'right' && {
      right: 0,
      boxShadow: '-2px 0px 4px -2px rgb(0 0 0 / 21%)',
      zIndex: theme.zIndex.appBar + 1,
    }),
    ...(header && {
      zIndex: theme.zIndex.appBar + 2,
    }),
  }),
  ...(header && {
    whiteSpace: 'nowrap',
  }),
  ...(!header && {
    backgroundColor: theme.palette.common.white,
  }),
  ...(selected && {
    backgroundColor: theme.palette.grey[200],
  }),
}));

export default ProTableCell;
