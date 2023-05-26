import InfoIcon from '@mui/icons-material/Info';
import { Grid, Paper } from '@mui/material';
import ProForm from 'components/ProForm';
import ProFormContent from 'components/ProForm/ProFormContent';
import ProFormHeader from 'components/ProForm/ProFormHeader';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CustomerInfoType } from '../utils/type';

interface Props {
  form: UseFormReturn<CustomerInfoType>;
}

const GenerallyInfo = (props: Props) => {
  const { form } = props;
  const { t } = useTranslation();

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
              mt={1}
            >
              <Grid item xs={12} sm={12} md={10} lg={11}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  <InfoIcon sx={{ marginRight: '8px' }} />
                  Thông tin
                </div>
              </Grid>
            </Grid>
          </ProFormHeader>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            mt={1}
          >
            <Grid item xs={12} sm={12} md={10} lg={11}>
              <ProFormTextField
                name="company"
                placeholder={t('Công ty')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={10} lg={11}>
              <ProFormTextField
                name="taxCode"
                placeholder={t('Mã số thuế')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={10} lg={11}>
              <ProFormTextField
                name="identity"
                placeholder={t('Số CMND')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={10} lg={11}>
              <ProFormTextField
                name="note"
                placeholder={t('Ghi chú')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={10} lg={11}>
              <ProFormTextField
                name="companyAddress"
                placeholder={t('Địa chỉ công ty')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </ProFormContent>
      </ProForm>
    </Paper>
  );
};

export default GenerallyInfo;
