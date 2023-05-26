import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import { TabList } from '@mui/lab';
import { Checkbox, Grid, Tab } from '@mui/material';
import Box from '@mui/material/Box';
import { Stack } from '@mui/system';
import DropdownCustom from 'components/DropdownCustom';
import ActionButton from 'components/ProButton/ActionButton';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import ProForm from 'components/ProForm';
import ProFormAutocomplete from 'components/ProForm/Label/ProFormAutocomplete';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import { PriceInput } from 'plugins/NumberFormat';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import Validation from 'utils/Validation';
import AddIcon from '@mui/icons-material/Add';
import { useParams } from 'react-router-dom';

interface IForm {}

interface IProps {
  tab: string;
  handleAddTab: () => void;
  handleRemoveTab: (e: any, index: number) => void;
  handleChange: (event: React.SyntheticEvent, newValue: string) => void;
  ids: { id: number; name: string }[];
  addItem: (item: any) => void;
  openDialogSelectedStore: () => void;
}
const schema = Validation.shape({});

const Header = (props: IProps) => {
  const {
    tab,
    ids,
    handleAddTab,
    handleRemoveTab,
    handleChange,
    // addItem,
    openDialogSelectedStore,
  } = props;
  // const { t } = useTranslation();
  const { id } = useParams();
  const [isShowAmountInput, setShowAmountInput] = useState<boolean>(false);
  const [openTags, setOpenTags] = useState<boolean>(false);
  const form = useForm<IForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const [openCart, setOpenCart] = useState<boolean>(false);

  const handleSubmit = () => {};

  return (
    <>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          md={12}
          sx={{ ml: 3, mr: 3, mb: 2 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}
        >
          <TabList
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              height: '40px',
              minHeight: '40px',
              display: id ? 'none' : 'inherit',
            }}
          >
            {ids.map((item, index) => (
              <Tab
                style={{
                  padding: '0 12px 10px 12px',
                  backgroundColor:
                    tab === index.toString() ? '#eeeeee' : '#c6c6c6',
                  marginRight: 4,
                  borderRadius: '0px 8px 0 0',
                }}
                key={item.name}
                label={
                  <Fragment>
                    <Stack
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        color:
                          tab === index.toString() ? 'primary.main' : '#000',
                        fontSize: '12px',
                        padding: 0,
                      }}
                    >
                      Hóa đơn {item.name}
                      <Stack
                        justifyContent="center"
                        onClick={(e) => {
                          handleRemoveTab(e, item.id);
                        }}
                      >
                        <CloseIcon />
                      </Stack>
                    </Stack>
                  </Fragment>
                }
                value={index.toString()}
              />
            ))}
          </TabList>
          <ActionButton
            onClick={() => {
              console.log('handleAddTab', handleAddTab);
              handleAddTab();
            }}
            sx={{ height: 30, display: id ? 'none' : 'inherit' }}
          >
            <AddIcon />
          </ActionButton>
        </Grid>
      </Grid>
    </>
  );
};

export default Header;
