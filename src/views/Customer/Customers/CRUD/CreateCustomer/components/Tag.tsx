import AddIcon from '@mui/icons-material/Add';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { Box } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import ProFormContent from 'components/ProForm/ProFormContent';
import ProFormHeader from 'components/ProForm/ProFormHeader';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CustomerInfoType } from '../utils/type';

interface Props {
  form: UseFormReturn<CustomerInfoType>;
}

const Tag = (props: Props) => {
  const { form } = props;
  const { t } = useTranslation();

  const [isShowSearch, setIsShowSearch] = useState<boolean>(false);

  const handleClickShowSearch = () => {
    setIsShowSearch(!isShowSearch);
  };

  return (
    <Paper>
      <ProForm form={form}>
        <ProFormContent mb={2} mt={2}>
          <ProFormHeader>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
              m={2}
            >
              <Grid item xs={12} sm={12} md={10} lg={10}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  <LocalOfferIcon sx={{ marginRight: '8px' }} />
                  Nhãn
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={10} lg={2}>
                <div onClick={handleClickShowSearch}>
                  <Box sx={{ '&:hover': { cursor: 'pointer' } }}>
                    <AddIcon />
                  </Box>
                </div>
              </Grid>
            </Grid>
          </ProFormHeader>
          {isShowSearch && (
            <>
              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
                mt={1}
              >
                <Grid item xs={12} sm={12} md={10} lg={1}>
                  <Checkbox />
                </Grid>
                <Grid item xs={12} sm={12} md={10} lg={10}>
                  <ProFormTextField
                    name="searchTag"
                    placeholder={t('Tìm kiếm nhãn')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
              <Box display="flex" justifyContent="flex-end" m={2.5}>
                <ActionButton
                  variant="contained"
                  color="inherit"
                  onClick={() => setIsShowSearch(false)}
                >
                  Đóng
                </ActionButton>
                <ActionButton
                  variant="contained"
                  color="success"
                  sx={{ marginLeft: '8px' }}
                  // onClick={handleSubmitFilters}
                >
                  Lưu
                </ActionButton>
              </Box>
            </>
          )}
        </ProFormContent>
      </ProForm>
    </Paper>
  );
};

export default Tag;
