import type { SvgIconComponent } from '@mui/icons-material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HomeIcon from '@mui/icons-material/Home';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import PeopleIcon from '@mui/icons-material/People';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PolicyIcon from '@mui/icons-material/Policy';
import PublicIcon from '@mui/icons-material/Public';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import type { TFunction } from 'react-i18next';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
export interface SectionItem {
  title: string;
  path: string;
  children?: SectionItem[];
  info?: () => JSX.Element;
  icon?: SvgIconComponent;
}

interface Section {
  section: string | null;
  items: SectionItem[];
}

const Sections = (t: TFunction): Section[] => {
  return AdminSections(t);
};

const AdminSections = (t: TFunction): Section[] => [
  {
    section: null,
    items: [
      {
        title: t('Trang chủ'),
        path: '/home',
        icon: HomeIcon,
      },
    ],
  },
  {
    section: null,
    items: [
      {
        title: t('Banner'),
        path: '/banner',
        icon: ViewCarouselIcon,
      },
    ],
  },
  {
    section: null,
    items: [
      {
        title: t('Khách hàng'),
        path: '/customers',
        icon: PeopleIcon,
      },
    ],
  },
  {
    section: null,
    items: [
      {
        title: t('Bán hàng'),
        path: '/sales',
        icon: CardGiftcardIcon,
        children: [
          {
            title: t('Bán lẻ'),
            icon: CardGiftcardIcon,
            path: '/sales/retail',
          },
          {
            title: t('Trả hàng'),
            icon: CardGiftcardIcon,
            path: '/sales/return',
          },
          {
            title: t('Trả hàng'),
            icon: CardGiftcardIcon,
            path: '/sales/returns',
          },
        ],
      },
    ],
  },
  {
    section: null,
    items: [
      {
        title: t('Sản phẩm'),
        path: '/products',
        icon: LocalMallIcon,
      },
    ],
  },
  {
    section: null,
    items: [
      {
        title: t('Báo cáo doanh thu'),
        path: '/report/revenue',
        icon: TrendingUpIcon,
        children: [
          {
            title: t('Theo cửa hàng'),
            icon: StoreOutlinedIcon,
            path: '/report/revenue/depot',
          },
          {
            title: t('Theo nhân viên bán hàng'),
            icon: PersonOutlineOutlinedIcon,
            path: '/report/revenue/staff',
          },
        ],
      },
    ],
  },
  {
    section: null,
    items: [
      {
        title: t('Đơn hàng'),
        path: '/orders',
        icon: ShoppingCartIcon,
      },
    ],
  },
  {
    section: null,
    items: [
      {
        title: t('Vùng miền'),
        path: '/regions',
        icon: PublicIcon,
      },
    ],
  },
  {
    section: null,
    items: [
      {
        title: t('Nhân viên'),
        path: '/employees',
        icon: PeopleIcon,
      },
    ],
  },
  {
    section: null,
    items: [
      {
        title: t('Phân quyền'),
        path: '/roles',
        icon: AdminPanelSettingsIcon,
      },
    ],
  },
  {
    section: null,
    items: [
      {
        title: 'Chính sách và điều khoản',
        path: '/term-and-policy',
        icon: PolicyIcon,
        children: [
          {
            title: 'Chính sách',
            icon: PolicyIcon,
            path: '/term-and-policy/policy',
          },
          {
            title: 'Điều khoản',
            icon: PolicyIcon,
            path: '/term-and-policy/term',
          },
        ],
      },
    ],
  },
];

export default Sections;
