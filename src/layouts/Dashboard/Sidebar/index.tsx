import type { SvgIconComponent } from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import type { ListProps } from '@mui/material/List';
import List from '@mui/material/List';
import type { ListItemProps } from '@mui/material/ListItem';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import { alpha, styled, useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import Scrollbar from 'components/Scrollbar';
import { MINI_SIDEBAR_WIDTH, SIDEBAR_WIDTH } from 'constants/layouts';
import useDerivedState from 'hooks/useDerivedState';
import usePrevious from 'hooks/usePrevious';
import type { FC, ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import type { MouseEvent } from 'types/react';
import Logo from './Logo';
import Profile from './Profile';
import type { SectionItem } from './Sections';
import Sections from './Sections';
import SubMenu from './SubMenu';

export const CollapseContext = createContext<boolean | null>(null);
export const SidebarContext = createContext<boolean | null>(null);

interface Props {
  openSidebar: boolean;
  collapsed: boolean;
  onCloseSidebar: () => void;
}
const Sidebar = (props: Props) => {
  const { openSidebar, collapsed, onCloseSidebar } = props;
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const sections = useMemo(() => Sections(t), [t]);
  const theme = useTheme();
  const prevPathName = usePrevious(pathname);

  const lgUp = useMediaQuery(theme.breakpoints.up('lg'));

  useEffect(() => {
    if (prevPathName !== pathname && openSidebar) {
      onCloseSidebar();
    }
  }, [pathname, onCloseSidebar, openSidebar, prevPathName]);

  if (lgUp) {
    return (
      <CollapsibleDrawer
        anchor="left"
        variant="permanent"
        collapsed={collapsed}
      >
        <SidebarContext.Provider value={openSidebar}>
          <CollapseContext.Provider value={collapsed}>
            <Scrollbar>
              <Logo />
              {/* <Profile /> */}
              <Divider sx={{ mb: 1.5 }} />
              {sections.map((section, i) => (
                <MenuSection key={i} pathname={pathname} {...section} />
              ))}
            </Scrollbar>
          </CollapseContext.Provider>
        </SidebarContext.Provider>
      </CollapsibleDrawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      variant="temporary"
      open={openSidebar}
      onClose={onCloseSidebar}
      sx={{
        width: SIDEBAR_WIDTH,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      PaperProps={{ sx: { width: SIDEBAR_WIDTH, bgcolor: 'primary.main' } }}
    >
      <SidebarContext.Provider value={openSidebar}>
        <CollapseContext.Provider value={false}>
          <Scrollbar sx={{ height: 1 }}>
            <Logo />
            <Profile />
            <Divider sx={{ mb: 1.5 }} />
            {sections.map((section, i) => (
              <MenuSection key={i} pathname={pathname} {...section} />
            ))}
          </Scrollbar>
        </CollapseContext.Provider>
      </SidebarContext.Provider>
    </Drawer>
  );
};

// Menu section
interface MenuSectionProps extends ListProps {
  section: string | null;
  pathname: string;
  items: SectionItem[];
}
const MenuSection: FC<MenuSectionProps> = (props) => {
  const { section, pathname, items, ...rest } = props;

  const collapsed = useContext(CollapseContext);

  return (
    <List
      subheader={
        section &&
        !collapsed && (
          <ListSubheader disableGutters disableSticky sx={{ ml: 3 }}>
            {section}
          </ListSubheader>
        )
      }
      disablePadding
      {...rest}
    >
      <MenuItems items={items} pathname={pathname} level={0} />
    </List>
  );
};

// Menu section items
interface MenuItemsProps {
  items: SectionItem[];
  pathname: string;
  level: number;
}
const MenuItems = (props: MenuItemsProps) => {
  const { items, pathname, level } = props;

  return (
    <List disablePadding>
      {items.reduce<ReactNode[]>((acc, item, i) => {
        const { title, path, children, info, icon } = item;
        const key = `${title}-${level}-${i}`;
        const partialMatch = pathname.startsWith(path);
        // const exactMatch = pathname === path;

        if (children) {
          acc.push(
            <MenuItem
              active={partialMatch}
              level={level}
              icon={icon}
              info={info}
              key={key}
              path={path}
              title={title}
              match={partialMatch}
            >
              <MenuItems
                items={children}
                pathname={pathname}
                level={level + 1}
              />
            </MenuItem>
          );
        } else {
          acc.push(
            <MenuItem
              active={partialMatch}
              level={level}
              icon={icon}
              info={info}
              key={key}
              path={path}
              title={title}
            />
          );
        }
        return acc;
      }, [])}
    </List>
  );
};

interface MenuItemProps extends ListItemProps {
  active?: boolean;
  children?: ReactNode;
  chip?: ReactNode;
  level: number;
  icon?: SvgIconComponent;
  info?: () => JSX.Element;
  match?: boolean;
  path?: string;
  title: string;
}
const MenuItem: FC<MenuItemProps> = (props) => {
  const {
    active,
    children,
    chip,
    level,
    icon: Icon,
    info: Info,
    match,
    path,
    title,
    ...other
  } = props;

  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [expanded, setExpanded] = useDerivedState<boolean>(Boolean(match));
  const collapsed = useContext(CollapseContext);

  const { pathname } = useLocation();
  const prevPathName = usePrevious(pathname);

  useEffect(() => {
    if (prevPathName !== pathname && collapsed) {
      setAnchor(null);
    }
  }, [pathname, collapsed, prevPathName]);

  const handleToggle = (): void => {
    setExpanded(!expanded);
  };

  const handleOpenSubMenu: MouseEvent = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleCloseSubMenu = () => {
    setAnchor(null);
  };

  let paddingLeft = 8 * 3;

  if (level > 0) {
    paddingLeft = !collapsed ? 32 + 16 * level : 16 * level;
  }

  if (level === 0 && collapsed) {
    return (
      <ListItem
        disableGutters
        disablePadding
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          mb: 1.5,
        }}
        {...other}
      >
        <Tooltip title={title} placement="right">
          <IconButton
            onClick={children ? handleOpenSubMenu : void 0}
            size="medium"
            {...(!children &&
              path && {
                component: RouterLink,
                to: path,
              })}
            sx={{
              color: 'neutral.300',
              '&:hover': {
                bgcolor: alpha('#FFFFFF', 0.08),
              },
              ...(active && {
                color: 'secondary.main',
                bgcolor: alpha('#FFFFFF', 0.08),
              }),
            }}
          >
            {Info && Icon ? (
              <Badge color="secondary" variant="dot">
                <Icon />
              </Badge>
            ) : (
              Icon && <Icon />
            )}
          </IconButton>
        </Tooltip>
        <SubMenu
          anchor={anchor}
          handleClose={handleCloseSubMenu}
          open={Boolean(anchor)}
        >
          {children}
        </SubMenu>
      </ListItem>
    );
  }

  // Branch
  if (children) {
    return (
      <ListItem
        disableGutters
        disablePadding
        sx={{
          display: 'flex',
          flexDirection: 'column',
          ...(level === 0 && {
            px: 1.5,
          }),
        }}
        {...other}
      >
        <Button
          endIcon={expanded ? <ChevronLeftIcon /> : <ExpandMoreIcon />}
          onClick={handleToggle}
          startIcon={Icon && <Icon />}
          variant="text"
          size="medium"
          fullWidth
          sx={{
            color: 'neutral.300',
            p: 1.25,
            pl: `${paddingLeft}px`,
            textAlign: 'left',
            '&:hover': {
              bgcolor: alpha('#FFFFFF', 0.08),
            },
            ...(active && {
              color: 'secondary.main',
              bgcolor: alpha('#FFFFFF', 0.08),
            }),
          }}
        >
          <Box sx={{ flexGrow: 1 }}>{title}</Box>
          {Info && <Info />}
        </Button>
        <Collapse in={expanded} sx={{ mt: 0.5, width: 1 }}>
          {children}
        </Collapse>
      </ListItem>
    );
  }

  // Leaf
  return (
    <ListItem
      disableGutters
      disablePadding
      sx={{
        display: 'flex',
        ...(level === 0 && {
          px: 1.5,
          pb: 0.5,
        }),
      }}
    >
      <Button
        startIcon={Icon && <Icon />}
        endIcon={chip}
        variant="text"
        size="medium"
        fullWidth
        sx={{
          color: 'neutral.300',
          p: 1.25,
          pl: `${paddingLeft}px`,
          '&:hover': {
            bgcolor: alpha('#FFFFFF', 0.08),
          },
          ...(active && {
            color: 'secondary.main',
            bgcolor: alpha('#FFFFFF', 0.08),
          }),
        }}
        {...(path && {
          component: RouterLink,
          to: path,
        })}
      >
        <Box sx={{ flexGrow: 1 }}>{title}</Box>
        {Info && <Info />}
      </Button>
    </ListItem>
  );
};

const CollapsibleDrawer = styled(Drawer, {
  shouldForwardProp: (prop: string) => !['collapsed'].includes(prop),
})<{ collapsed: boolean }>(({ theme, collapsed }) => ({
  width: SIDEBAR_WIDTH,
  [`& .${drawerClasses.paper}`]: {
    backgroundColor: theme.palette.neutral['900'],
    borderRight: 'revert',
    color: theme.palette.common.white,
    width: SIDEBAR_WIDTH,
    ...(collapsed && {
      width: MINI_SIDEBAR_WIDTH,
    }),
  },
}));

export default Sidebar;
