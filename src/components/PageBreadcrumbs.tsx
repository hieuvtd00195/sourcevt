import Box from '@mui/material/Box';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';

interface Breadcrumb {
  text: string;
  link: string;
}

interface Props {
  category?: string;
  items: Breadcrumb[];
  title: string;
}

const PageBreadcrumbs = (props: Props) => {
  const { title, items, category } = props;

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'background.paper',
          px: 2,
          py: 1,
        }}
      >
        <Breadcrumbs
          sx={{
            [`& > .${breadcrumbsClasses.ol}`]: {
              alignItems: 'baseline',
            },
          }}
        >
          <Link
            component={RouterLink}
            to="/home"
            variant="body2"
            sx={{ color: 'text.primary' }}
          >
            Trang chủ
          </Link>
          {category && <Typography variant="body2">{category}</Typography>}
          {items.map((item, i) => {
            const { text, link } = item;
            return (
              <Link
                key={i}
                component={RouterLink}
                to={link}
                variant="body2"
                sx={{ color: 'text.primary' }}
              >
                {text}
              </Link>
            );
          })}
          <Typography variant="body2">{title}</Typography>
        </Breadcrumbs>
      </Box>
      <Divider />
    </Box>
  );
};

export default PageBreadcrumbs;
