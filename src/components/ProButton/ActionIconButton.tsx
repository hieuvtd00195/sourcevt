import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SaveIcon from '@mui/icons-material/Save';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import StyleOutlinedIcon from '@mui/icons-material/StyleOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import type { IconButtonProps } from '@mui/material/IconButton';
import IconButton from '@mui/material/IconButton';
import { Fragment } from 'react';
import KeyboardDoubleArrowDownOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowDownOutlined';
const ActionIcon = () => {
  return (
    <Fragment>
      <MenuIcon />
      <ExpandMoreIcon />
    </Fragment>
  );
};

export const icons = {
  delete: DeleteIcon,
  edit: EditIcon,
  save: SaveIcon,
  cancel: CloseIcon,
  sub: IndeterminateCheckBoxOutlinedIcon,
  view: VisibilityIcon,
  more: MoreHorizIcon,
  action: ActionIcon,
  add: AddIcon,
  cart: ShoppingBagOutlinedIcon,
  tags: StyleOutlinedIcon,
  company: AccountBalanceIcon,
  arrowDown: KeyboardArrowDownIcon,
  scan: DocumentScannerIcon,
  vat: KeyboardDoubleArrowDownOutlinedIcon
} as const;

interface Props extends IconButtonProps {
  actionType?: keyof typeof icons;
}

const ActionIconButton = (props: Props) => {
  const { actionType, children, ...rest } = props;

  const Icon = actionType && icons[actionType];

  return <IconButton {...rest}>{Icon ? <Icon /> : children}</IconButton>;
};

export default ActionIconButton;
